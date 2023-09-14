<template>
  <!-- <Content title="Home" /> -->
  <UContainer>
    <h1> Salut {{ userStore.profile ? userStore.profile.username : ''}} </h1>
    <UCard class="my-4">
      <template #header>
        <h4>Mes horaires d'ouverture</h4>
      </template>
      <OpeningHoursList />
    </UCard>
    <UCard class="my-4">
      <template #header>
        <h4>Mes Roles</h4>
      </template>
      <UTable :rows="rolesStore.roles" :columns="columns" :loading="rolesStore.pending">
        <template #org-data={row}>
          <NuxtLink to="/fightclub">{{row.org.name}}</NuxtLink>
        </template>
        <template #role-data={row}>
          <UBadge class="mx-2" v-for="role in row.roles">{{role}}</UBadge>
        </template>
      </UTable>
    </UCard>
  </UContainer>
</template>

<script setup lang="ts">
import { useRolesStore } from '@/stores/roles'
import { useUserStore } from '~/stores/user';

const supabase = useSupabaseClient()
const user = useSupabaseUser()

const rolesStore = useRolesStore()
const userStore = useUserStore()

const columns = [
{
  label: "Organisation",
  key: "org"
},
{
  label: "Role",
  key: "role"
}
]


</script>