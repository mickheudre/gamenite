<template>
    <UCard  :ui="{background: 'bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500', body: { base: 'space-y-4'}}">
        <template #header>
            <div class="flex space-x-2 items-center">
                <UIcon name="i-heroicons-calendar-days-solid" class="text-2xl text-white"/>
                <h4 class="text-xl font-semibold text-white">Réserver une partie {{ props.openingHours? formatDate(props.openingHours.start_at) : ""}}</h4>
            </div>
        </template>
        <UForm
        ref="form"
        :state="model"
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
        <UFormGroup label="Horaires" :ui="{'container': 'mt-1 flex w-full items-center', ...labelOptions}">
            <UInput class="time-input" type="time"  v-model="model.start_at"  :ui="selectMenuOptions" :disabled="!model.opening_hours"/>
            <span class="mx-2 text-white">→</span>
            <UInput class="time-input" type="time"  v-model="model.end_at" :ui="selectMenuOptions" :disabled="!model.opening_hours"/>
        </UFormGroup>
        <UFormGroup label="Tables disponible" :ui="labelOptions">
            <USelectMenu v-model="model.table" :options="bookableTables" :ui="selectMenuOptions" :disabled="!model.opening_hours">
                <template #option="{ option}">
                    <span>{{ option.name }}</span>
                </template>
                <template #label>
                    <span>{{model.table?.name ?? bookableTables ? `${bookableTables?.length} tables disponible${bookableTables?.length == 1 ? '' : 's'}` : "Impossible de Réserver"}}</span>
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

const props = defineProps(['openingHours'])
const emits = defineEmits(['bookingSuccess'])

const formatTime = (dateTime) => {
    const date = new Date(dateTime)
    return date.toLocaleTimeString("fr", {hour: "numeric", minute: "numeric"})
}
const selectMenuOptions = {color: { white: {outline:'shadow-sm bg-gray-800/50 dark:bg-gray-800/50 text-white dark:text-white ring-1 ring-inset ring-gray-700/50  focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400'}}, icon: {base: 'text-white dark:text-white'}}
const labelOptions = {label: { base: "block font-medium text-white dark:text-white"}}
const model = ref({game: null, format: null, opening_hours: props.openingHours, start_at: formatTime(props.openingHours.start_at), end_at: formatTime(props.openingHours.end_at), table: null})
const games = useGamesData

const minHour = ref()
const maxHour = ref()
const bookableTables = ref([])


// watch(() => props.openingHours, (openingHours) => {
    //     console.log(prop.openingHours)
    //     model.value.opening_hours = openingHours
    //     model.value.start_at = openingHours.start_at
    //     model.value.end_at = openingHours.end_at
    // })
    watch(() => model.value.game, (game) => {
        const gameObject = games.find(g => g.name === game.name)
        
        if (gameObject?.formats.length == 1) {
            model.value.format = gameObject.formats[0]
        } else {
            model.value.format = null
        }
        
        model.value.table = null
    })
    watch(() =>  model.value.format, (format) => {
        
        model.value.table = null
        
        if (!model.value.format) {
            bookableTables.value = []
            return
        }
        const tables = tablesStore.tables
        const availableTables = []        
        tables?.forEach(table => {
            let booked_width = 0
            table.booking_requests?.forEach(br => {
                if (br.opening_hours === props.openingHours.id) {
                    booked_width += br.width
                }
            })
            if ((table.width - booked_width) >= format.boardSize.width) {
                availableTables.push({id: table.id, name: table.name})
            }
        })

        
        
        bookableTables.value = availableTables
        
    })
    
    
    
    const validate = () => {
        
    }
    
    const bookTable = async () => {
        const day = new Date(model.value.opening_hours.start_at).toDateString()
        const startDate = new Date(day + ' ' + model.value.start_at)
        const endDate = new Date(day + ' ' + model.value.end_at)
        await bookingRequestStore.addBookingRequest({...model.value, start_at: startDate, end_at: endDate})
        emits('bookingSuccess')
    }
    
    const formatDate = (start: string) => {
        const eventStart = new Date(start)
        const date = eventStart.toLocaleString('fr-FR', { weekday: "long", year: "numeric", month: "long", day: "numeric"})
        
        return `${date}`
    }
    
    
</script>

<style>
input[type="time"]::-webkit-calendar-picker-indicator{
    @apply invert dark:invert-0
}

</style>