import { Session, AuthChangeEvent} from '@supabase/gotrue-js/dist/main/lib/types'
import { useEventsStore } from '~/stores/events'
import { useRolesStore } from '~/stores/roles'
import { useUserStore } from '~/stores/user'

export default defineNuxtPlugin({
    name: 'auth-manager',
    async setup (nuxtApp) {
        const supabase = useSupabaseClient()
        const rolesStore = useRolesStore()
        const userStore = useUserStore()
        const eventsStore = useEventsStore()

        supabase.auth.onAuthStateChange( async (event: AuthChangeEvent, session: Session | null) => {
            if (event == 'SIGNED_OUT') {
              rolesStore.refresh()
              userStore.refresh()
              eventsStore.refresh()
                return
            }
            if (event == 'PASSWORD_RECOVERY') {
              return 
            }
            if (event == 'SIGNED_IN') {
              rolesStore.refresh()
              userStore.refresh()
              eventsStore.refresh()
              navigateTo("/fightclub")
            }
  
          })

        },
    
})