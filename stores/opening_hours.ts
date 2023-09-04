import { defineStore } from 'pinia'
export const useOpeningHoursStore = defineStore('openingHoursStore', () => {
    
    
    const supabase = useSupabaseClient()
    const user = useSupabaseUser()
    
    
    const {pending, data: openingHours, error, refresh} =  useLazyAsyncData('opening_hours', async () => {
        const {data, error} = await supabase.from("opening_hours").select("*")
        const events = ref([])
        return data
    })
    

    
    return { openingHours, pending, refresh }
})