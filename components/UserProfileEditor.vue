<script setup lang="ts">
import type { FormError } from '@nuxthq/ui/dist/runtime/types'
import {UserProfile } from "~/types/global"

const user = useUser()
const profile = user.profile




const form = ref()

async function submit () {
    await user.updateProfile(state.value)
}
</script>

<template>
  <UForm
    ref="form"
    :state="profile"
    @submit.prevent="submit"
  >
    <UFormGroup label="Pseudo" name="username">
      <UInput v-model="profile.username" />
    </UFormGroup>

    <UFormGroup label="Prénom" name="firstName">
      <UInput v-model="profile.first_name" />
    </UFormGroup>
    <UFormGroup label="Nom" name="lastName">
      <UInput v-model="profile.last_name" />
    </UFormGroup>

    <UButton type="submit">
      Submit
    </UButton>
  </UForm>
</template>