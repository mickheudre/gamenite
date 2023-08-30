import { Session} from '@supabase/gotrue-js/dist/main/lib/types'
import { Credentials } from '~/types/global'

export function useAuth()  {

  const supabaseAuth = useSupabaseUser()
  const supabase = useSupabaseClient()

  const userSession = useState<Session | null>('userSession', () => { return null} )

  async function signIn(credentials: Credentials) {
    try {
      const { error, data } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      })
      if (error) {
        alert('Error logging in: ' + error.message)
      }
      // No error throw, but no user detected so send magic link
      if (!error && !data) {
        alert('Check your email for the login link!')
      }
    } catch (error) {
      console.error('Error thrown:', error.message)
      alert(error.error_description || error)
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  return { userSession, signIn, signOut}
}