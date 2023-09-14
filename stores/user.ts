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
    
    async function updateProfile(profile) {
        const { error } = await supabase
        .from('users')
        .update({ username: profile.username, first_name : profile.firstName, last_name: profile.lastName })
        .eq('id', user.value.id)
        refresh()
    }

   

    return { profile, pending, refresh, updateProfile }
})