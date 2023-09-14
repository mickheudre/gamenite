<template>
    <UTable :loading="openingHoursStore.pending" :rows="openingHoursStore.userOpeningHours" :columns="columns" :sort="{ column: 'start_at',  direction: 'asc' }">
        <template #name-data="{row}">
            <UButton @click="$emit('showDetails', row)" variant="link">{{row.name}}</UButton>
        </template>
        <template #date-data="{row}">
            <span class="hidden md:flex capitalize">{{ formatDateLong(row.start_at) }}</span>
            <span class="flex md:hidden">{{  formatDateShort(row.start_at) }}</span>
        </template>
        <template #time-data="{ row }">
            <div class="flex items-center"><UIcon class="mx-1" name="i-heroicons-clock"/><span>{{ formatTime(row.start_at, row.end_at) }}</span></div>
        </template>
        <template #org-data="{row}">
            <span>{{row.org.name}}</span>
        </template>
        <template #actions-data="{ row }" >
            <UDropdown :items="items(row)">
                <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-horizontal-20-solid" />
            </UDropdown>
        </template>
    </UTable>
</template>

<script setup lang="ts">
import { useOpeningHoursStore } from '~/stores/opening_hours';

const openingHoursStore = useOpeningHoursStore()

import { useUserStore } from '~/stores/user'
const userStore = useUserStore()
const emit = defineEmits(['editEvent', 'deleteEvent', 'showDetails'])


const columns = [
{
    label: 'Date',
    key: 'date',
    sortable: true
},
{
    label: 'Horaires',
    key: 'time'
},
{
    label: 'Lieu',
    key: 'org'
},
{
    key: "actions"
}
]



const items = (row) => [
[{
    label: "Annuler",
    icon: 'i-heroicons-trash-20-solid',
    click: () => openingHoursStore.deleteOpeningHour(row.id)
}]
]

const formatDateLong = (date: string) => {
    const eventStart = new Date(date)
    return eventStart.toLocaleString('fr-FR', { weekday: "long", month: "long", day: "numeric"}) 
}
const formatDateShort = (date: string) => {
    const eventStart = new Date(date)
    return eventStart.toLocaleString('fr-FR', { month: "numeric", day: "numeric"}) 
}

const formatTime = (startDate: string, endDate: string) => {
    const eventStart = new Date(startDate)
    const eventEnd = new Date(endDate)

    return `${eventStart.toLocaleTimeString("fr-FR", { hour: 'numeric', minute: 'numeric'})}→${eventEnd.toLocaleTimeString("fr-FR", { hour: 'numeric', minute: 'numeric'})}`
}


</script>