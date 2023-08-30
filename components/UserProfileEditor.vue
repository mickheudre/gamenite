<script setup lang="ts">
import type { FormError } from '@nuxthq/ui/dist/runtime/types'
import {UserProfile } from "~/types/global"

const user = useUser()
const profile = user.profile

const state = ref<UserProfile>({
  username: profile.value.username,
  firstname: profile.value.firstname,
  lastname: profile.value.lastname

})

const validate = (state: any): FormError[] => {
//   const errors = []
//   if (!state.email) errors.push({ path: 'email', message: 'Required' })
//   if (!state.password) errors.push({ path: 'password', message: 'Required' })
  return [{ path: 'email', message: 'Required' }]
}

const form = ref()

async function submit () {
    await user.updateProfile(state.value)
}
</script>

<template>
  <UForm
    ref="form"
    :validate="validate"
    :state="state"
    @submit.prevent="submit"
  >
    <UFormGroup label="Pseudo" name="username">
      <UInput v-model="state.username" />
    </UFormGroup>

    <UFormGroup label="Prénom" name="firstName">
      <UInput v-model="state.firstname" />
    </UFormGroup>
    <UFormGroup label="Nom" name="lastName">
      <UInput v-model="state.lastname" />
    </UFormGroup>

    <UButton type="submit">
      Submit
    </UButton>
  </UForm>
</template>