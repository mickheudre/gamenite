<template>
  <UContainer class="space-y-8">
    <h1 class="text-2xl font-semibold"> Salut {{ userStore.profile ? userStore.profile.username : ''}}</h1>
    
    <UCard class="md:w-1/2" :ui="{background: 'bg-gradient-to-r from-indigo-500 via-purple-500 to-red-500'}" @click="navigateTo('/fightClub')">
      <div class="flex justify-between items-center">
        <NuxtLink to="/fightClub" class="font-bold flex items-center text-white">Fight Club        
          <UBadge v-if="openingHoursStore.isCurrentlyOpen" class="mx-4" color="green" label="Ouvert"/>
        </NuxtLink>
        <UIcon name="i-heroicons-chevron-right" class="text-xl text-white"/>
      </div>
      
    </UCard>
    
    <div class="flex space-x-8">
      <TableBookingWidget class="md:w-1/3"/>
      <UCard class="md:w-2/3">
        <template #header>
          <h4 class="text-xl font-semibold text-white">Prochaines parties</h4>
        </template>
        <UTable :rows="bookingRequestStore.userBookingRequests" :columns="bookingRequestscolumns" :loading="bookingRequestStore.pending"  >
          <template #table-data="{row}">
            <span class="capitalize">{{ row.table.name }}</span>
          </template>
          <template #date-data="{row}">
            <span class="capitalize">{{ formatDate(row.start_at) }}</span>
          </template>
          <template #time-data="{row}">
            <span class="">{{ formatTime(row.start_at, row.end_at) }}</span>
          </template>
        </UTable>
      </UCard>
    </div>
    <UCard class="my-4" v-if="userStore.profile?.permissions['fightClub'].find(p => p == 'openingHoursCreate')">
      <template #header>
        <h4>Mes horaires d'ouverture</h4>
      </template>
      <OpeningHoursList />
    </UCard>
  </UContainer>
</template>

<script setup lang="ts">

import { useUserStore } from '~/stores/user';
import { useBookingRequestsStore } from '~/stores/booking_requests';
import { useOpeningHoursStore } from '~/stores/opening_hours';


const userStore = useUserStore()
const bookingRequestStore = useBookingRequestsStore()
const openingHoursStore = useOpeningHoursStore()


    const bookingRequestscolumns = [
    {
      label: "Jeu",
      key: "game"
    },
    {
      label: "Table",
      key: "table"
    },
    {
      label: "Date",
      key: "date"
    },
    {
      label: "Horaires",
      key: "time"
    },
    ]
    const rolesColumns = [
    {
      label: "Organisation",
      key: "org"
    },
    {
      label: "Role",
      key: "role"
    }
    ]
    
    const formatDate = (start: string) => {
      const eventStart = new Date(start)
      const date = eventStart.toLocaleString('fr-FR', { weekday: "long", year: "numeric", month: "long", day: "numeric"})
      return `${date}`
    }
    
    const formatTime = (start: string, end: string) => {
    const eventStart = new Date(start)
    const eventEnd = new Date(end)
    const date = eventStart.toLocaleString('fr-FR', { weekday: "long", year: "numeric", month: "long", day: "numeric"})
    const startTime = eventStart.toLocaleString('fr-FR', { hour: "numeric", minute: "numeric", hour12: false }) 
    const endTime = eventEnd.toLocaleString('fr-FR', { hour: "numeric", minute: "numeric", hour12: false }) 
    
    return `${startTime}→${endTime}`
}
    
    
  </script>
  