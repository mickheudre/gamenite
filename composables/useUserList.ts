export function useUserList() {
    const supabase = useSupabaseClient()
    const userList = useState("UserList", () => [])
    async function fetchUsers() {
        const {data, error} = await supabase.from("users").select("*")
        if (data) {
            userList.value =  data
        }
    }

    return {userList, fetchUsers}
}