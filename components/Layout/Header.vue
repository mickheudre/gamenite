<template>
    <div class="relative sticky top-0 w-full flex justify-between items-center px-4 md:px-8 pt-4 pb-3 dark:bg-gray-900 z-50">
        <NuxtLink class="font-bold text-lg" to="/">Tabletop Social Club</NuxtLink>
        <div class="flex items-centrer space-x-2 md:space-x-4">
            <ColorModeSelector />
            <UButton v-if="!user"><NuxtLink to="/login">Se connecter</NuxtLink></UButton>
            <UDropdown v-else :items="items" :popper="{ placement: 'bottom-start' }">
                <UAvatar :alt="userStore.profile?.username" size="md" />
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