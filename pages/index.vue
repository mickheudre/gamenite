<template>
  <!-- <Content title="Home" /> -->
  <h1> Salut {{ profile?.username }} </h1>
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
const user = useUser()
const profile = user.profile

</script>