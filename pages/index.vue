<template>
  <!-- <Content title="Home" /> -->
  <UContainer>
    <h1> Salut {{ userStore.profile ? userStore.profile.username : ''}} </h1>
    <UCard class="my-4" v-if="userStore.profile?.permissions['fightClub'].find(p => p == 'openingHoursCreate')">
      <template #header>
        <h4>Mes horaires d'ouverture</h4>
      </template>
      <OpeningHoursList />
    </UCard>

  </UContainer>
</template>

<script setup lang="ts">
import { useRolesStore } from '@/stores/roles'
import { useUserStore } from '~/stores/user';

const rolesStore = useRolesStore()
const userStore = useUserStore()




</script>