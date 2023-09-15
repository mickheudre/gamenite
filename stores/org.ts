import { defineStore } from 'pinia'
export const useOrgStore = defineStore('orgStore', () => {


    const supabase = useSupabaseClient()
    const user = useSupabaseUser()
    

    const {pending, data: members, error, refresh} =  useLazyAsyncData('orgRoles', async () => {
        const {data, error} = await supabase.from("roles").select("user (id, username), roles").eq('org', 1)
        return data
    })
    
    const keyHolders = computed(() => {
        if (!members.value) {
            return
        }
        return members.value.filter(member => member.roles.find(role => role === 'keys')).map((orgMember => { return orgMember.user}))
    })

    const updateRoles = async (memberId : string, roles: Array<string>) => {

        const {data, error} = await supabase.from("roles").update({roles : roles}).eq('user', memberId).select("user (id, username), roles").single()

        if (data) {
            const index = members.value.findIndex(member => member.user.id === data.user.id)
            if (index != -1) {
                members.value.at(index).roles = data.roles
            }
        }
    }

    const createRoles = async (memberId : string, roles : Array<string>) => {
        const {data, error} = await supabase.from("roles").insert({user: memberId, org: 1, roles : roles}).select("user (id, username), roles").single()

        if (data) {
           members.value?.push(data)
        }
    }

    const deleteMember = async (memberId) => {
        const {data, error} = await supabase.from("roles").delete().eq('user', memberId).select("user (id, username), roles").single()

        if (data) {
            const index = members.value.findIndex(member => member.user.id === data.user.id)
            if (index != -1) {
                members.value?.splice(index, 1)
            }
        }
    }

    return { members, keyHolders, pending, refresh, updateRoles, deleteMember, createRoles }
  }) 