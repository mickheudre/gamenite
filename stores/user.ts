import { defineStore } from 'pinia'

export const useUserStore = defineStore('userStore', () => {
    
    
    const user =  useSupabaseUser()
    
    const supabase = useSupabaseClient()

    
    const {pending, data : profile, error, refresh} =  useLazyAsyncData('userProfile', async () =>  {

        const permissions = ref({fightClub: []})

        const {data : dataUser, error : ErrorUser}  = await supabase
        .from('users')
        .select('*')
        .eq('id', user.value.id)
        .single()      
        
        const {data : dataRoles, error: errorRoles}  = await supabase.from("roles").select("org (id, name) , roles").eq("user", user.value.id)

        if (dataRoles?.find(role => (role.org.id == 1) && role.roles.find(role => role === 'admin') )) {
                permissions.value.fightClub.push('eventCreate', 'eventEdit', 'eventDelete', 'openingHoursCreate', 'openingHoursEdit', 'openingHoursDelete')
            }
            if (dataRoles?.find(role => (role.org.id == 1) && role.roles.find(role => role === 'keys') )) {
                permissions.value.fightClub.push('openingHoursCreate', 'openingHoursEdit', 'openingHoursDelete')
            }

        return {...dataUser, roles: dataRoles, permissions}
    })
    
    async function updateProfile(newProfile) {
        const { data, error } = await supabase
        .from('users')
        .update({ username: newProfile.username, first_name : newProfile.firstName, last_name: newProfile.lastName })
        .eq('id', user.value.id)
        .select()
        .single()
        
        if (data) {
            profile.value.username = data.username
            profile.value.first_name = data.first_name
            profile.value.last_name = data.last_name


        }
    }

   

    return { profile, pending, refresh, updateProfile }
})