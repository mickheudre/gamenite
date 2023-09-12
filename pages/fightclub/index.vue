<template>
    <UContainer >
        <UCard class="my-8">
            <template #header>
                <h4 class="capitalize">événements</h4>
            </template>
            <template #footer>
                <UButton v-if="userStore.profile?.permissions['fightClub'].find(p => p == 'eventCreate') ?? false" icon="i-heroicons-plus" @click="createEvent">Proposer un événement</UButton>
            </template>
            <EventList @showDetails="showDetails" @edit-event="editEvent" @delete-event="deleteEvent"/>
            
            
            <UModal v-model="showDetailsModal">
                <UCard>
                    <template #header>
                        <div class="flex justify-between">
                            <h4>{{currentEvent?.name  }}</h4>
                            <UButton icon="i-heroicons-calendar-days-20-solid" :label="formatDate(currentEvent.start_at)" />
                        </div>
                    </template>
                    <span>{{ currentEvent?.description }}</span>
                    
                </UCard>
            </UModal>
        </UCard>
        <UCard class="my-8">
            <vue-cal v-if="!loading && !userCanManageEvent"
            locale="fr"
            :events="eventsCal"
            hide-view-selector
            :time-from="9 * 60"
            :time-to="24 * 60"
            :disable-views="['years', 'year', 'month', 'day']">
        </vue-cal>
        <vue-cal v-if="!loading && userCanManageEvent"
        locale="fr"
        :events="eventsCal"
        hide-view-selector
        :time-from="9 * 60"
        :time-to="24 * 60"
        :snap-to-time="15"
        :disable-views="['years', 'year', 'month', 'day']"
        :editable-events="{ title: false, drag: false, resize: false, delete: false, create: true }"
        :drag-to-create-threshold="0"
        @event-create="onEventCreateStart"
        @event-drag-create="onEventCreate"
        :on-event-click="onEventClick">
    </vue-cal>
    
</UCard>
<EventEditor v-model="isOpen" :event-request="eventRequest" @edit-event="updateEvent" @update="submitEvent" @delete-event="deleteItem" @cancel="cancelEvent"/>

</UContainer>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useEventsStore } from '~/stores/events';
import { useOpeningHoursStore } from '~/stores/opening_hours';
import { useUserStore } from '~/stores/user';


import VueCal from 'vue-cal';
import 'vue-cal/dist/vuecal.css';
import { BasicEvent, BasicOpeningHour, EventEditionRequest } from '~/types/global';

const user = useSupabaseUser()
const eventsStore = useEventsStore()
const userStore = useUserStore()
const openingHoursStore = useOpeningHoursStore()
const {openingHours, pending} = storeToRefs(openingHoursStore)
const eventsCal = ref([])


eventsStore.events?.forEach(event =>  eventsCal.value.push({ title: event.name, start: new Date(event.start_at), end: new Date(event.end_at), id: event.id, description: event.description, class: "event"}))
openingHours.value?.forEach(event => eventsCal.value.push({ title: "Ouvert", start: new Date(event.start_at), end: new Date(event.end_at),id: event.id, class: "opening_hour", background: true}))





const currentEvent = ref(null)
const showDetailsModal = ref(false)

const showDetails = (event) => {
    showDetailsModal.value = true
    currentEvent.value = event
}

const newEventState = ref({
    mode: "create",
    type: "event",
    name: "Nouvel Evénement",
    id: null,
    description: "",
    start: new Date(),
    end: new Date()
})


const eventRequest : Ref<EventEditionRequest | null> = ref(null)

const newCalEventObject = reactive({event: null, deleteFunction: null})
const loading = ref(true)
const isOpen = ref(false)

watch(isOpen, (value) => {
    if (value === false) {
        if (newCalEventObject.event) {
            newCalEventObject.event = null
        }
        if (newCalEventObject.deleteFunction) {
            newCalEventObject.deleteFunction()
            newCalEventObject.deleteFunction = null
        }
    }
})

