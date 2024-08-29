<template>
    <div>
      <div v-if="jobSearchStore.results && jobSearchStore.results.length > 0">
        <!-- Display your search results here -->
        <div v-for="job in jobSearchStore.results" :key="job.guid" :ref="setJobRef">
            <nuxt-link
                :to="`${buildJobDetailUrl(job)}`"
                :id="`job-link-${job.guid}`"
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
          {{ jobSearchStore.isLoading ? 'Loading...' : 'Load More' }}
        </button>
      </div>
      <div v-else-if="searched">
        No results found.
      </div>
      <div v-else>
        Loading...
      </div>
    </div>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue'
  import { useJobSearchStore } from '~/stores/jobSearchStore'
  import buildJobDetailUrl from '~/support/buildJobDetailUrl'

  const jobSearchStore = useJobSearchStore()
  const searched = ref(false)
  const jobRefs = ref<{ [key: string]: HTMLElement }>({})

  const setJobRef = (el: any) => {
    if (el) {
      const job = el.__vnode.key
      jobRefs.value[job] = el
    }
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

  watch(() => jobSearchStore.results, () => {
    searched.value = true
  })
</script>