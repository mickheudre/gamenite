import { defineStore } from 'pinia'
export const useRolesStore = defineStore('rolesStore', () => {


    const supabase = useSupabaseClient()
    const user = useSupabaseUser()
    

    const {pending, data: roles, error, refresh} =  useLazyAsyncData('userRoles', async () => {
        const {data, error} = await supabase.from("roles").select("org (id, name) , roles").eq("user_id", user.value.id)

        return data
    })
    
    return { roles, pending, refresh }
  })