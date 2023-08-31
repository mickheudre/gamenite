export  function  useUserRoles() {

    const supabase = useSupabaseClient()
    const user = useSupabaseUser()
    

    const {pending, data: roles, error} =  useLazyAsyncData('userRoles', async () => {
        // const {data, error} = await supabase.from("roles").select("org (id, name) , role").eq("user_id", user.value.id)
        console.log("fetching roles")

        // return data
    })
    
    
    return { roles, pending }
}