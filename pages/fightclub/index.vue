<template>
    <UContainer>
        <UCard>
            <template #header>
                <h4 class="capitalize">événements</h4>

            </template>
            <UTable :loading="pending" :rows="data" :columns="columns" >
                <template #start_at-data="{row}">
                    
                    <span>{{ formatDate(row.start_at) }}</span>
                    
                </template>
            </UTable>
        </UCard>
    </UContainer>
    
</template>

<script setup lang="ts">
const columns = [{
    label: 'Nom',
    key: 'name'
},
{
    label: 'Date',
    key: 'start_at'
}
]
const eventsList = useEvents()

const { pending, data } = await useLazyAsyncData('events', async () =>  await eventsList.fetchEvents())


const formatDate = (date: string) => {
    const eventStart = new Date(date)
    
    return eventStart.toLocaleString('fr-FR', { weekday: "long", year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: "numeric", hour12: false }) 
}
</script>