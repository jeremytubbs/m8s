<template>
    <h1> {{ guid }} Job page</h1>
    {{ job }}

    <NuxtLink to="/">Back to Jobs</NuxtLink>
</template>

<script setup>
const route = useRoute()
const location = route.params.location
const guid = route.params.guid

</script>