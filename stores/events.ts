import { defineStore } from 'pinia'
export const useEventsStore = defineStore('eventsStore', () => {
    
    
    const supabase = useSupabaseClient()
    const user = useSupabaseUser()
    
    
    const {pending, data: events, error, refresh} =  useLazyAsyncData('events', async () => {
        const {data, error} = await supabase.from("events").select("*")
        const events = ref([])
        data?.forEach(event => { events.value.push(Object.assign({}, event))})
        return data
    })
    
    const addEvent = async (event) => {
        console.log(event)
        const { error } = await supabase
        .from('events')
        .insert({...event, org: 1, organizer: user.value.id})
        console.log(error)
    }
    
    
    return { events, pending, refresh, addEvent }
})