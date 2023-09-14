import { defineStore } from 'pinia'
export const useOpeningHoursStore = defineStore('openingHoursStore', () => {
    
    
    const supabase = useSupabaseClient()
    const user = useSupabaseUser()
    
    
    const {pending, data: openingHours, error, refresh} =  useLazyAsyncData('opening_hours', async () => {
        const now = new Date()
        const {data, error} = await supabase.from("opening_hours").select("*, org(id, name), organizer (id, username)").gte("start_at", now.toISOString())
        const events = ref([])
        return data
    })

    const userOpeningHours = computed(() => {
        return openingHours.value?.filter(oh => oh.organizer.id === user.value.id)
    })
    
    const addOpeningHour = async (openingHour) => {
        const { data, error } = await supabase
        .from('opening_hours')
        .insert({...openingHour, org: 1})
        .select("*, organizer (id, username)")
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
        .select("*, organizer (id, username)")
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
        return  {data, error}
        
        
    }
    
    return { openingHours, userOpeningHours, pending, refresh, addOpeningHour, updateOpeningHour, deleteOpeningHour }
})