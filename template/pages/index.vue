<template>
    <div>
        <div v-if="jobSearchStore.results && jobSearchStore.results.length > 0">
            <!-- Display your search results here -->
            <div v-for="job in jobSearchStore.results" :key="job.guid" :ref="setJobRef">
                <nuxt-link
                    :to="`${buildJobDetailUrl(job)}`"
                    :id="`job-link-${job.guid}`"
                    @click="handleJobClick(job)"
                >
                    {{ job.title_exact }}
                </nuxt-link>
            </div>
            <button
                v-if="jobSearchStore.page < jobSearchStore.totalPages"
                @click="loadMore"
                :disabled="jobSearchStore.isLoading"
                class="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
            >
                {{ jobSearchStore.isLoading ? "Loading..." : "Load More" }}
            </button>
        </div>
        <div v-else-if="searched">No results found.</div>
        <div v-else>Loading...</div>
    </div>
</template>

<script setup lang="ts">
import {ref, watch, onMounted, nextTick} from "vue"
import {useJobSearchStore} from "~/stores/jobSearchStore"
import {useJobStore} from "~/stores/jobStore"
import buildJobDetailUrl from "~/support/buildJobDetailUrl"

const jobSearchStore = useJobSearchStore()
const jobStore = useJobStore()
const searched = ref(false)
const jobRefs = ref<{[key: string]: HTMLElement}>({})

const setJobRef = (el: any) => {
    if (el) {
        const job = el.__vnode.key
        jobRefs.value[job] = el
    }
}

const handleJobClick = (job: Job) => {
    jobSearchStore.setLastClickedJobGuid(job.guid)
    jobStore.setCurrentJob(job)
}

const loadMore = async () => {
    const newJobGuid = await jobSearchStore.loadMore()
    if (newJobGuid) {
        // Wait for the DOM to update
        await nextTick()
        // Focus on the new job link
        const newJobLink = document.getElementById(`job-link-${newJobGuid}`)
        if (newJobLink) {
            newJobLink.focus()
        }
    }
}

const restoreFocus = () => {
    const lastClickedJobGuid = jobSearchStore.lastClickedJobGuid
    if (lastClickedJobGuid) {
        nextTick(() => {
            const jobLink = document.getElementById(`job-link-${lastClickedJobGuid}`)
            if (jobLink) {
                jobLink.focus()
                jobSearchStore.clearLastClickedJobGuid()
            }
        })
    }
}

watch(
    () => jobSearchStore.results,
    () => {
        searched.value = true
    }
)

onMounted(() => {
    restoreFocus()
})
</script>
