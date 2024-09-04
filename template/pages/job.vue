<template>
    <div v-if="job">
        <h1>{{ job.title_exact }}</h1>
        <!-- Add more job details here -->
    </div>
    <div v-else-if="loading">Loading...</div>
    <div v-else>Job not found</div>
</template>

<script setup lang="ts">
import {ref, onMounted} from "vue"
import {useRoute} from "vue-router"
import {useJobStore} from "~/stores/jobStore"

const route = useRoute()
const jobStore = useJobStore()
const loading = ref(true)

const job = ref(jobStore.currentJob)

onMounted(async () => {
    const guid = route.params.guid as string
    if (!job.value || job.value.guid !== guid) {
        job.value = await jobStore.fetchJob(guid)
    }
    loading.value = false
})
</script>
