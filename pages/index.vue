<template>
  <h1>Hello {{ username }}</h1>
  <button @click="logout">Logout</button>
</template>

<script setup lang="ts">
const user = useSupabaseUser()
const supabase = useSupabaseClient()

const username = ref("")
 await supabase
  .from('users')
  .select('username').then((data) => { username.value = data.data[0].username })


const logout = async () => {
  await supabase.auth.signOut()
}

watch(user, () => {
  if (!user.value) {
    return navigateTo('/login')
  }
}, { immediate: true })

</script>