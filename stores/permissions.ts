import { defineStore } from 'pinia'
export const useOpeningHoursStore = defineStore('openingHoursStore', () => {
    
    
    const userStore = useUserStore()
    const permissions = ref({fightClub: []})

    const roles = userStore.profile?.roles
    
    if (roles?.length > 0) {
        if (roles.find(role => (role.org.id == 1) && role.roles.find(role => role === 'admin') )) {
            permissions.value.fightClub.push('eventCreate', 'eventEdit', 'eventDelete')
        }
    }

    
    
})
