<template>
    <UCard  :ui="{background: 'bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500', body: { base: 'space-y-4'}}">
        <template #header>
            <div class="flex space-x-2 items-center">
                <UIcon name="i-heroicons-calendar-days-solid" class="text-2xl text-white"/>
                <h4 class="text-xl font-semibold text-white">Réserver une partie</h4>
            </div>
        </template>
        <UForm
        ref="form"
        :state="model"
        :validate="validate"
        @submit.prevent="bookTable"
        >
        
        
        <UFormGroup label="Jeu pratiqué" :ui="labelOptions">
            <USelectMenu v-model="model.game" :options="games"  :ui="selectMenuOptions">
                <template #option="{ option}">
                    <span>{{option.name}}</span>
                </template>
                <template #label>
                    <span>{{model.game?.name ?? "Jeu"}}</span>
                </template>
            </USelectMenu>
        </UFormGroup>
        <UFormGroup  label="Format" :ui="labelOptions">
            <USelectMenu v-model="model.format" :options="games.find(game => game.name === model.game?.name)?.formats" :ui="selectMenuOptions" :disabled="!model.game">
                <template #option="{ option}">
                    <span>{{ `${option.name} - ${option.boardSize.height}"x${option.boardSize.width}"` }}</span>
                </template>
                <template #label>
                    <span>{{model.format?.name ?? "Format de jeu"}}</span>
                </template>
            </USelectMenu>
        </UFormGroup>
        <UFormGroup label="Créneaux de jeu disponibles" :ui="labelOptions">
            <USelectMenu v-model="model.opening_hours" :options="availableHours" :ui="selectMenuOptions" value-attribute="openingHours" :disabled="!model.format">
                <template #option="{ option}">
                    <span>{{ formatDate(option.openingHours.start_at, option.openingHours.end_at) }}</span>
                </template>
                <template #label>
                    <span>{{model.opening_hours ? formatDate(model.opening_hours?.start_at, model.opening_hours?.end_at) : "Créneaux de jeu"}}</span>
                </template>
            </USelectMenu>
        </UFormGroup>
        <UFormGroup label="Horaires" :ui="{'container': 'mt-1 flex w-full items-center', ...labelOptions}">
            <UInput class="time-input" type="time"  v-model="model.start_at"  :ui="selectMenuOptions" :disabled="!model.opening_hours"/>
            <span class="mx-2 text-white">→</span>
            <UInput class="time-input" type="time"  v-model="model.end_at" :ui="selectMenuOptions" :disabled="!model.opening_hours"/>
        </UFormGroup>
        <UFormGroup label="Tables disponible" :ui="labelOptions">
            <USelectMenu v-model="model.table" :options="availableTables" :ui="selectMenuOptions" :disabled="!model.opening_hours">
                <template #option="{ option}">
                    <span>{{ option.name }}</span>
                </template>
                <template #label>
                    <span>{{model.table?.name ?? availableTables ? `${availableTables?.length} tables disponible${availableTables?.length == 1 ? '' : 's'}` : "Impossible de Réserver"}}</span>
                </template>
            </USelectMenu>
        </UFormGroup>
    </UForm>    
    <template #footer>
        <UButton size="xl" color="white" label="Réserver" :ui="selectMenuOptions" @click="bookTable" />
    </template>
    
</UCard>

</template>

<script setup lang="ts" >
import { useBookingRequestsStore } from '~/stores/booking_requests';
import { useOpeningHoursStore } from '~/stores/opening_hours';
import {useTablesStore} from '~/stores/tables'

const bookingRequestStore = useBookingRequestsStore()

const openingHoursStore = useOpeningHoursStore()
const tablesStore = useTablesStore()

const selectMenuOptions = {color: { white: {outline:'shadow-sm bg-gray-800/50 dark:bg-gray-800/50 text-white dark:text-white ring-1 ring-inset ring-gray-700/50  focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400'}}, icon: {base: 'text-white dark:text-white'}}
const labelOptions = {label: { base: "block font-medium text-white dark:text-white"}}
const model = ref({game: null, format: null, opening_hours: null, start_at: null, end_at: null, table: null})
const games = useGamesData

const minHour = ref()
const maxHour = ref()
const availableHours = ref([])
const availableTables = computed(() => {
    if (!model.value.opening_hours) {
        return []
    }
    if (availableHours.value.length == 0) {
        return []
    }
    return availableHours.value.find(hours => hours.openingHours.id === model.value.opening_hours.id)?.tables
})

watch(() => model.value.game, (game) => {
    console.log(game)
    const gameObject = games.find(g => g.name === game.name)

    if (gameObject?.formats.length == 1) {
        model.value.format = gameObject.formats[0]
    } else {
        model.value.format = null
    }
    model.value.opening_hours = null
    model.value.start_at = null
    model.value.end_at = null
    model.value.table = null
})
watch(() =>  model.value.format, (format) => {
    model.value.opening_hours = null
    model.value.start_at = null
    model.value.end_at = null
    model.value.table = null
    
    if (!model.value.format) {
        availableHours.value = []
        return
    }
    const tables = tablesStore.tables
    const allOpeningHours = openingHoursStore.incomingOpeningHours
    const availableOpeningHours = []
    allOpeningHours?.forEach(oh => {
        
        const availableTables = []
        tables?.forEach(table => {
            let booked_width = 0
            table.booking_requests?.forEach(br => {
                if (br.opening_hours === oh.id) {
                    booked_width += br.width
                }
            })
            if ((table.width - booked_width) >= format.boardSize.width) {
                availableTables.push({id: table.id, name: table.name})
            }
        })
        if (availableTables.length > 0) {
            availableOpeningHours.push({openingHours : oh, tables: availableTables})
        }
    })
    
    availableHours.value = availableOpeningHours

})

watch(() => model.value.opening_hours, (openingHour) => {
    model.value.start_at = new Date(openingHour?.start_at).toLocaleTimeString("fr-FR", { hour12: false })
    model.value.end_at = new Date(openingHour?.end_at).toLocaleTimeString("fr-FR", { hour12: false })
})

const validate = () => {
    
}

const bookTable = async () => {
    const day = new Date(model.value.opening_hours.start_at).toDateString()
    const startDate = new Date(day + ' ' + model.value.start_at)
    const endDate = new Date(day + ' ' + model.value.end_at)
    await bookingRequestStore.addBookingRequest({...model.value, start_at: startDate, end_at: endDate})
}

const formatDate = (start: string, end: string) => {
    const eventStart = new Date(start)
    const eventEnd = new Date(end)
    const date = eventStart.toLocaleString('fr-FR', { weekday: "long", year: "numeric", month: "long", day: "numeric"})
    const startTime = eventStart.toLocaleString('fr-FR', { hour: "numeric", minute: "numeric", hour12: false }) 
    const endTime = eventEnd.toLocaleString('fr-FR', { hour: "numeric", minute: "numeric", hour12: false }) 
    
    return `${date} de ${startTime} à ${endTime}`
}

</script>

<style>
input[type="time"]::-webkit-calendar-picker-indicator{
    @apply invert dark:invert-0
}

</style>