<template>
    <div class="relative sticky top-0 w-full flex justify-between items-center p-4">
        <NuxtLink to="/">Gamenite</NuxtLink>
        <div class="flex items-centrer md:space-x-4">
            <ColorModeSelector />
            <UButton v-if="!user"><NuxtLink to="/login">Se connecter</NuxtLink></UButton>
            <UDropdown v-else :items="items" :popper="{ placement: 'bottom-start' }">
                <UAvatar :alt="userStore.profile?.username" size="lg" />
            </UDropdown>
        </div>
        
    </div>
</template>

<script setup lang="ts">
const user = useSupabaseUser()

import { useUserStore } from '@/stores/user'

const auth = useAuth()
const userStore = useUserStore()

const items = [
[{
    label: 'Profil',
    icon: 'i-heroicons-user',
    click: () => {
        navigateTo('/account')
    }
}], 
[{
    label: 'Se déconnecter',
    icon: 'i-heroicons-pencil-square-20-solid',
    click: () => {
        auth.signOut()
    }
}
]]
</script>