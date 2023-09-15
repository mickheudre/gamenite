<template>
    <UModal >
        <UCard>
            <template #header>
                <div class="flex justify-between items-center">
                    <h4 class="font-bold">{{event?.name  }}</h4>
                    <div class="space-x-4">
                        <UButton icon="i-heroicons-pencil-square" variant="solid" @click="$emit('editEvent', event)" />
                        <UButton icon="i-heroicons-trash" color="red" @click="$emit('deleteEvent', event.id)"/>
                    </div>
                </div>
            </template>
            <div class="border rounded-md items-center flex space-x-2 p-2"><UIcon name="i-heroicons-calendar-days-20-solid"/><span class="capitalize"> {{ `${formatDate(event.start_at)} ${formatTime(event.start_at, event.end_at)}`  }}</span></div>
            
            <div class="list-disc" v-html="markdown" />
            
        </UCard>
    </UModal>
</template>

<script setup lang="ts">
import { marked } from 'marked';

const props= defineProps(["event"])


const formatDate = (date: string) => {
    const eventStart = new Date(date)
    return eventStart.toLocaleString('fr-FR', { weekday: "long", month: "long", day: "numeric"}) 
}
const formatDateShort = (date: string) => {
    const eventStart = new Date(date)
    return eventStart.toLocaleString('fr-FR', { month: "numeric", day: "numeric"}) 
}

const markdown = computed(() => {
    if (!props.event.description) {
        return null
    }
    return marked.parse(props.event.description)
})
const formatTime = (startDate: string, endDate: string) => {
    const eventStart = new Date(startDate)
    const eventEnd = new Date(endDate)
    
    return `${eventStart.toLocaleTimeString("fr-FR", { hour: 'numeric', minute: 'numeric'})}→${eventEnd.toLocaleTimeString("fr-FR", { hour: 'numeric', minute: 'numeric'})}`
}


</script>

<style>
ul { 
    @apply list-disc;
}
li {
    @apply ml-4
}

p {
    @apply my-2
}

a {
    @apply font-semibold;
}
</style>