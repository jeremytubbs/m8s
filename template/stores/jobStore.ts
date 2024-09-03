import { defineStore } from 'pinia'

interface JobState {
  currentJob: any[] | null;
  jobCache: Record<string, any[]>;
}

export const useJobStore = defineStore('job', {
  state: (): JobState => ({
    currentJob: null,
    jobCache: {}
  }),
  actions: {
    setCurrentJob(job: any[]) {
      this.currentJob = job
      this.jobCache[job.guid] = job
    },
    async fetchJob(guid: string) {
      if (this.jobCache[guid]) {
        this.currentJob = this.jobCache[guid]
        return this.currentJob
      }

      try {
        const response = await fetch(`https://microsites.dejobs.org/ALL_JOBS/${guid}.json`)
        const job = await response.json()
        this.setCurrentJob(job)
        return job
      } catch (error) {
        console.error('Error fetching job:', error)
        return null
      }
    },
    clearCurrentJob() {
      this.currentJob = null
    }
  }
})