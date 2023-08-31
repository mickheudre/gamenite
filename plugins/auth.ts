import { Session, AuthChangeEvent} from '@supabase/gotrue-js/dist/main/lib/types'
import { useRolesStore } from '~/stores/roles'
import { useUserStore } from '~/stores/user'

export default defineNuxtPlugin({
    name: 'my-plugin',
    async setup (nuxtApp) {
        const supabase = useSupabaseClient()
        const rolesStore = useRolesStore()
        const userStore = useUserStore()

        supabase.auth.onAuthStateChange( async (event: AuthChangeEvent, session: Session | null) => {

            if (event == 'SIGNED_OUT') {
              //  user.profile.value = null
                navigateTo('/login')
                return
            }
            if (event == 'PASSWORD_RECOVERY') {
              return 
            }
            if (event == 'SIGNED_IN') {
              rolesStore.refresh()
              userStore.refresh()
              navigateTo("/")
            }
  
          })

        },
    
})