<template>
  <USlideover>
    <UCard>
      <template #header>
        <h4>{{ props.eventRequest?.mode === 'edit' ? "Modifier un événement" : "Proposer un événement"}}</h4>
      </template>
      <UTabs ref="tabs" :items="eventType" :default-index="props.eventRequest.type == 'event' ? 1 : 0"> 
        <template #item="{item}">
          <UCard>
            <template #header>
              <div class="flex justify-between">
                <h3>{{ item.label }}</h3>
                <UButton v-if="props.eventRequest?.mode === 'edit'" icon="i-heroicons-trash" color="red" @click="deleteEvent"/>                
              </div>
            </template>
            <EventEditorForm v-if="item.key === 'event'" :event-request="eventRequest"  @event-request="handleEventRequest" @cancel="emit('cancel')" :loading="props.loading"/>
            <OpeningHourEditorForm v-if="item.key === 'opening_hour'" :event-request="eventRequest"  @event-request="handleEventRequest" @cancel="emit('cancel')" :loading="props.loading"/>
            
          </UCard>
          
        </template> 
      </UTabs>
    </UCard> 
    
  </USlideover>
</template>

<script setup lang="ts">
import { BasicEvent, EventEditionRequest } from '~/types/global';
import { useUserStore } from '~/stores/user';
const props = defineProps<{eventRequest: EventEditionRequest, loading: Boolean}>()
const userStore = useUserStore()

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
    type: props.eventRequest.type,
    id: props.eventRequest.id
  })
}

const eventType = computed(() => {
  const types = []
  if (userStore.profile?.permissions['fightClub'].find(p => p == 'openingHoursCreate')) {
      types.push({
      key: 'opening_hour',
      label: "Horaires d'ouverture",
      disabled: props.eventRequest.mode == 'edit' && props.eventRequest.type == 'event'
    })
    }
  if (userStore.profile?.permissions['fightClub'].find(p => p == 'eventCreate')) {
    types.push(
      {
        key: 'event',
        label: 'Evénement',
        disabled: props.eventRequest.mode == 'edit' && props.eventRequest.type == 'opening_hour'
      })}
   
    
    return types
  })
</script>
