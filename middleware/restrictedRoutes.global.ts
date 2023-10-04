import { useUserStore } from "~/stores/user"

export default defineNuxtRouteMiddleware((to, from) => {
    const userStore = useUserStore()

    if (to.fullPath === "/fightClub/members" ) {
        let isAdmin =  false

        if (userStore.profile?.roles && userStore.profile.roles.length > 0) {
            const fightClubRole =  userStore.profile.roles?.find(role => (role.org.id == 1)) 
            if (fightClubRole) {
                isAdmin  = fightClubRole.roles.fing(role => role === "admin")
            }
        }

        if ( !isAdmin) {
            return navigateTo('/')
        }

    }

})