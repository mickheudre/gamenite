import { UserProfile  } from "~/types/global"
export function useUser() {

    const supabase = useSupabaseClient()
    const profile = useState<UserProfile | null>("userProfile", () => { return null } )
    const auth = useAuth()

    async function fetchProfile(userId: string) {
        const {data, error}  = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()   
        
        if (data) {
            profile.value = {
                username: data.username,
                firstname: data.first_name,
                lastname: data.last_name
            }
        }

    }

    async function updateProfile(profile: UserProfile) {
        if (auth.userSession.value) {
            const { error } = await supabase
            .from('users')
            .update({ username: profile.username, first_name : profile.firstname, last_name: profile.lastname })
            .eq('id', auth.userSession.value.user.id)
            console.log(error)
        }

    }

    return { profile, fetchProfile, updateProfile }

} 

