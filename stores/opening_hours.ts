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
    
    const updateOpeningHour = async (event) => {
        const {data, error } = await supabase
        .from('opening_hours')
        .update(event)
        .eq('id', event.id)
        .select()
        .single()
        
        if (data) {
            if (data) {
                const index = openingHours.value.findIndex(event => event.id === data.id)
                if (index != -1) {
                    openingHours.value[index] = data
                }
            }
        }
        return {data, error}
    }
    
    
    
    const deleteOpeningHour = async (eventId: string) => {
        const { data, error } = await supabase
        .from('opening_hours')
        .delete()
        .eq('id', eventId)
        .select()
        .single()
        
        if (data) {
            const index = openingHours.value.findIndex(event => event.id === data.id)
            if (index != -1) {
                openingHours.value?.splice(index, 1)
            }
        }
        console.log(eventId, error)
        return  {data, error}
        
        
    }
    
    return { openingHours, pending, refresh, addOpeningHour, updateOpeningHour, deleteOpeningHour }
})