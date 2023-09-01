import { defineStore } from 'pinia'
export const useEventsStore = defineStore('eventsStore', () => {


    const supabase = useSupabaseClient()
    const user = useSupabaseUser()
    

    const {pending, data: events, error, refresh} =  useLazyAsyncData('userRoles', async () => {
        const {data, error} = await supabase.from("events").select("*")
        return data
    })
    
    return { events, pending, refresh }
  })