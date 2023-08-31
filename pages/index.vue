<template>
  <!-- <Content title="Home" /> -->
  <h1> Salut {{ profile?.username }} </h1>
  <UCard class="lg:w-1/4">
    <template #header>
      <h4>Mes Roles</h4>
    </template>
    <UTable :rows="rolesList" :columns="columns">
      <template #org-data={row}>
        <span>{{row.org.name}}</span>
      </template>
      <template #role-data={row}>
        <UBadge>{{row.role}}</UBadge>
      </template>
    </UTable>
  </UCard>
  <UCard class="lg:w-1/4">
    <template #header>
      <h4>Mon Compte</h4>
    </template>
    <UserProfileEditor v-if="profile != null" />
  </UCard>
</template>

<script setup lang="ts">


//  const {data, error} = await supabase
//   .from('subscription')
//   .select('user_id')

// console.log(data)

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
const user = useUser()
const profile = user.profile
const roles = useUserRoles()
const rolesList = roles.roles
</script>