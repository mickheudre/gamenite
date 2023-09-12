<template>
        <UForm 
        :validate="validateEvent"
        :state="state"
        @submit.prevent="submit"
        >
        <UFormGroup label="Nom" name="name">
            <UInput v-model="state.name" />
        </UFormGroup>
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
        <UFormGroup label="Description" name="description">
            <UTextarea v-model="state.description"/>
        </UFormGroup>
        <UButton variant="ghost" @click="$emit('cancel')">Annuler</UButton>
        <UButton type="submit">Valider</UButton>
    </UForm>

</template>


<script setup lang="ts">


import type { PropType } from 'vue'

import type { FormError, FormSubmitEvent } from '@nuxt/ui/dist/runtime/types'
import { BasicEvent } from '~/types/global';

const props = defineProps({
    event: Object as PropType<BasicEvent>
    })
const emit = defineEmits(['eventRequest', 'eventUpdated', 'cancel'])

const state = ref({
    name: props.event?.name ?? "Nouvel Evénement",
    date: props.event?.date ?? new Date(),
    start: props.event?.start ?? "10:00",
    end: props.event?.end ?? "18:00",
    description: props.event?.description ?? undefined
})

const validateEvent = (state: any): FormError[] => {
    const errors = []
    if (!state.name) errors.push({ path: 'name', message: 'L\'événement n\'a pas de nom' })
    if (state.start > state.end) errors.push({path: 'time', message:"Horaires incohérents"})
    return errors
}

async function submit (event: FormSubmitEvent<any>) {
    if (props.event) {
        emit('eventRequest', {event: state, type: 'event', mode: 'edit'} )
    } else {
        emit ('eventRequest', {event: state, type: 'event', mode: 'create'})
    }
    
}



</script>