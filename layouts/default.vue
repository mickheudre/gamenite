<script setup lang="ts">

</script>

<template>
  <Head>
  </Head>
  <div class="w-screen min-h-screen bg-white dark:bg-gray-800">
    <NuxtLoadingIndicator />
    <LayoutHeader />
    <div class="py-16">
    <slot />

    </div>
  </div>
</template>
