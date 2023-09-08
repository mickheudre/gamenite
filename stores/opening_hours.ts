import { defineStore } from 'pinia'
export const useOpeningHoursStore = defineStore('openingHoursStore', () => {
    
    
    const supabase = useSupabaseClient()
    const user = useSupabaseUser()
    
    
    const {pending, data: openingHours, error, refresh} =  useLazyAsyncData('opening_hours', async () => {
        const {data, error} = await supabase.from("opening_hours").select("*")
        const events = ref([])
        return data
    })
    
    const addOpeningHour = async (openingHour) => {
        const { data, error } = await supabase
        .from('opening_hours')
        .insert({...openingHour, org: 1, key_holder: user.value.id})
        .select()
        .single()

        if (data) {
            openingHours.value?.push(data)
        }
        return {data, error}
    }

    
    return { openingHours, pending, refresh, addOpeningHour }
})