<template>
    <UContainer class="py-4 sm:py-16" :ui="{'constrained': 'max-w-2xl'}">
        <UCard>
                <h4 class="text-4xl font-bold my-4 mb-8">Bienvenue sur Tabletop Social Club</h4>
                <h5>Avant de continuer, merci de bien vouloir compléter votre profil.</h5>

                <UForm
                ref="form"
                :state="state"
                :validate="validate"
                @submit.prevent="submit"
                
                >
                <div class="space-y-4 my-8">
                <UFormGroup label="Nom d'utilisateur" description="Le nom qui sera affiché aux autres utilisateur.ice.s" name="username" :ui="{'description': 'text-gray-500 dark:text-gray-400 text-sm'}">
                    <UInput v-model="state.username" />
                </UFormGroup>
                
                <UFormGroup label="Prénom" name="firstName">
                    <UInput v-model="state.firstName" />
                </UFormGroup>
                <UFormGroup label="Nom" name="lastName">
                    <UInput v-model="state.lastName" />
                </UFormGroup>
            </div>
                <div class="flex justify-center items-center mt-12 my-8">
                    <UButton size="xl" type="submit" icon="i-heroicons-check-circle" trailing :loading="loading">
                        Continuer
                    </UButton>
                </div>
                
            </UForm>
            
   
    </UCard>
</UContainer>

</template>

<script setup lang="ts">
import { useUserStore } from '~/stores/user';
import {UserProfile } from "~/types/global"

const userStore = useUserStore()

definePageMeta({
    layout: 'lean',
});


const validate = (state: any): FormError[] => {
  const errors = []
  if (!state.username) errors.push({ path: 'username', message: 'Nom d\'utilisateur manquant' })
  if (!state.firstName) errors.push({ path: 'firstName', message: 'Prénom manquant' })
  if (!state.lastName) errors.push({ path: 'lastName', message: 'Nom manquant' })
  return errors
}

const loading = ref(false)

const state = ref<UserProfile>({
    username : userStore.profile.username,
    firstName: userStore.profile.first_name,
    lastName: userStore.profile.last_name
})

const form = ref()

async function submit () {
    loading.value = true
    await userStore.updateProfile(state.value)
    loading.value = false
    navigateTo('/')
}
</script>
