<template>
    <UContainer >
        <UCard class="my-8">
            <template #header>
                <h4 class="capitalize">événements</h4>
            </template>
            <template #footer>
                <!-- <UButton icon="i-heroicons-plus" @click="isOpen = !isOpen">Proposer un événement</UButton> -->
            </template>
            <UTable :loading="eventsStore.pending" :rows="eventsStore.events" :columns="columns" >
                <template #start_at-data="{row}">
                    
                    <span>{{ formatDate(row.start_at) }}</span>
                    
                </template>
            </UTable>
        </UCard>
        <UCard class="my-8">
            <vue-cal v-if="!loading && !user"
            :events="eventsCal"
            hide-view-selector
            :time-from="9 * 60"
            :time-to="24 * 60"
            :disable-views="['years', 'year', 'month', 'day']">
        </vue-cal>
        <vue-cal v-if="!loading && user"
            :events="eventsCal"
            hide-view-selector
            :time-from="9 * 60"
            :time-to="24 * 60"
            :snap-to-time="15"
            :disable-views="['years', 'year', 'month', 'day']"
            :editable-events="{ title: true, drag: true, resize: true, delete: true, create: true }"
            :drag-to-create-threshold="0"
            @event-drag-create="onEventCreate">
            
        </vue-cal>

    </UCard>
    <USlideover v-model="isOpen">

        <UFormGroup label="Nom" name="name">
            <UInput v-model="newEventState.name" />
        </UFormGroup>
        <UFormGroup label="Date" name="date">
            <UInput v-model="newEventState.start" type="datetime-local"  />
            <UInput v-model="newEventState.end" type="datetime-local"  />

            <!-- <UInput v-model="newEventState.end" type="datetime-local"  /> -->

        </UFormGroup>
        <UButton type="submit" @click="submitEvent">
            Submit
        </UButton>    
</USlideover>
</UContainer>
</template>

<script setup lang="ts">
import { useEventsStore } from '~/stores/events';
import { useOpeningHoursStore} from '~/stores/opening_hours'

import VueCal from 'vue-cal'
import 'vue-cal/dist/vuecal.css'

const user = useSupabaseUser()
const eventsStore = useEventsStore()
const openingHoursStore = useOpeningHoursStore()
const eventsCal = ref([])


eventsStore.events?.forEach(event =>  eventsCal.value.push({ title: event.name, start: new Date(event.start_at), end: new Date(event.end_at), class: "demo_event"}))
openingHoursStore.openingHours?.forEach(event => eventsCal.value.push({ title: "Ouvert", start: new Date(event.start_at), end: new Date(event.end_at), class: "opening_hour"}))

// //eventsCal.map(event => { delete Object.assign(event, {['start']: event['start_at'] })['start_at'];})
// console.log(eventsCal)




const columns = [{
    label: 'Nom',
    key: 'name'
},
{
    label: 'Date',
    key: 'start_at'
}
]

const newEventState = ref({
    name: "",
    start: "",
    end: ""
})


const loading = ref(true)
const isOpen = ref(false)

const onEventCreate = (event, deleteEventFunction) => {
    const eventStart = new Date(event.start)
    eventStart.setMinutes(eventStart.getMinutes() - eventStart.getTimezoneOffset())
    const eventEnd = new Date(event.end)
    eventEnd.setMinutes(eventEnd.getMinutes() - eventEnd.getTimezoneOffset())
    newEventState.value.start = new Date(eventStart).toISOString().slice(0, 19)
    newEventState.value.end = new Date(eventEnd).toISOString().slice(0, 19)
    isOpen.value = true
}


const submitEvent = () => {
    eventsStore.addEvent({name: newEventState.value.name, start_at: new Date(newEventState.value.start), end_at: new Date(newEventState.value.end)})
}

onMounted(() => {
    loading.value = false
})


const formatDate = (date: string) => {
    const eventStart = new Date(date)
    
    return eventStart.toLocaleString('fr-FR', { weekday: "long", year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: "numeric", hour12: false }) 
}


</script>


<style>

.demo_event {color: #fcf0ff;background-color: #d168ee;}
.opening_hour {  background:
    #fff7f0
    repeating-linear-gradient(
      -45deg,
      #65b891,
      #65b891 5px,
      #93e5ab 5px,
      #93e5ab 15px
    );
color: 4e878c}

.opening_hour>.vuecal__event-time  {
    display: none;
}

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

</style>