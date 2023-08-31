import { UserProfile  } from "~/types/global"
export function useUser() {
    const user = useSupabaseUser()

    const supabase = useSupabaseClient()

    const auth = useAuth()

    const {pending, data : profile, error} = useLazyAsyncData('userProfile', async () =>  {
         const {data, error}  = await supabase
        .from('users')
        .select('*')
        .eq('id', user.value.id)
        .single()   

        return data
    })


    async function updateProfile(profile: UserProfile) {
        if (auth.userSession.value) {
            const { error } = await supabase
            .from('users')
            .update({ username: profile.username, first_name : profile.firstname, last_name: profile.lastname })
            .eq('id', auth.userSession.value.user.id)
            console.log(error)
        }

    }

    return { profile, pending, updateProfile }

} 

