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
    
    return { profile, pending, refresh }
  })