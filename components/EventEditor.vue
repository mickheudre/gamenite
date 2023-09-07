<template>
  <USlideover>
    <UCard>
      <template #header>
        <h4>{{ props.event.mode == "edit" ? "Modifier un événement" : "Proposer un événement"}}</h4>
      </template>
      <div v-if="props.event.mode == 'create'" >
        <UTabs ref="tabs" :items="eventType" > 
        <template #item="{item}">
          <UCard>
            <template #header>
              <h3>{{ item.label }}</h3>
            </template>
            <div v-if="item.key === 'event'">
              <UFormGroup label="Nom" name="name">
                <UInput v-model="props.event.name" />
              </UFormGroup>
              <UFormGroup label="Date" name="date">
                <UInput type="datetime-local" v-model="props.event.start" />
                <UInput type="datetime-local" v-model="props.event.end" />
              </UFormGroup>
              <UFormGroup label="Description" name="description">
                <UTextarea v-model="props.event.description"/>
              </UFormGroup>
            </div>
            <div v-if="item.key === 'opening_hour'">
              <UFormGroup label="Date" name="date">
                <UInput type="datetime-local" v-model="props.event.start" />
                <UInput type="datetime-local" v-model="props.event.end" />
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
              <h3>Modifier l'événement</h3>
            </template>
            <div>
              <UFormGroup label="Nom" name="name">
                <UInput v-model="props.event.name" />
              </UFormGroup>
              <UFormGroup label="Date" name="date">
                <UInput type="datetime-local" v-model="props.event.start" />
                <UInput type="datetime-local" v-model="props.event.end" />
              </UFormGroup>
              <UFormGroup label="Description" name="description">
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
const emit = defineEmits(['cancel', 'createEvent', 'editEvent'])

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