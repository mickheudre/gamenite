<template>
    <h1>Utilisateurs</h1>
    <UTable :rows="data" />

</template>

<script setup lang="ts">
const userList = useUserList()
await userList.fetchUsers()

const data = userList.userList.value
</script>
