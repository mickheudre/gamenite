<template>
    <UContainer >
        <UCard class="my-8">
            <template #header>
                <h4 class="capitalize">événements</h4>
            </template>
            <template #footer>
                <UButton v-if="userStore.profile?.permissions['fightClub'].find(p => p == 'eventCreate') ?? false" icon="i-heroicons-plus" @click="isOpen = true">Proposer un événement</UButton>
            </template>
            <EventList @showDetails="showDetails" @edit-event="editEvent"/>
            
            
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
            :disable-views="['years', 'year', 'month', 'day']"
            :on-event-click="onEventClick">
        </vue-cal>
        <vue-cal v-if="!loading && userCanManageEvent"
        locale="fr"
        :events="eventsCal"
        hide-view-selector
        :time-from="9 * 60"
        :time-to="24 * 60"
        :snap-to-time="15"
        :disable-views="['years', 'year', 'month', 'day']"
        :editable-events="{ title: true, drag: true, resize: true, delete: true, create: true }"
        :drag-to-create-threshold="0"
        @event-create="onEventCreate"
        @event-drag-create="isOpen = true"
        :on-event-click="onEventClick">
    </vue-cal>
    
</UCard>
<EventEditor v-model="isOpen" :event="newEventState" @cancel="isOpen = false" @edit-event="updateEvent" @create-event="submitEvent"/>

</UContainer>
</template>

<script setup lang="ts">
import { useEventsStore } from '~/stores/events';
import { useUserStore } from '~/stores/user'
import { useOpeningHoursStore} from '~/stores/opening_hours'

import VueCal from 'vue-cal'
import 'vue-cal/dist/vuecal.css'

const user = useSupabaseUser()
const eventsStore = useEventsStore()
const userStore = useUserStore()
const openingHoursStore = useOpeningHoursStore()
const eventsCal = ref([])


eventsStore.events?.forEach(event =>  eventsCal.value.push({ title: event.name, start: new Date(event.start_at), end: new Date(event.end_at), class: "demo_event"}))
openingHoursStore.openingHours?.forEach(event => eventsCal.value.push({ title: "Ouvert", start: new Date(event.start_at), end: new Date(event.end_at), class: "opening_hour", background: true}))

// //eventsCal.map(event => { delete Object.assign(event, {['start']: event['start_at'] })['start_at'];})
// console.log(eventsCal)



const currentEvent = ref(null)
const showDetailsModal = ref(false)

const showDetails = (event) => {
    showDetailsModal.value = true
    currentEvent.value = event
}
const newEventState = ref({
    mode: "create",
    name: "Nouvel Evénement",
    id: null,
    description: "",
    start: new Date().toISOString().slice(0, 19),
    end: new Date().toISOString().slice(0, 19)
})

const newEvent = ref({event: null, deleteFunction: null})
const loading = ref(true)
const isOpen = ref(false)

const onEventCreate = (event, deleteEvent) => {
    newEvent.value.event = event
    if (deleteEvent) {
        newEvent.value.deleteFunction = deleteEvent
    }
    const eventStart = new Date(event.start)
    eventStart.setMinutes(eventStart.getMinutes() - eventStart.getTimezoneOffset())
    const eventEnd = new Date(event.end)
    eventEnd.setMinutes(eventEnd.getMinutes() - eventEnd.getTimezoneOffset())
    newEventState.value.start = new Date(eventStart).toISOString().slice(0, 19)
    newEventState.value.end = new Date(eventEnd).toISOString().slice(0, 19)
    return event
}

const cancelEvent = () => {
    isOpen.value = false
    if (newEvent.value.deleteFunction) {
        newEvent.value.deleteFunction()
    }
}

const editEvent = (event) => {
    newEventState.value.mode = 'edit'
    newEventState.value.id = event.id
    newEventState.value.name = event.name
    newEventState.value.description = event.description
    const eventStart = new Date(event.start_at)
    eventStart.setMinutes(eventStart.getMinutes() - eventStart.getTimezoneOffset())
    const eventEnd = new Date(event.end_at)
    eventEnd.setMinutes(eventEnd.getMinutes() - eventEnd.getTimezoneOffset())
    newEventState.value.start = new Date(eventStart).toISOString().slice(0, 19)
    newEventState.value.end = new Date(eventEnd).toISOString().slice(0, 19)
    isOpen.value = true
}

const updateEvent = async (event) => {
    await eventsStore.updateEvent({id: newEventState.value.id, name: newEventState.value.name, description: newEventState.value.description, start_at: new Date(newEventState.value.start), end_at: new Date(newEventState.value.end)})
    isOpen.value = false


}

const submitEvent = () => {
    eventsStore.addEvent({name: newEventState.value.name, description: newEventState.value.description, start_at: new Date(newEventState.value.start), end_at: new Date(newEventState.value.end)})
    isOpen.value = false
}




onMounted(() => {
    loading.value = false
})

const onEventClick = (event, e) => {
    e.stopPropagation()
}

const formatDate = (date: string) => {
    const eventStart = new Date(date)
    
    return eventStart.toLocaleString('fr-FR', { weekday: "long", year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: "numeric", hour12: false }) 
}

const userCanManageEvent = computed(() => {
    const roles = userStore.profile?.roles
    if (roles?.length > 0) {
        if (roles.find(role => (role.org.id == 1) && role.roles.find(role => role === 'admin') )) {
            return true
        }
    }
    return false
})
</script>


<style>

.demo_event {color: #fcf0ff;background-color: #d168ee; }
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