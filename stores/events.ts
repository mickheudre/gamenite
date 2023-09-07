import { defineStore } from 'pinia'
export const useEventsStore = defineStore('eventsStore', () => {
    
    
    const supabase = useSupabaseClient()
    const user = useSupabaseUser()
    
    
    const {pending, data: events, error, refresh} =  useLazyAsyncData('events', async () => {
        const {data, error} = await supabase.from("events").select("*")
        const events = ref([])
        return data
    })
    
    const addEvent = async (event) => {
        const { error } = await supabase
        .from('events')
        .insert({...event, org: 1, organizer: user.value.id})
    }

    const updateEvent = async (event) => {
        console.log(event)
        const { error } = await supabase
        .from('events')
        .update(event)
        .eq('id', event.id)
        refresh()
    }

    const deleteEvent = async (eventId: string) => {
        const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId)

        refresh()

    }
    
    
    return { events, pending, refresh, addEvent, updateEvent, deleteEvent }
})