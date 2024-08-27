<template>
  <NuxtLayout>
      <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
const {company} = useAppConfig()
useHead({
  titleTemplate: "%s | " + company,
})
</script>