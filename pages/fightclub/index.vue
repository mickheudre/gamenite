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

        <template #event="{ event, view }">
            
            <div class="vuecal__event-title my-2 md:mx-2" v-html="event.title" />
            
            <small class="vuecal__event-time">
                <span>{{ `${event.start.formatTime()}→${event.end.formatTime()}` }}</span>
            </small>

            <div v-if="event.organizer">
                <UTooltip :text="event.organizer.username" >
                    <UAvatar :alt="event.organizer.username" size="sm" />
                </UTooltip>
            </div>
        </template>

    </vue-cal>
    
</UCard>
<EventEditor v-model="isOpen" :event-request="eventRequest" @update="handleEventRequest" @cancel="cancelEvent" :loading="awaitingForResponse"/>

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

const eventsStore = useEventsStore()
const userStore = useUserStore()
const openingHoursStore = useOpeningHoursStore()
const {openingHours, pending} = storeToRefs(openingHoursStore)
const eventsCal = ref([])


eventsStore.events?.forEach(event =>  eventsCal.value.push({ title: event.name, start: new Date(event.start_at), end: new Date(event.end_at), id: event.id, description: event.description, class: "event"}))
openingHours.value?.forEach(event => eventsCal.value.push({ title: "Ouvert", start: new Date(event.start_at), end: new Date(event.end_at), id: event.id, organizer: event.organizer, class: "opening_hour", background: true}))


const awaitingForResponse = ref(false)


const currentEvent = ref(null)
const showDetailsModal = ref(false)

const showDetails = (event) => {
    showDetailsModal.value = true
    currentEvent.value = event
}


const eventRequest : Ref<EventEditionRequest | null> = ref(null)
    
    // Stores a reference to the calendar item that is created by dragging on the calendar, and a function to delete it
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
    
   
    const deleteEvent = async (eventId) => {
        await eventsStore.deleteEvent(eventId)
        const index = eventsCal.value.findIndex(ev => ev.id === eventId && ev.class === 'event')
        if (index != -1) {
            eventsCal.value.splice(index, 1)
        }
    }
    
    const deleteOpeningHour = async (eventId) => {
        await openingHoursStore.deleteOpeningHour(eventId)
        const index = eventsCal.value.findIndex(ev => ev.id === eventId && ev.class === 'opening_hour')
        if (index != -1) {
            eventsCal.value.splice(index, 1)
        }
    }
    
    const basicEventDateTimeToDate = (event: BasicEvent | BasicOpeningHour )  => {
        console.log(new Date(event.date).toDateString() + ' ' + event.start)
        const startDate : Date = new Date(new Date(event.date).toDateString() + ' ' + event.start)
        const endDate : Date = new Date(new Date(event.date).toDateString() + ' ' + event.end)
        return  {startDate, endDate}
    }
    
    const handleEventRequest = async (eventRequest: EventEditionRequest) => {
        awaitingForResponse.value = true
        if (eventRequest.mode === 'create') {
            
            if (eventRequest.event) {
                
                const {startDate, endDate} = basicEventDateTimeToDate(eventRequest.event)
                
                if (eventRequest.type === 'event') {
                    const {data, error } = await eventsStore.addEvent({name: eventRequest.event.name, description: eventRequest.event.description, start_at: startDate, end_at: endDate})
                    if (data && newCalEventObject.event) {
                        newCalEventObject.event.title = data.name
                        newCalEventObject.event.class = "event"
                        newCalEventObject.event.id = data.id
                        newCalEventObject.event.start = new Date(data.start_at)
                        newCalEventObject.event.end = new Date(data.end_at)
                        eventsCal.value.push(newCalEventObject.event)
                    } else {
                        eventsCal.value.push({ title: data.name, start: new Date(data.start_at), end: new Date(data.end_at),id: data.id, class: "event"})
                    }
                }
                if (eventRequest.type === 'opening_hour') {
                    
                    const {data, error} = await openingHoursStore.addOpeningHour({start_at: startDate, end_at: endDate, organizer: eventRequest.event.organizer.id})
                    if (data && newCalEventObject.event) {
                        newCalEventObject.event.title = "Ouvert"
                        newCalEventObject.event.class = "opening_hour"
                        newCalEventObject.event.id = data.id
                        newCalEventObject.event.start = new Date(data.start_at)
                        newCalEventObject.event.end = new Date(data.end_at)
                        newCalEventObject.event.organizer = data.organizer
                        eventsCal.value.push(newCalEventObject.event)
                    } else {
                        eventsCal.value.push({ title: "Ouvert", start:  new Date(data.start_at), end: new Date(data.end_at), id: data.id, class: "opening_hour", organizer: data.organizer})
                        
                    }
                }
                
            }
            
        }
        if (eventRequest.mode === 'edit') {
            
            if (eventRequest.event && eventRequest.id) {
                
                const {startDate, endDate} = basicEventDateTimeToDate(eventRequest.event)
                
                if (eventRequest.type === 'event') {
                    const {data, error} = await eventsStore.updateEvent({id: eventRequest.id, name: eventRequest.event.name, description: eventRequest.event.description, start_at: startDate, end_at: endDate})
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
                
                if (eventRequest.type === 'opening_hour') {
                    const {data, error} = await openingHoursStore.updateOpeningHour({id: eventRequest.id, start_at: startDate, end_at: endDate, organizer: eventRequest.event.organizer.id})
                    
                    if (data) {
                        const found = eventsCal.value.find(ev => ev.id === data.id)
                        if (found) {
                            found.start= new Date(data.start_at)
                            found.end = new Date(data.end_at)
                            found.organizer = data.organizer

                        }
                    }
                }
                
                
            }
            
        }
        
        if (eventRequest.mode === 'delete') {
            if (eventRequest.id) {
                if (eventRequest.type == 'event') {
                    deleteEvent(eventRequest.id)
                }
                if (eventRequest.type == 'opening_hour') {
                    deleteOpeningHour(eventRequest.id)
                }
            }
        }
        
        
        awaitingForResponse.value = false
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
                organizer: event.organizer
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