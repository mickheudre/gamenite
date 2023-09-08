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
        const { data, error } = await supabase
        .from('events')
        .insert({...event, org: 1, organizer: user.value.id})
        .select()
        .single()

        if (data) {
            events.value?.push(data)
        }
        return {data, error}
    }

    const updateEvent = async (event) => {
        const {data, error } = await supabase
        .from('events')
        .update(event)
        .eq('id', event.id)
        .select()
        .single()

        if (data) {
            if (data) {
                const index = events.value.findIndex(event => event.id === data.id)
                if (index != -1) {
                    events.value[index] = data
                }
            }
        }
        return {data, error}
    }

    const deleteEvent = async (eventId: string) => {
        const { data, error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId)
        .select()
        .single()

        if (data) {
            const index = events.value.findIndex(event => event.id === data.id)
            if (index != -1) {
                events.value?.splice(index, 1)
            }
        }

        return  {data, error}


    }
    
    
    return { events, pending, refresh, addEvent, updateEvent, deleteEvent }
})