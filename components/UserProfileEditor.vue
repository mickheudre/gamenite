<script setup lang="ts">
import type { FormError } from '@nuxthq/ui/dist/runtime/types'
import { useUserStore } from '~/stores/user';
import {UserProfile } from "~/types/global"

const userStore = useUserStore()


const state = ref<UserProfile>({
  username : userStore.profile.username,
  firstName: userStore.profile.first_name,
  lastName: userStore.profile.last_name
})

const form = ref()

async function submit () {
    await userStore.updateProfile(state.value)
}
</script>

<template>
  <UForm
    ref="form"
    :state="state"
    @submit.prevent="submit"
  >
    <UFormGroup label="Pseudo" name="username">
      <UInput v-model="state.username" />
    </UFormGroup>

    <UFormGroup label="Prénom" name="firstName">
      <UInput v-model="state.firstName" />
    </UFormGroup>
    <UFormGroup label="Nom" name="lastName">
      <UInput v-model="state.lastName" />
    </UFormGroup>

    <UButton type="submit">
      Submit
    </UButton>
  </UForm>
</template>