<template>
  <!-- <Content title="Home" /> -->
  <UContainer class="space-y-8">
    <h1 class="text-2xl font-semibold"> Salut {{ userStore.profile ? userStore.profile.username : ''}} ✌️</h1>
    
    <UCard class="md:w-1/2" :ui="{background: 'bg-gradient-to-r from-indigo-500 via-purple-500 to-red-500'}" @click="navigateTo('/fightClub')">
      <div class="flex justify-between items-center">
        <NuxtLink to="/fightClub" class="font-bold flex items-center text-white">Fight Club        
          <UBadge v-if="openingHoursStore.isCurrentlyOpen" class="mx-4" color="green" label="Ouvert"/>
        </NuxtLink>
        <UIcon name="i-heroicons-chevron-right" class="text-xl text-white"/>
      </div>
      
    </UCard>

    <UCard class="md:w-1/2" :ui="{background: 'bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500', body: { base: 'space-y-4'}}">
      <template #header>
       <h4 class="text-xl font-semibold">Réserver une partie</h4>
      </template>
      <UFormGroup label="Jeu pratiqué">
        <USelectMenu v-model="model.game" :options="games" :ui="selectMenuOptions">
          <template #option="{ option}">
            <span>{{option.name}}</span>
          </template>
          <template #label>
            <span>{{model.game?.name ?? "Jeu"}}</span>
          </template>
        </USelectMenu>
      </UFormGroup>
      <UFormGroup v-if="model.game && games.find(game => game.name === model.game?.name)?.formats?.length > 1" label="Format" >
        <USelectMenu v-model="model.format" :options="games.find(game => game.name === model.game?.name)?.formats" :ui="selectMenuOptions">
          <template #option="{ option}">
            <span>{{ `${option.name} - ${option.boardSize.height}"x${option.boardSize.width}"` }}</span>
          </template>
          <template #label>
            <span>{{model.format?.name ?? "Format de jeu"}}</span>
          </template>
        </USelectMenu>
      </UFormGroup>
      <UFormGroup label="Créneaux de jeu disponibles">
        <USelectMenu v-model="model.opening_hour" :options="openingHoursStore.incomingOpeningHours" :ui="selectMenuOptions">
          <template #option="{ option}">
            <span>{{ formatDate(option.start_at, option.end_at) }}</span>
          </template>
          <template #label>
            <span>{{model.opening_hour ? formatDate(model.opening_hour?.start_at, model.opening_hour?.end_at) : "Créneaux de jeu"}}</span>
          </template>
        </USelectMenu>
      </UFormGroup>
      <UFormGroup label="Horaires" :ui="{'container': 'mt-1 flex w-full items-center'}">
        <UInput class="" type="time"  v-model="model.start_at" @input="console.log('value')" :ui="selectMenuOptions"/>
        <span class="mx-2">→</span>
        <UInput class="" type="time" v-model="model.end_at" :ui="selectMenuOptions" />
      </UFormGroup>
      <UFormGroup label="Tables disponible">
        <USelectMenu v-model="model.table" :options="tablesStore.tables" :ui="selectMenuOptions">
          <template #option="{ option}">
            <span>{{ option.name }}</span>
          </template>
          <template #label>
            <span>{{model.table?.name ?? `${tablesStore.tables?.length} tables disponible${tablesStore.tables?.length == 1 ? '' : 's'}`}}</span>
          </template>
        </USelectMenu>
      </UFormGroup>
      <template #footer>
        <UButton size="xl" color="white" label="Réserver" :ui="selectMenuOptions"/>
      </template>
    </UCard>
    <UCard>
      <template #header>
      <h4>Prochaines parties</h4>
    </template>
    <UTable :rows="bookingRequestStore.userBookingRequests" :columns="bookingRequestscolumns" :loading="bookingRequestStore.pending">
      <template #table-data="{row}">
        <span>{{ row.table.name }}</span>
      </template>
    </UTable>
    <template #footer>
      <UButton @click="bookingGame = true">Réserver une table</UButton>
    </template>
    <USlideover v-model="bookingGame" >
      <UFormGroup label="Jeu pratiqué">
        <USelectMenu v-model="model.game" :options="games">
          <template #option="{ option}">
            <span>{{option.name}}</span>
          </template>
          <template #label>
            <span>{{model.game?.name ?? "Jeu"}}</span>
          </template>
        </USelectMenu>
      </UFormGroup>
      <UFormGroup v-if="model.game && games.find(game => game.name === model.game?.name)?.formats?.length > 1" label="Format">
        <USelectMenu v-model="model.format" :options="games.find(game => game.name === model.game?.name)?.formats">
          <template #option="{ option}">
            <span>{{ `${option.name} - ${option.boardSize.height}"x${option.boardSize.width}"` }}</span>
          </template>
          <template #label>
            <span>{{model.format?.name ?? "Format de jeu"}}</span>
          </template>
        </USelectMenu>
      </UFormGroup>
      <UFormGroup label="Créneaux de jeu disponibles">
        <USelectMenu v-model="model.opening_hour" :options="openingHoursStore.incomingOpeningHours">
          <template #option="{ option}">
            <span>{{ formatDate(option.start_at, option.end_at) }}</span>
          </template>
          <template #label>
            <span>{{model.opening_hour ? formatDate(model.opening_hour?.start_at, model.opening_hour?.end_at) : "Créneaux de jeu"}}</span>
          </template>
        </USelectMenu>
      </UFormGroup>
      <UFormGroup label="Horaires">
        <UInput type="time"  v-model="model.start_at" @input="console.log('value')" />
        <UInput type="time" v-model="model.end_at" />
        
      </UFormGroup>
      <UFormGroup label="Tables disponible">
        <USelectMenu v-model="model.table" :options="tablesStore.tables">
          <template #option="{ option}">
            <span>{{ option.name }}</span>
          </template>
          <template #label>
            <span>{{model.table?.name ?? "Tables disponible"}}</span>
          </template>
        </USelectMenu>
      </UFormGroup>
      <UButton @click="bookTable">Réserver une table</UButton>
      <div class="w-full h-full"></div>
    </USlideover>
  </UCard>
  <UCard class="my-4" v-if="userStore.profile?.permissions['fightClub'].find(p => p == 'openingHoursCreate')">
    <template #header>
      <h4>Mes horaires d'ouverture</h4>
    </template>
    <OpeningHoursList />
  </UCard>
