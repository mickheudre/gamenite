<template>
    <UTable :loading="eventsStore.pending" :rows="eventsStore.incomingEvents" :columns="userStore.profile?.permissions['fightClub'].find(p => p == 'eventDelete') ? columnsAdmin : columnsGuest" :sort="{ column: 'start_at',  direction: 'asc' }">
        <template #name-data="{row}">
            <UButton @click="$emit('showDetails', row)" variant="link">{{row.name}}</UButton>
        </template>
        <template #start_at-data="{row}">
            <span>{{ formatDate(row.start_at) }}</span>
        </template>
        <template #actions-data="{ row }" >
            <UDropdown :items="items(row)">
                <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-horizontal-20-solid" />
            </UDropdown>
        </template>
    </UTable>
</template>

<script setup lang="ts">
import { createElementBlock } from 'nuxt/dist/app/compat/capi';
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
    label: "Supprimer",
    icon: 'i-heroicons-trash-20-solid',
    click: () => emit('deleteEvent', row)
}]
]

const formatDate = (date: string) => {
    const eventStart = new Date(date)
    
    return eventStart.toLocaleString('fr-FR', { weekday: "long", year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: "numeric", hour12: false }) 
}

</script>