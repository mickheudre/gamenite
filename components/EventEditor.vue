<template>
  <USlideover>
    <UCard>
      <template #header>
        <h4>{{ props.event.mode == "edit" ? "Modifier un événement" : "Proposer un événement"}}</h4>
      </template>
      <div v-if="props.event.mode == 'create'" >
        <UTabs ref="tabs" :items="eventType" :default-index="props.event.type == 'event' ? 1 : 0 "> 
        <template #item="{item}">
          <UCard>
            <template #header>
              <div>
                <h3>{{ item.label }}</h3>
              </div>
            </template>
            <div v-if="item.key === 'event'">
              <UFormGroup label="Nom" name="name">
                <UInput v-model="props.event.name" />
              </UFormGroup>
              <UFormGroup label="Date" name="date">
                <DatePicker v-model="props.event.start" :on-update:model-value="props.event.end.setDate(props.event.start.getDate())"/>
              </UFormGroup>
              <UFormGroup label="Horaires">
                <div class="flex items-center">
                <TimePicker v-model="props.event.start" />
                <span class="mx-2">→</span>
                <TimePicker v-model="props.event.end" />
                </div>
                
              </UFormGroup>
             
              <UFormGroup label="Description" name="description">
                <UTextarea v-model="props.event.description"/>
              </UFormGroup>
            </div>
            <div v-if="item.key === 'opening_hour'">
              <UFormGroup label="Date" name="date">
                <DatePicker v-model="props.event.start" :on-update:model-value="props.event.end.setDate(props.event.start.getDate())"/>
              </UFormGroup>
              <UFormGroup label="Horaires">
                <div class="flex items-center">
                <TimePicker v-model="props.event.start" />
                <span class="mx-2">→</span>
                <TimePicker v-model="props.event.end" />
                </div>
                
              </UFormGroup>
            </div>
            <template #footer>
              <UButton variant="ghost" @click="$emit('cancel')">Annuler</UButton>
              <UButton @click="validate(item.key)">Valider</UButton>
            </template>
          </UCard>
          
        </template> 
      </UTabs>
      </div>
      <div v-if="props.event.mode == 'edit'">
        <UCard>
            <template #header>
              <div class="flex justify-between">
                <h3 v-if="props.event.type === 'event'">Modifier l'événement</h3>
                <h3 v-if="props.event.type === 'opening_hour'">Modifier l'horaire d'ouverture</h3>

                <UButton icon="i-heroicons-trash-20-solid" color="red" @click="emit('deleteEvent', props.event)"/>
              </div>
            </template>
            <div>
              <UFormGroup v-if="props.event.type === 'event'" label="Nom" name="name">
                <UInput v-model="props.event.name" />
              </UFormGroup>
              <UFormGroup label="Date" name="date">
                <UInput type="datetime-local" v-model="props.event.start" />
                <UInput type="datetime-local" v-model="props.event.end" />
              </UFormGroup>
              <UFormGroup v-if="props.event.type === 'event'" label="Description" name="description">
                <UTextarea v-model="props.event.description"/>
              </UFormGroup>
            </div>
            
            <template #footer>
              <UButton variant="ghost" @click="$emit('cancel')">Annuler</UButton>
              <UButton @click="validate('event')">Valider</UButton>
            </template>
          </UCard>
      </div>
      
    </UCard> 
    
  </USlideover>
</template>

<script setup>
const props = defineProps(['event'])
const emit = defineEmits(['cancel', 'createEvent', 'editEvent', 'deleteEvent'])


const eventDay = ref(props.event.start)
const eventDayEnd = ref(props.event.end)

const validate = (eventType) => {

  if (props.event.mode == 'edit') {
    emit('editEvent', props.event)
  } else {
    props.event.type = eventType
    emit('createEvent', props.event)
  }
}




const eventType = [
{
  key: 'opening_hour',
  label: "Horaires d'ouverture"
},
{
  key: 'event',
  label: 'Evénement'
}
]



</script>