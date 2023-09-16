<template>
    <NuxtLayout>
      <NuxtLoadingIndicator />
      <NuxtPage />
    </NuxtLayout>
  </template>

  <script>
  export default {
    setup () {
      useHead({
        script: [
        { 
          async: true,
          src: 'https://scripts.withcabin.com/hello.js',
        }]
      }) },
      head: {
        title: 'Tabletop Social Club'
      }
    }
  </script>
  
  <style>
  html, body {
    height: 100%;
    box-sizing: border-box;
  }
  </style>