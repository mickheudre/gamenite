<template>
    <div class="flex w-full">
        <!-- <UCard class="flex-none h-fit sticky top-48 mx-8">
            <h5 class="font-bold mb-4 mx-4 text-gray-400 dark:text-gray-300">Fight Club</h5>
            <UVerticalNavigation :links="links" />
        </UCard> -->
        
        <UContainer class="grow">
            <h1 class="text-2xl font-bold">Bienvenue au Fight Club</h1>
            <UCard id="planning" class="my-8" :ui="{ body: { padding: 'p-2 sm:p-4' } }">
                <template #header>
                    <div class="flex items-center space-x-4">
                        <UIcon name="i-heroicons-home" class="text-2xl"/>
                        
                        <h4 class="text-xl font-semibold">Cette semaine au club</h4>
                    </div>
                </template>
                <vue-cal v-if="!loading && !userCanManageEvent"
                locale="fr"
                :events="eventsCal"
                hide-view-selector
                :time-from="9 * 60"
                :time-to="24 * 60"
                :disable-views="['years', 'year', 'month', 'day']">
                
                <template  #title="{ title, view }">
                    <span class="capitalize font-semibold text-lg"> {{ calendarTitle(view.startDate)  }}</span>
                </template>
                
                
                <template #event="{ event, view }">
                    
                    <div class="vuecal__event-title my-2 md:mx-2 text-white flex flex-col items-center justify-center" >
                        <span>{{ event.title }}</span>
                        
                    </div>
                    
                    <small class="vuecal__event-time text-white">
                        <div class="flex flex-col md:flex-row justify-center items-center"><span>{{ event.start.formatTime() }}</span><span>→</span><span>{{ event.end.formatTime() }}</span></div>
                    </small>
                    
                    <div class="flex flex-col justify-end items-center h-auto">
                        <UTooltip class="m-2" v-if="event.organizer" :text="event.organizer.username" >
                            <UAvatar :alt="event.organizer.username" size="sm" />
                        </UTooltip>
                        <UButton v-if="event.class=='opening_hour'" @click="" variant="link">Réserver une table</UButton>
                    </div>
                    
                </template>
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
            :drag-to-create-threshold="15"
            :drag-to-create-event="allowDragAndDrop"
            @cell-dblclick="onEventCreateClick"
            @event-create="onEventCreateStart"
            @event-drag-create="onEventCreate"
            :on-event-click="onEventClick">
            
            <template  #title="{ title, view }">
                <span class="capitalize font-semibold text-lg"> {{ calendarTitle(view.startDate)  }}</span>
            </template>
            
            <template #event="{ event, view }">
                
                <div class="vuecal__event-title my-2 md:mx-2 text-white flex flex-col items-center justify-center" >
                    <span>{{ event.title }}</span>
                    
                </div>
                
                <small class="vuecal__event-time text-white">
                    <div class="flex flex-col md:flex-row justify-center items-center"><span>{{ event.start.formatTime() }}</span><span>→</span><span>{{ event.end.formatTime() }}</span></div>
                </small>
                
                <div class="flex flex-col justify-end items-center h-auto">
                    <UTooltip class="m-2" v-if="event.organizer" :text="event.organizer.username" >
                        <UAvatar :alt="event.organizer.username" size="sm" />
                    </UTooltip>
                </div>
                
            </template>
            
        </vue-cal>
        
    </UCard>
    <UCard id="calendrier" class="my-8">
        <div class="flex items-center space-x-4">
            <UIcon name="i-heroicons-calendar-days" class="text-2xl"/>
            <h4 class="text-xl font-semibold">Prochains événements</h4>
        </div>
        <template #footer>
            <div class="flex justify-end">
                <UButton v-if="userStore.profile?.permissions['fightClub'].find(p => p == 'eventCreate') ?? false" icon="i-heroicons-plus" @click="createEvent" size="lg">Ajouter un événement</UButton>
                
            </div>
        </template>
        <EventList @showDetails="showDetails" @edit-event="editEvent" @delete-event="deleteEvent"/>
        
        
        <EventDetailsModal v-model="showDetailsModal" :event="currentEvent" @deleteEvent="deleteEvent" @edit-event="editEvent">
        </EventDetailsModal>
    </UCard>
    
    <EventEditor v-model="isOpen" :event-request="eventRequest" @update="handleEventRequest" @cancel="cancelEvent" :loading="awaitingForResponse"/>
    
</UContainer>
</div>

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


eventsStore.events?.forEach(event =>  eventsCal.value.push({ title: event.name, start: new Date(event.start_at), end: new Date(event.end_at), id: event.id, description: event.description, url: event.url, class: "event"}))
openingHours.value?.forEach(event => eventsCal.value.push({ title: "Ouvert", start: new Date(event.start_at), end: new Date(event.end_at), id: event.id, organizer: event.organizer, class: "opening_hour"}))


const awaitingForResponse = ref(false)

const calendarTitle = (date : string) => {
    return new Date(date).toLocaleDateString("fr", { month: "long", year: "numeric"})
}

const allowDragAndDrop = computed(() => {
    return window.innerWidth > 640
})

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
    
    
    const onEventCreateClick = (event) => {
        
        const start = new Date(event)
        start.setMinutes(0)
        const end = new Date(start)
        end.setHours(start.getHours() + 4)
        eventRequest.value = {
            mode: 'create',
            type: 'opening_hour',
            event: {
                name: "Nouvel Evénement",
                date: new Date(start),
                start: new Date(start).toLocaleTimeString("fr", {hour: 'numeric', minute: 'numeric'}),
                end: new Date(end).toLocaleTimeString("fr", {hour: 'numeric', minute: 'numeric'}),
            }
        }
        
        
        isOpen.value = true
    }
    
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
                description: event.description,
                url: event.url
            }
        }
        showDetailsModal.value = false
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
        
        showDetailsModal.value = false
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
                    const {data, error } = await eventsStore.addEvent({name: eventRequest.event.name, description: eventRequest.event.description, start_at: startDate, end_at: endDate, url: eventRequest.event.url})
                    if (data && newCalEventObject.event) {
                        newCalEventObject.event.title = data.name
                        newCalEventObject.event.class = "event"
                        newCalEventObject.event.id = data.id
                        newCalEventObject.event.description = data.description
                        newCalEventObject.event.url = data.url
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
                    const {data, error} = await eventsStore.updateEvent({id: eventRequest.id, name: eventRequest.event.name, description: eventRequest.event.description, start_at: startDate, end_at: endDate, url: eventRequest.event.url})
                    if (data) {
                        const found = eventsCal.value.find(ev => ev.id === data.id)
                        if (found) {
                            found.title = data.name
                            found.start= new Date(data.start_at)
                            found.end = new Date(data.end_at)
                            found.description = data.description
                            found.url = data.url
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
    
    const links = [
    {
        label: 'Planning de la semaine',
        icon: 'i-heroicons-home'
    }, {
        label: 'Evénements',
        icon: 'i-heroicons-calendar-days'
    },
    {
        label: 'Informations pratiques',
        icon: 'i-heroicons-information-circle'
    },
{
    label: "Espace administrateur",
    icon: 'i-heroicons-key',
    to: 'fightClub/admin'
}]
    
    
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
                organizer: event.organizer,
                url: event.url
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
        return userStore.profile?.permissions['fightClub'].find(p => p == 'eventCreate' || p == 'openingHoursCreate')
    })
</script>

