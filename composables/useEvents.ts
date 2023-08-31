export function useEvents() {
    const supabase = useSupabaseClient()
    const eventsList = useState("Events", () => [])

    async function fetchEvents() {
        const {data, error} = await supabase.from("events").select("*")
       return data
    }

    return {eventsList, fetchEvents}
}