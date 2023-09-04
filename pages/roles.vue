<template>
    <h1>Utilisateurs</h1>
    <!-- <UTable :columns="columns" :rows="data" >
        <template #user_id-data="{ row }">
            <span>{{ row.user_id.username }}</span>
        </template>
        <template #org-data="{ row }">
            <span>{{ row.org.name }}</span>
        </template>
        <template #role-data="{ row }">
            
                <div class="flex align-center">
                <UBadge :color="row.role == 'admin' ? 'primary' : 'white'">{{ row.role}}</UBadge>
                <UDropdown :items="items(row)">
                    <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-horizontal-20-solid" />
                    <template #admin="{item}">
                        <UBadge>admin</UBadge>
                    </template>

                    <template #member="{item}">
                        <UBadge color="white" variant="solid">member</UBadge>
                    </template>
                </UDropdown>    
                </div>

        </template>
    </UTable> -->
    
</template>

<script setup lang="ts">
// const userList = useRoles()
// await userList.fetchRoles()

// const items = (row) => [
//   [{
//     label: 'admin',
//     slot: 'admin',
//     click: () => {
//         row.role = 'admin'
//     }
   
//   }, {
//     label: 'member',
//     slot: 'member',
//     click: () => {
//       row.role = 'member'
//     }
//   }]
// ]
// const columns = [{
//     key: 'user_id',
//     label: 'Utilisateur'
// }, {
//     key: 'org',
//     label: 'Organisation'
// }, {
//     key: 'role',
//     label: 'Role'
// }
// ]

// const data = userList.roles.value
</script>
