<script setup lang="ts">
import { useRolesStore } from '~/stores/roles';

const rolesStore = useRolesStore()
</script>

<template>
  <Head>
  </Head>
  <div class="w-screen h-screen ">
    <LayoutHeader />
    <slot  v-if="!rolesStore.pending"/>
  </div>
</template>
