<template>
    <UContainer>
        <UCard>
            <UTable :rows="orgStore.members" :columns="columns" :loading="orgStore.pending">
                <template #member-data="{ row}" >
                    <span>{{ row.user.username }}</span>
                </template>
                <template #roles-data="{ row}" >
                    
                    <UBadge v-for="role in row.roles" :key="role" :color="roleToColor[role]" :label="role" class="mx-1" />
                    
                </template>
                <template #edit-data="{ row }">
                    <UDropdown class="hidden sm:flex" :items="items(row)">
                        <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-horizontal-20-solid"/>
                    </UDropdown>
                </template>
            </UTable>
            <template #footer>
                <UButton icon="i-heroicons-plus" label="Ajouter un membre" @click="inviteUser"/>
            </template>
        </UCard>
    </UContainer>
    <USlideover v-model="showSlideOver">
        <UCard >
            <template #header>
                <div v-if="currentMember.mode === 'edit'" class="flex justify-between">
                    <span>Mettre à jour un utilisateur</span>    
                          
                </div>
                <div v-else>
                    <h4>Ajouter un utilisateur</h4>
                </div>
            </template>
            <UCard class="space-y-4" v-if="currentMember.mode === 'edit'">
                
                <template #header>
                    <div class="flex justify-between items-center">
                        <span>{{ currentMember.user.username }}</span>
                        <UButton  icon="i-heroicons-trash" color="red" @click="deleteUser(currentMember.user.id)"/>         
                    </div>
                </template>
                <!-- <USelect searchable searchable-placeholder="Search a person..."></USelect> -->
                <UFormGroup label="Rôles">
                    <USelectMenu v-model="currentMember.roles" :options="rolesList" multiple >
                        <template  #label>
                            <UBadge v-for="role in currentMember.roles" :key="role" :color="roleToColor[role]" :label="role" />
                        </template>
                    </USelectMenu>
                </UFormGroup>
            </UCard>
            <UCard  v-else>
                <template #header>
                    <span>Nouvel Utilisateur</span>
                </template>
                <div class="space-y-4">
                <UFormGroup label="Utilisateur">
                    <USelectMenu   v-model="currentMember.user" :options="usersList" option-attribute="username" searchable>
                        <template #label>
                            {{  currentMember.user ? currentMember.user.username : "Sélectionner un utilisateur" }}
                        </template>
                    </USelectMenu>
                </UFormGroup>
                <UFormGroup label="Rôles">
                    <USelectMenu v-model="currentMember.roles" :options="rolesList" multiple >
                        <template  #label>
                            <UBadge v-for="role in currentMember.roles" :key="role" :color="roleToColor[role]" :label="role" />
                        </template>
                    </USelectMenu>
                </UFormGroup>
            </div>
            </UCard>
            
            <template #footer>
                <UButton variant="ghost" @click="showSlideOver = false">Annuler</UButton>
                <UButton type="submit" @click="updateMember">Valider</UButton>
            </template>
        </UCard>
    </USlideover>
    
</template>

<script setup lang="ts">
import { useOrgStore} from '~/stores/org'
const supabase = useSupabaseClient()

const orgStore = useOrgStore()

const showSlideOver = ref(false)

const currentMember = ref({
    mode: "edit",
    user: null,
    roles: null
}
)


const {pending, data: usersList, error, refresh} =  useLazyAsyncData('usersList', async () =>  {
    const {data , error : ErrorUser}  = await supabase
    .from('users')
    .select('*')
    return data
})

console.log(usersList)

const inviteUser = () => {
    currentMember.value.mode = "create"
    currentMember.value.roles = null
    currentMember.value.roles = ["member"]
    showSlideOver.value = true
}

const updateMember = () => {
    if (currentMember.value.mode == "edit") {
        orgStore.updateRoles(currentMember.value.user.id, [...currentMember.value.roles])
    }
    if (currentMember.value.mode == "create") {
        orgStore.createRoles(currentMember.value.user.id, [...currentMember.value.roles])

    }
    showSlideOver.value = false
}

const editUser = (user) => {
    currentMember.value.mode = "edit"
    
    currentMember.value.user = user.user
    currentMember.value.roles = user.roles
    showSlideOver.value = true
}
const columns = ref([
{
    label: "Membre",
    key: "member"
},
{
    label: "Roles",
    key: "roles"
},
{
    key: "edit"
}
])

const items = (row) => [
[{
    label: "Mettre à jour",
    icon: 'i-heroicons-pencil-square-20-solid',
    click: () => editUser(row)
}], 
[{
    label: "Supprimer",
    icon: 'i-heroicons-trash-20-solid',
    click: () => deleteUser(row.user.id)
}]
]

const deleteUser = (userId: string) : void => {
    orgStore.deleteMember(userId)
}
const roleToColor =  {
    "admin": "red",
    "keys": "blue",
    "member": "green"
}

const rolesList = [
"member",
"keys",
"admin"
]
</script>