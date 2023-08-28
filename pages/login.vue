<template>
    <div>
      <button @click="signInWithOtp">
        Sign In with E-Mail
      </button>
      <input
        v-model="email"
        type="email"
      />
      <input
        v-model="password"
        type="password"
      />
    </div>
</template>

<script setup lang="ts">
const supabase = useSupabaseClient()
const user = useSupabaseUser()

const email = ref('')
const password = ref('')

const signInWithOtp = async () => {

  const { data, error } = await supabase.auth.signInWithPassword({
  email: email.value,
  password: password.value,
})
  if (error) console.log(error)
}


watch(user, () => {
  if (user.value) {
    return navigateTo('/')
  }
}, { immediate: true })
</script>
