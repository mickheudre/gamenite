import { defineStore } from 'pinia'
export const useOpeningHoursStore = defineStore('openingHoursStore', () => {
    
    
    const supabase = useSupabaseClient()
    const user = useSupabaseUser()
    const fightClubId = "fc791731-3a07-4125-9b3d-4969815290a5"

    
    const {pending, data: openingHours, error, refresh} =  useLazyAsyncData('opening_hours', async () => {
        const now = new Date()
        var day = now.getDay() || 7;
        if( day !== 1 )
            now.setHours(-24 * (day - 1));

        const {data, error} = await supabase.from("opening_hours").select("*,  org (id, name), organizer (id, username)").gte("start_at", now.toISOString())
        const events = ref([])
        return data
    })

    const incomingOpeningHours = computed(() => {
        return openingHours.value?.filter(opening =>  new Date() < new Date(opening.end_at))
    })

    const userOpeningHours = computed(() => {
        const now = new Date()
        now.setHours(0)
        if (!user.value) {
            return []
        }
        return openingHours.value?.filter(oh => oh.organizer.id === user.value.id && oh.start_at > now.toISOString())
    })

    const isCurrentlyOpen = computed(() => {
        const now = new Date()
        return openingHours.value?.find(oh => oh.start_at < now.toISOString() && oh.end_at > now.toISOString())

    })
    
    const addOpeningHour = async (openingHour) => {
        const { data, error } = await supabase
        .from('opening_hours')
        .insert({...openingHour, org: fightClubId})
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
    
    return { openingHours, incomingOpeningHours, userOpeningHours, isCurrentlyOpen, pending, refresh, addOpeningHour, updateOpeningHour, deleteOpeningHour }
})