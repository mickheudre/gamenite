import { Session, AuthChangeEvent} from '@supabase/gotrue-js/dist/main/lib/types'

export default defineNuxtPlugin({
    name: 'my-plugin',
    async setup (nuxtApp) {
        const supabase = useSupabaseClient()
        const auth = useAuth()
        const user = useUser()

        supabase.auth.onAuthStateChange( async (event: AuthChangeEvent, session: Session | null) => {

            if (event == 'SIGNED_OUT') {
                auth.userSession.value = null
                user.profile.value = null
                navigateTo('/login')
                return
            }

            auth.userSession.value = session
            if (session) {
                user.fetchProfile(session.user.id)
            }
          })
    },
    
})