const onEventCreateStart = (event, deleteEvent) => {
    if (newCalEventObject.event == null) {
        newCalEventObject.event = event
    }
    
    if (deleteEvent) {
        newCalEventObject.deleteFunction = deleteEvent
    }
    return event
}
const onEventCreate = (event) => {

    eventRequest.value = {
        mode: 'create',
        type: 'opening_hour',
        event: {
            name: "Nouvel Evénement",
            date: new Date(event.start),
            start: new Date(event.start).toLocaleTimeString("fr", {hour: 'numeric', minute: 'numeric'}),
            end: new Date(event.end).toLocaleTimeString("fr", {hour: 'numeric', minute: 'numeric'}),
        }
    }

    console.log(eventRequest)

    // newEventState.value.mode = "create"
    // newEventState.value.name = "Nouvel Evénement"
    // newEventState.value.type = "opening_hour"
    // const eventStart = new Date(event.start)
    // eventStart.setMinutes(eventStart.getMinutes() )
    // const eventEnd = new Date(event.end)
    // eventEnd.setMinutes(eventEnd.getMinutes())
    // newEventState.value.start = new Date(eventStart)
    // newEventState.value.end = new Date(eventEnd)
    isOpen.value = true
    return event
}

const cancelEvent = () => {
    isOpen.value = false
    if (newCalEventObject.event) {
        newCalEventObject.event = null
    }
    if (newCalEventObject.deleteFunction) {
        newCalEventObject.deleteFunction()
        newCalEventObject.deleteFunction = null
    }
}

const editEvent = (event) => {


    eventRequest.value = {
        mode: 'edit',
        type: 'event',
        id: event.id,
        event: {
            name: event.name,
            date: new Date(event.start_at),
            start: new Date(event.start_at).toLocaleTimeString("fr", {hour: 'numeric', minute: 'numeric'}),
            end: new Date(event.end_at).toLocaleTimeString("fr", {hour: 'numeric', minute: 'numeric'}),
            description: event.description
        }
    }

    isOpen.value = true
}


const createEvent = () => {
    eventRequest.value = {
        mode: 'create',
        type: 'event'
    }
    isOpen.value = true
}

const updateEvent = async (event) => {
    
    if (event.type === 'opening_hour') {
        const {data, error} = await openingHoursStore.updateOpeningHour({id: newEventState.value.id, start_at: new Date(newEventState.value.start), end_at: new Date(newEventState.value.end)})
        
        if (data) {
            const found = eventsCal.value.find(ev => ev.id === data.id)
            if (found) {
                found.start= new Date(data.start_at)
                found.end = new Date(data.end_at)
            }
        }
    }    
    
    if (event.type === 'event') {
        const {data, error} = await eventsStore.updateEvent({id: newEventState.value.id, name: newEventState.value.name, description: newEventState.value.description, start_at: new Date(newEventState.value.start), end_at: new Date(newEventState.value.end)})
        
        if (data) {
            const found = eventsCal.value.find(ev => ev.id === data.id)
            if (found) {
                found.title = data.name
                found.start= new Date(data.start_at)
                found.end = new Date(data.end_at)
                found.description = data.description
            }
        }
        
    }
    
    isOpen.value = false
    
}

const deleteEvent = async (event) => {
    await eventsStore.deleteEvent(event.id)
        const index = eventsCal.value.findIndex(ev => ev.id === event.id && ev.class === 'event')
        if (index != -1) {
            eventsCal.value.splice(index, 1)
        }
}

const deleteOpeningHour = async (event) => {
    await openingHoursStore.deleteOpeningHour(event.id)
        const index = eventsCal.value.findIndex(ev => ev.id === event.id && ev.class === 'opening_hour')
        if (index != -1) {
            eventsCal.value.splice(index, 1)
        }
}

