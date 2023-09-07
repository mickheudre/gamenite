<template>
<USlideover>
    <UCard>
      <template #header>
        <h4>{{ props.event.mode == "edit" ? "Modifier un événement" : "Proposer un événement"}}</h4>
      </template>  
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
        <UButton variant="ghost" @click="$emit('cancel')">Annuler</UButton>
        <UButton @click="validate">Valider</UButton>
    </UCard> 
</USlideover>
</template>

<script setup>
const props = defineProps(['event'])
const emit = defineEmits(['cancel', 'createEvent', 'editEvent'])

const validate = () => {
  if (props.event.mode == 'edit') {
    emit('editEvent', props.event)
  } else {
    emit('createEvent', props.event)
  }
}
</script>