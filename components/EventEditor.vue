<template>
  <USlideover>
    <UCard>
      <template #header>
        <h4>{{ props.eventRequest?.mode === 'edit' ? "Modifier un événement" : "Proposer un événement"}}</h4>
      </template>
        <UTabs ref="tabs" :items="eventType"> 
          <template #item="{item}">
            <UCard>
              <template #header>
                <div class="flex justify-between">
                  <h3>{{ item.label }}</h3>
                  <UButton v-if="props.eventRequest?.mode === 'edit'" icon="i-heroicons-trash-20-solid" color="red" @click="deleteEvent"/>                
                </div>
              </template>
                <EventEditorForm v-if="item.key === 'event'" :event="eventRequest.event"  @event-request="handleEventRequest" @cancel="emit('cancel')"/>
                <OpeningHourEditorForm v-if="item.key === 'opening_hour'" :event="eventRequest.event"  @event-request="handleEventRequest" @cancel="emit('cancel')"/>
      
            </UCard>
            
          </template> 
        </UTabs>
    </UCard> 
    
  </USlideover>
</template>

<script setup lang="ts">
import { BasicEvent, EventEditionRequest } from '~/types/global';

const props = defineProps<{eventRequest: EventEditionRequest}>()

const emit = defineEmits<{
  update: [value: EventEditionRequest],
  cancel: []
}>()


const handleEventRequest= (request : EventEditionRequest) => {
  emit('update', 
   request
  )
}

const deleteEvent = () => {
  emit('update', {
    mode: 'delete',
    type: 'event',
    id: props.eventRequest.id
  })
}

const eventType = computed(() => [
{
  key: 'opening_hour',
  label: "Horaires d'ouverture",
  disabled: props.eventRequest.mode == 'edit' && props.eventRequest.type == 'event'
},
{
  key: 'event',
  label: 'Evénement',
  disabled: props.eventRequest.mode == 'edit' && props.eventRequest.type == 'opening_hour'

}
])



</script>