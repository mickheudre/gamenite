<template>
    <UContainer class="flex flex-col  justify-center h-screen space-y-8" :ui="{'constrained': 'max-w-2xl'}">
        <a href="#" class="text-2xl font-semibold text-gray-900 dark:text-white mx-auto">
            Tabletop Social Club  
        </a>
        <UCard class="" >
            <h4 class="text-lg font-semibold mb-4">Se Connecter</h4>
            <UForm
            ref="form"
            :state="state"
            :validate="validate"
            @submit.prevent="submit"
            >
            <UFormGroup class="my-4 mt-8" label="Email" name="email">
                <UInput v-model="state.email"/>
            </UFormGroup>
            <UFormGroup class="my-4 mb-8" label="Mot de passe" name="password">
                <UInput v-model="state.password" type="password" />
            </UFormGroup>
            <UButton type="submit" label="Se connecter" size="xl" :loading="loading" :disabled="form?.errors?.length > 0" trailing/>
        </UForm>
    </UCard> 
</UContainer>
</template>

<script setup lang="ts">
import { useUserStore } from '~/stores/user';
import { ref } from 'vue'
import type { FormError, FormSubmitEvent } from '@nuxt/ui/dist/runtime/types'

const userStore = useUserStore()
definePageMeta({
    layout: "lean",
});

const form = ref()
const auth = useAuth()

watch(() => userStore.profile, (newProfile) => {
    if (newProfile) {
        if (newProfile.username && newProfile.first_name && newProfile.last_name) {
            navigateTo('/')
        } else {
            navigateTo('/firstconnection')
        }
    }
})

const state = ref({ email: undefined, password: undefined})
const loading = ref(false)

const validate = (state: any): FormError[] => {
    const errors = []
    if (!state.email) errors.push({ path: 'email', message: 'Email requit' })
    if (!state.password) errors.push({ path: 'password', message: 'Mot de passe requit' })
    return errors
}

const submit = async (event: FormSubmitEvent<any>) => {

    if (state.value.email && state.value.password){
        loading.value = true
        await auth.signIn({email: state.value.email, password: state.value.password})
        loading.value = false
    }
    
    
}

</script>
