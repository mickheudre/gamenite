import { defineStore } from 'pinia'
export const useOrgStore = defineStore('orgStore', () => {


    const supabase = useSupabaseClient()
    const user = useSupabaseUser()
    

    const {pending, data: keyHolders, error, refresh} =  useLazyAsyncData('orgRoles', async () => {
        const {data, error} = await supabase.from("roles").select("user (id, username), roles").eq('org', 1)
        return data.filter(member => member.roles.find(role => role === 'keys')).map((orgMember => { return orgMember.user}))
    })
    
    return { keyHolders, pending, refresh }
  })