export function useUserRoles() {
    const supabase = useSupabaseClient()
    const auth = useAuth()

    const roles = useState("UserRole", () => [])
    async function fetchRoles() {
        if (auth.userSession.value) {
            const {data, error} = await supabase.from("roles").select("org (name), role").eq("user_id", auth.userSession.value.user.id)
            if (data) {
                roles.value =  data
            }
        }
    }

    return {roles, fetchRoles}
}