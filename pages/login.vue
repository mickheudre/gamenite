<template>
    <div>
      <button @click="signIn">
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
import { useAuthStore } from "../stores/auth"

const auth = useAuthStore()

const email = ref('')
const password = ref('')

const signIn = async () => {
    auth.signIn(email.value, password.value)
}


watch(auth, () => {
  if (auth.isLoggedIn) {
    return navigateTo('/')
  }
}, { immediate: true })
</script>
