<template>
    <UForm 
    :validate="validateEvent"
    :state="state"
    @submit.prevent="submit"
    >
    <UFormGroup label="Date" name="date">
        <DatePicker v-model="state.date" />
    </UFormGroup>
    <UFormGroup label="Horaires" name="time">
        <div class="flex items-center">
            <UInput type="time" v-model="state.start" />
            <span class="mx-2">→</span>
            <UInput type="time" v-model="state.end" />
        </div>
    </UFormGroup>
    <UFormGroup label="Responsable" name="time">
        <USelectMenu v-model="state.organizer" :options="orgStore.keyHolders"  searchable searchable-placeholder="Rechercher ..."> 
            <template #label>
                {{ orgStore.keyHolders?.find(member => member.id == state.organizer.id).username }}
            </template>
            <template #option="{ option }">
                {{ option.username }}
            </template>
        </USelectMenu>
    </UFormGroup>
    <UButton variant="ghost" @click="$emit('cancel')">Annuler</UButton>
    <UButton type="submit" :loading="props.loading">Valider</UButton>
</UForm>

</template>


<script setup lang="ts">

import { ref } from 'vue'
import type { FormError, FormSubmitEvent } from '@nuxt/ui/dist/runtime/types'
import { EventEditionRequest } from '~/types/global';
import { useUserStore } from '~/stores/user';
import { useOrgStore } from '~/stores/org'

const userStore = useUserStore()
const orgStore = useOrgStore()

const props = defineProps({
    eventRequest: Object as PropType<EventEditionRequest>,
        loading: Boolean
        
    })
    const emit = defineEmits(['eventRequest', 'cancel'])
    const organiser = ref()

    const state = ref({
        date: props.eventRequest?.event?.date ?? new Date(),
        start: props.eventRequest?.event?.start ?? "10:00",
        end: props.eventRequest?.event?.end ?? "18:00",
        organizer: props.eventRequest?.event?.organizer ?? { id : userStore.profile.id, username : userStore.profile.username }
    })
    
    const validateEvent = (state: any): FormError[] => {
        const errors = []
        if (state.start > state.end) errors.push({path: 'time', message:"Horaires incohérents"})
        return errors
    }
    
    async function submit (event: FormSubmitEvent<any>) {
        emit('eventRequest', {event: Object.assign({}, state.value), id: props.eventRequest?.id ?? undefined, type: 'opening_hour', mode: props.eventRequest?.mode ?? "create"})
    }
    
    
</script>