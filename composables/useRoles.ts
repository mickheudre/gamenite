export function useRoles() {
    const supabase = useSupabaseClient()
    const roles = useState("UserRoles", () => [])
    async function fetchRoles() {
        const {data, error} = await supabase.from("roles").select("user_id (username), org (name), role ")
        if (data) {
            roles.value =  data
        }
    }

    return {roles, fetchRoles}
}