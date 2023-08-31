<template>
    <UContainer>
        <UCard>
            <template #header>
                <h4 class="capitalize">événements</h4>
                <UBadge> {{ roles }}</UBadge>
            </template>
            <template #footer>
                <UButton icon="i-heroicons-plus" @click="isOpen = !isOpen">Proposer un événement</UButton>
            </template>
            <UTable :loading="pending" :rows="data" :columns="columns" >
                <template #start_at-data="{row}">
                    
                    <span>{{ formatDate(row.start_at) }}</span>
                    
                </template>
            </UTable>
        </UCard>
        <USlideover v-model="isOpen">
                <UForm
                ref="form"
                :state="newEventState"
                >
                <UFormGroup label="Nom" name="name">
                    <UInput v-model="newEventState.name" />
                </UFormGroup>
                <UFormGroup label="Date" name="date">
                    <UInput v-model="newEventState.date" type="datetime-local"  />
                </UFormGroup>
                <UButton type="submit">
                    Submit
                </UButton>
            </UForm>

    </USlideover>
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

const newEventState = ref({
    name: "",
    date: "",
    
})
const eventsList = useEvents()
const isOpen = ref(false)
const { pending, data } = await useLazyAsyncData('events', async () =>  await eventsList.fetchEvents())


const formatDate = (date: string) => {
    const eventStart = new Date(date)
    
    return eventStart.toLocaleString('fr-FR', { weekday: "long", year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: "numeric", hour12: false }) 
}
</script>