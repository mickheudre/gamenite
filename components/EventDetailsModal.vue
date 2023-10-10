<template>
    <UModal >
        <UCard>
            <template #header>
                <div class="flex justify-between items-center">
                    <h4 class="font-bold text-xl mb-4">{{event?.name  }}</h4>
                </div>
                <div class="flex justify-between items-center">
                    <span class="capitalize">{{ formatDate(event.start_at) }}</span>
                    <div class="border rounded-md items-center flex space-x-2 p-1 px-2"><UIcon name="i-heroicons-clock"/><span > {{ `${formatTime(event.start_at, event.end_at)}`  }}</span></div>
                    
                </div>
            </template>
            
            <div class="list-disc" v-html="markdown" />
            <div class="my-4">
                <a v-if="event.url" :href="event?.url" >Inscription</a>
            </div>
        </UCard>
    </UModal>
</template>

<script setup lang="ts">
import { marked } from 'marked';
import { useUserStore } from '~/stores/user';

const props= defineProps(["event"])
const userStore = useUserStore()

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

const canManageEvents = computed(() => {
    return userStore.profile?.permissions['fightClub'].find(p => p == 'eventEdit') 
})

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