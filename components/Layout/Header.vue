<template>
    <div class="relative w-full flex justify-between p-4">
        <span>Gamenite</span>
        <UDropdown :items="items" :popper="{ placement: 'bottom-start' }">
            <UAvatar :alt="userStore.profile.username" size="lg" />
        </UDropdown>
        
    </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user'

const auth = useAuth()
const userStore = useUserStore()

const items = [
[{
    label: 'Profil'
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