<script setup lang="ts">

</script>

<template>
  <Head>
  </Head>
  <div class="w-screen h-screen bg-white dark:bg-gray-800">
    <NuxtLoadingIndicator />
    <LayoutHeader />
    <slot />
  </div>
</template>
