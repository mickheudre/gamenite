<template>
    <UContainer class="space-y-4">
        <UCard>
            <UserProfileEditor />
        </UCard>
        <UCard >
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
const rolesStore = useRolesStore()

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
