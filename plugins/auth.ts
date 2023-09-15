import { Session, AuthChangeEvent} from '@supabase/gotrue-js/dist/main/lib/types'
import { useEventsStore } from '~/stores/events'
import { useRolesStore } from '~/stores/roles'
import { useUserStore } from '~/stores/user'
import { useOpeningHoursStore } from '~/stores/opening_hours'

export default defineNuxtPlugin({
  name: 'auth-manager',
  async setup (nuxtApp) {
    const supabase = useSupabaseClient()
    const rolesStore = useRolesStore()
    const userStore = useUserStore()
    const eventsStore = useEventsStore()
    const openingHoursStore = useOpeningHoursStore()

    supabase.auth.onAuthStateChange( async (event: AuthChangeEvent, session: Session | null) => {
      const route = useRoute()
      rolesStore.refresh()
      userStore.refresh()
      eventsStore.refresh()
      openingHoursStore.refresh()

      if (event == 'SIGNED_OUT') {
        return
      }
      if (event == 'PASSWORD_RECOVERY') {
        return 
      }
      if (event == 'SIGNED_IN') {
        if (route.fullPath === '/login') {
          navigateTo("/")
        }
      }
      
    })
    
  },
  
})