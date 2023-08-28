import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
  const user = useSupabaseUser()
  const supabase = useSupabaseClient()

  const errorMessage = ref("")
  const userData = ref({username: ""})
  
  
  const isLoggedIn = computed<boolean>(() => user.value != undefined)
  
  
  const signOut = async () => {
    await supabase.auth.signOut()
  }
  
  const signIn = async (email : string, password : string) => {
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })
    if (error) {
      errorMessage.value  = error.message
    }
  }
  
  const updateUserData = async () => {
    const {data, error}  = await supabase
    .from('users')
    .select('username')
    if (data)   {
      userData.value = { username : data[0].username
      }
    }
    
  } 
  
  return { userData, isLoggedIn, signIn, signOut, updateUserData }
})