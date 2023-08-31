<template>
  <!-- <Content title="Home" /> -->
  <UContainer>
    <h1> Salut {{ userStore.profile ? userStore.profile.username : ''}} </h1>
    <UCard >
      <template #header>
        <h4>Mes Roles</h4>
      </template>
      <UTable :rows="rolesStore.roles" :columns="columns" :loading="rolesStore.pending">
        <template #org-data={row}>
          <span>{{row.org.name}}</span>
        </template>
        <template #role-data={row}>
          <UBadge>{{row.role}}</UBadge>
        </template>
      </UTable>
    </UCard>
    <UCard >
      <!-- <template #header>
        <h4>Mon Compte</h4>
      </template>
      <UserProfileEditor v-if="profile != null" /> -->
    </UCard>
  </UContainer>
</template>

<script setup lang="ts">
import { useRolesStore } from '@/stores/roles'
import { useUserStore } from '~/stores/user';

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
// const user = useUser()
// const profile = user.profile.data
const supabase = useSupabaseClient()
const user = useSupabaseUser()


console.log(userStore.profile)

</script>