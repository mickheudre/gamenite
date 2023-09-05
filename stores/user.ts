import { defineStore } from 'pinia'

export const useUserStore = defineStore('userStore', () => {


    const user =  useSupabaseUser()

    const supabase = useSupabaseClient()


    const {pending, data : profile, error, refresh} =  useLazyAsyncData('userProfile', async () =>  {
        const {data, error}  = await supabase
        .from('users')
        .select('*')
        .eq('id', user.value.id)
        .single()       
        return data 
    })
    
    async function updateProfile(profile) {
        const { error } = await supabase
        .from('users')
        .update({ username: profile.username, first_name : profile.firstName, last_name: profile.lastName })
        .eq('id', user.value.id)
        refresh()
}
    return { profile, pending, refresh, updateProfile }
  })