const deleteItem  = async (event) => {
    if (event.type === 'event') {
       await deleteEvent(event)
    }
    
    if (event.type === 'opening_hour') {
       await deleteOpeningHour(event)
    }
    
    isOpen.value = false
    
}

const submitEvent = async (eventRequest: EventEditionRequest) => {

    console.log(eventRequest)
    
    // if (newEventState.value.type === "opening_hour") {
    //     const {data, error} = await openingHoursStore.addOpeningHour({start_at: new Date(newEventState.value.start), end_at: new Date(newEventState.value.end)})
    //     if (data && newEvent.event) {
    //         newEvent.event.title = "Ouvert"
    //         newEvent.event.class = "opening_hour"
    //         newEvent.event.id = data.id
    //         eventsCal.value.push(newEvent.event)
    //     } else {
    //         eventsCal.value.push({ title: "Ouvert", start: new Date(data.start_at), end: new Date(data.end_at),id: data.id, class: "opening_hour"})

    //     }
        
    //     isOpen.value = false
    //     newEvent.event = null
    //     newEvent.deleteFunction = null
    //     return
    // }
    
    // const {data, error } = await eventsStore.addEvent({name: newEventState.value.name, description: newEventState.value.description, start_at: new Date(newEventState.value.start), end_at: new Date(newEventState.value.end)})
    
    // if (newEvent.event) {
    //     newEvent.event.title = data.name
    //     newEvent.event.class = "demo_event"
    //     newEvent.event.id = data.id
    //     eventsCal.value.push(newEvent.event)
    // } else {
    //     eventsCal.value.push({ title: data.name, start: new Date(data.start_at), end: new Date(data.end_at),id: data.id, class: "demo_event"})
    // }
    
    isOpen.value = false
    newCalEventObject.event = null
    newCalEventObject.deleteFunction = null
}




onMounted(() => {
    loading.value = false
})

const onEventClick = (event, e) => {

    eventRequest.value = {
        mode: 'edit',
        type: event.class,
        id: event.id,
        event: {
            name: event.title,
            description: event.description,
            date: new Date(event.start),
            start: new Date(event.start).toLocaleTimeString("fr", {hour: 'numeric', minute: 'numeric'}),
            end: new Date(event.end).toLocaleTimeString("fr", {hour: 'numeric', minute: 'numeric'}),
        }
    }
        
        isOpen.value = true    
    
    e.stopPropagation()
}

const formatDate = (date: string) => {
    const eventStart = new Date(date)
    
    return eventStart.toLocaleString('fr-FR', { weekday: "long", year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: "numeric", hour12: false }) 
}

const userCanManageEvent = computed(() => {
  return userStore.profile?.permissions['fightClub'].find(p => p == 'eventCreate')
})
</script>


<style>

.event {color: #fcf0ff;background-color: #d168ee; }
.opening_hour {  background:
    #fff7f0
    repeating-linear-gradient(
    -45deg,
    #65b891,
    #65b891 5px,
    #93e5ab 5px,
    #93e5ab 15px
    );
    
    border-color: #65b891;
    border-width: 2px;
    color: 4e878c}
    
    
    
    .closed {
        background:
        #fff7f0
        repeating-linear-gradient(
        -45deg,
        rgba(255, 162, 87, 0.25),
        rgba(255, 162, 87, 0.25) 5px,
        rgba(255, 255, 255, 0) 5px,
        rgba(255, 255, 255, 0) 15px
        );
        color: #f6984c;
    }
    
    @media (min-width: 640px) {
        .opening_hour>.vuecal__event-time  {
            display: none;
        }
    }
    @media (max-width: 640px) {
        .vuecal__time-cell-label {
            @apply hidden 
        };
        
        .vuecal__time-column {
            @apply w-0
        };
        .vuecal--view-with-time .vuecal__weekdays-headings {
            @apply pl-0 
        };
    }
    
</style>