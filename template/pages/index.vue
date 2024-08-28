<template>
    <div>
      <div v-if="jobSearchStore.results && jobSearchStore.results.length > 0">
        <!-- Display your search results here -->
        <div v-for="job in jobSearchStore.results" :key="job.guid">
            <nuxt-link
                :to="`${buildJobDetailUrl(job)}`"
            >
                {{ job.title_exact }}
            </nuxt-link>
        </div>
      </div>
      <div v-else-if="searched">
        No results found.
      </div>
    </div>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue'
  import { useJobSearchStore } from '~/stores/jobSearchStore'
  import buildJobDetailUrl from '~/support/buildJobDetailUrl'

  const jobSearchStore = useJobSearchStore()
  const searched = ref(false)

  watch(() => jobSearchStore.results, () => {
    searched.value = true
  })
</script>