</UContainer>
</template>

<script setup lang="ts">

import { useRolesStore } from '@/stores/roles';
import { useUserStore } from '~/stores/user';
import { useBookingRequestsStore } from '~/stores/booking_requests';
import { useOpeningHoursStore } from '~/stores/opening_hours';
import {useTablesStore} from '~/stores/tables'

const supabase = useSupabaseClient()
const user = useSupabaseUser()

const bookingGame = ref(false)
const rolesStore = useRolesStore()
const userStore = useUserStore()
const bookingRequestStore = useBookingRequestsStore()
const openingHoursStore = useOpeningHoursStore()
const tablesStore = useTablesStore()
const games = useGamesData

const model = ref({game: null, format: null, opening_hour: null, start_at: null, end_at: null, table: null})

watch(() => model.value.opening_hour, (openingHour) => {
  model.value.start_at = new Date(openingHour?.start_at).toLocaleTimeString("fr-FR", { hour12: false })
  model.value.end_at = new Date(openingHour?.end_at).toLocaleTimeString("fr-FR", { hour12: false })
})

// watch(() => model.value.start_at, (start_at) => {
  //   console.log(start_at)
  //   if (start_at < new Date(model.value.opening_hour?.start_at).toLocaleTimeString("fr-FR", { hour12: false })) {
    //     model.value.start_at =  new Date(model.value.opening_hour?.start_at).toLocaleTimeString("fr-FR", { hour12: false })
    //   }
    // })
    
    const selectMenuOptions = {color: { white: {outline:'shadow-sm bg-gray-800/50 text-white ring-1 ring-inset ring-gray-700/50  focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400'}}}
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
      key: "start_at"
    },
    {
      label: "Fin",
      key: "end_at"
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
    
    const formatDate = (start: string, end: string) => {
      const eventStart = new Date(start)
      const eventEnd = new Date(end)
      const date = eventStart.toLocaleString('fr-FR', { weekday: "long", year: "numeric", month: "long", day: "numeric"})
      const startTime = eventStart.toLocaleString('fr-FR', { hour: "numeric", minute: "numeric", hour12: false }) 
      const endTime = eventEnd.toLocaleString('fr-FR', { hour: "numeric", minute: "numeric", hour12: false }) 
      
      return `${date} de ${startTime} à ${endTime}`
    }
    
    const bookTable = () => {
      console.log(model.value)
      bookingRequestStore.addBookingRequest(model.value)
    }
    
    
  </script>