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
                    <UIcon name="i-heroicons-building-storefront" class="text-2xl"/>
                    
                    <h4 class="text-xl font-semibold">Planning de la semaine</h4>
                </div>
            </template>
            <vue-cal v-if="!loading"
            locale="fr"
            :events="eventsCal"
            hide-view-selector
            :time-from="9 * 60"
            :time-to="24 * 60"
            :disable-views="['years', 'year', 'month', 'day']"
            :on-event-click="onEventClick">
            
            <template  #title="{ title, view }">
                <span class="capitalize font-semibold text-lg"> {{ calendarTitle(view.startDate)  }}</span>
            </template>
            
            
            <template #event="{ event, view }">
                <div class="relative h-full w-full p-2 z-0" @click="onEventClick(event, null)">

                    <div class="relative vuecal__event-title md:mx-2 text-white text-sm  font-semibold my-2 items-center justify-center z-30 " >
                        <UIcon v-if="event.class=='opening_hour'" class="text-xl" name="i-heroicons-building-storefront" />
                        <UIcon v-if="event.class=='event'" class="text-xl" name="i-heroicons-trophy" />

                        <span class="hidden sm:block">{{ event.title }}</span>
                    </div>
                    
                    <small class="relatice vuecal__event-time text-white z-30">
                        <div class="flex flex-col md:flex-row justify-center items-center"><span>{{ event.start.formatTime() }}</span><span>→</span><span>{{ event.end.formatTime() }}</span></div>
                    </small>
                    
                    <div class="relative flex flex-col justify-end items-center my-4 z-30">
                        <UButton v-if="event.class=='opening_hour' && userCanBookTable" @click="bookTable(event)" variant="ghost" color="black">Réserver une table</UButton>
                    </div>
                    <div v-if="event.class=== 'event'" class="absolute top-0 left-0.5 sm:left-1.5 bottom-0 w-0.5 sm:w-1.5 bg-jungle-green-500 -z-10">
                    </div>
                </div>
            </template>
        </vue-cal>
        
    </UCard>
    <UCard id="calendrier" class="my-8">
        <template #header>
        <div class="flex items-center space-x-4">
            <UIcon name="i-heroicons-calendar-days" class="text-2xl"/>
            <h4 class="text-xl font-semibold">Prochains événements</h4>
        </div>
    </template>
        <EventList @showDetails="showDetails" @edit-event="editEvent" @delete-event="deleteEvent"/>
        
        
        <EventDetailsModal v-model="showDetailsModal" :event="currentEvent" @deleteEvent="deleteEvent" @edit-event="editEvent">
        </EventDetailsModal>
    </UCard>
    
    <EventEditor v-model="isOpen" :event-request="eventRequest" @update="handleEventRequest" @cancel="cancelEvent" :loading="awaitingForResponse"/>
    
</UContainer>
<UModal v-model="bookingFormVisible">
    <UCard>
        <TableBookingSimpleWidget  :opening-hours="bookingInfo" @booking-success="onBookingSuccess"/>
    </UCard>
</UModal>
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
const toast = useToast()

const bookingFormVisible = ref(false)
const bookingInfo = ref()
eventsStore.events?.forEach(event =>  eventsCal.value.push({ title: event.name, start: new Date(event.start_at), end: new Date(event.end_at), id: event.id, description: event.description, class: "event"}))
openingHours.value?.forEach(event => eventsCal.value.push({ title: "Ouvert", start: new Date(event.start_at), end: new Date(event.end_at), id: event.id, organizer: event.organizer, class: "opening_hour", background: true}))


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

const bookTable = (event) => {
    const openingHours = openingHoursStore.openingHours?.find(oh => oh.id === event.id)
    bookingInfo.value = openingHours
    bookingFormVisible.value = true
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
    
    const links = [
    {
        label: 'Planning de la semaine',
        icon: 'i-heroicons-home',
        links: '#planning'
    }, {
        label: 'Evénements',
        icon: 'i-heroicons-calendar-days',
        links: '#calendrier'
    }]
    
    
    
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
        showDetailsModal.value = false
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
                    console.log(data, error)
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
    
    const onBookingSuccess = () => {
        bookingFormVisible.value = false
        toast.add({title: "Table réservée avec succés !"})
        
    }   
    
    
    
    onMounted(() => {
        loading.value = false
    })
    
    const onEventClick = (event, e) => {
        if (event.class == 'event') {
            
            const found = eventsStore.events?.find(ev => ev.id === event.id)
            if (found) {

                showDetailsModal.value  = true
                currentEvent.value = found
            }
            
        }
        
        if (e) {
            e.stopPropagation()
        }
    }
    
    const formatDate = (date: string) => {
        const eventStart = new Date(date)
        
        return eventStart.toLocaleString('fr-FR', { weekday: "long", year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: "numeric", hour12: false }) 
    }
    
    const userCanBookTable = computed(() => {
        return userStore.profile?.permissions['fightClub'].find(p => p == 'bookTable')
    })
</script>


<style>

.event {
    @apply rounded-md text-white bg-gradient-to-r from-primary-600 to-primary-500;
}
.opening_hour { 
    @apply rounded-md text-white bg-gradient-to-b from-jungle-green-500 to-jungle-green-400;
}

.vuecal__cell--selected {
    @apply bg-transparent;
}

.vuecal__cell--today {
    @apply bg-transparent;
}

.vuecal__no-event {
    @apply hidden
}

.vuecal__title-bar {
    @apply bg-transparent
}

/* .vuecal__title-bar {
    @apply hidden;
} */


.vuecal__time-cell-label {
    @apply text-xs leading-10 ml-1
};


.vuecal__time-column {
    @apply w-0 sm:w-10 
};
.vuecal--view-with-time .vuecal__weekdays-headings {
    @apply pl-0 sm:pl-10
};


</style>