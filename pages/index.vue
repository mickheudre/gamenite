<template>
  <!-- <Content title="Home" /> -->
  <UContainer class="space-y-8">
    <h1 class="text-xl"> Salut {{ userStore.profile ? userStore.profile.username : ''}} ✌️</h1>
    
    <UCard class="md:w-1/2" :ui="{background: 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500'}" @click="navigateTo('/fightClub')">
      <div class="flex justify-between items-center">
        <NuxtLink to="/fightClub" class="font-bold flex items-center">Fight Club        
        <UBadge v-if="openingHoursStore.isCurrentlyOpen" class="mx-4" color="green" label="Ouvert"/>
</NuxtLink>
        <UButton variant="outline" color="white" icon="i-heroicons-chevron-right"/>
      </div>
        
    </UCard>
    <UCard class="my-4" v-if="userStore.profile?.permissions['fightClub'].find(p => p == 'openingHoursCreate')">
      <template #header>
        <h4>Mes horaires d'ouverture</h4>
      </template>
      <OpeningHoursList />
    </UCard>
  </UContainer>
</template>

<script setup lang="ts">
import { useUserStore } from '~/stores/user';
import { useOpeningHoursStore } from '~/stores/opening_hours';
const userStore = useUserStore()
const openingHoursStore = useOpeningHoursStore()

</script>