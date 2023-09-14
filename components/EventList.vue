<template>
    <UTable :loading="eventsStore.pending" :rows="eventsStore.incomingEvents" :columns="userStore.profile?.permissions['fightClub'].find(p => p == 'eventDelete') ? columnsAdmin : columnsGuest" :sort="{ column: 'start_at',  direction: 'asc' }">
        <template #name-data="{row}">
            <div class="w-48 truncate" @click="$emit('showDetails', row)">{{row.name}}</div>
        </template>
        <template #start_at-data="{row}">
            <span class="hidden md:flex capitalize">{{ formatDateLong(row.start_at) }}</span>
            <span class="flex md:hidden">{{  formatDateShort(row.start_at) }}</span>
        </template>
        <template #actions-data="{ row }" >
            <UDropdown class="hidden sm:flex" :items="items(row)">
                <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-horizontal-20-solid" />
            </UDropdown>
        </template>
    </UTable>
</template>

<script setup lang="ts">
import { useEventsStore } from '~/stores/events';

const eventsStore = useEventsStore()
import { useUserStore } from '~/stores/user'
const userStore = useUserStore()
const emit = defineEmits(['editEvent', 'deleteEvent', 'showDetails'])

const columnsGuest = [{
    label: 'Nom',
    key: 'name'
},
{
    label: 'Date',
    key: 'start_at',
    sortable: true
}
]

const columnsAdmin = [{
    label: 'Nom',
    key: 'name'
},
{
    label: 'Date',
    key: 'start_at',
    sortable: true
},
{
    key: "actions"
}
]



const items = (row) => [
[{
    label: "Mofifier l'évenement",
    icon: 'i-heroicons-pencil-square-20-solid',
    click: () => emit('editEvent', row)
}], 
[{
    label: "Annuler",
    icon: 'i-heroicons-trash-20-solid',
    click: () => emit('deleteEvent', row)
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

const formatDate = (date: string) => {
    const eventStart = new Date(date)
    
    return eventStart.toLocaleString('fr-FR', { weekday: "long", year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: "numeric", hour12: false }) 
}

</script>