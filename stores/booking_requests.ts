import { defineStore } from 'pinia'
export const useBookingRequestsStore = defineStore('bookingRequestsStore', () => {
    
    
    const supabase = useSupabaseClient()
    const user = useSupabaseUser()
    
    
    const {pending, data: bookingRequests, error, refresh} =  useLazyAsyncData('booking_requests', async () => {
        const now = new Date()
        const {data, error} = await supabase.from("booking_requests").select("*, table (name)").gte('start_at', now.toISOString())
        return data
    })


    const userBookingRequests = computed(() => {
        return bookingRequests.value?.filter(br => br.user === user.value.id)
    })
    
    const addBookingRequest = async (model) => {
        const args = {user: user.value.id, opening_hour: model.opening_hour.id, start_at: model.start_at, end_at: model.end_at, game: model.game.name, table: model.table.id, width: model.format.boardSize.width}
        console.log(args)
        const { data, error } = await supabase
        .from("booking_requests")
        .insert(args)
        .select()
        .single()
        
        console.log(error)
        if (data) {
            bookingRequests.value?.push(data)
        }
        return {data, error}
    }
    
    // const updateOpeningHour = async (event) => {
    //     const {data, error } = await supabase
    //     .from('opening_hours')
    //     .update(event)
    //     .eq('id', event.id)
    //     .select()
    //     .single()
        
    //     if (data) {
    //         if (data) {
    //             const index = openingHours.value.findIndex(event => event.id === data.id)
    //             if (index != -1) {
    //                 openingHours.value[index] = data
    //             }
    //         }
    //     }
    //     return {data, error}
    // }
    
    
    
    // const deleteOpeningHour = async (eventId: string) => {
    //     const { data, error } = await supabase
    //     .from('opening_hours')
    //     .delete()
    //     .eq('id', eventId)
    //     .select()
    //     .single()
        
    //     if (data) {
    //         const index = openingHours.value.findIndex(event => event.id === data.id)
    //         if (index != -1) {
    //             openingHours.value?.splice(index, 1)
    //         }
    //     }
    //     return  {data, error}
        
        
    // }
    
    return { bookingRequests, userBookingRequests, pending, refresh, addBookingRequest }
})