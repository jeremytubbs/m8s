import { defineStore } from 'pinia'

interface JobSearchState {
  q: string
  location: string
  results: any[] // Replace 'any' with a more specific type for your job results
}

export const useJobSearchStore = defineStore('jobSearch', {
  state: (): JobSearchState => ({
    q: '',
    location: '',
    results: [],
    initialAllResults: [],
    hasPerformedInitialSearch: false
  }),
  actions: {
    setSearchParams(q: string, location: string) {
      this.q = q
      this.location = location
    },
    setResults(results: any[]) { // Replace 'any' with a more specific type
      this.results = results
    },
    setInitialAllResults(results: any[]) {
      this.initialAllResults = results
      this.hasPerformedInitialSearch = true
    },
    async performSearch() {
      if (this.q === '' && this.location === '') {
        if (!this.hasPerformedInitialSearch) {
          // Perform initial "all jobs" search
          const response = await fetch(`https://prod-search-api.jobsyn.org/api/v1/solr/search?page=1&num_items=10`, {
            method: 'GET',
            headers: {
              "Accept": "application/json",
              'Content-Type': 'application/json',
              'X-ORIGIN': 'production--openresty-dejobs-org.microsites.recruitrooster.com'
            }
          })
          const data = await response.json()
          this.setInitialAllResults(data.jobs)
        }
        // Use initial results for empty search
        this.results = this.initialAllResults
      } else {
        const response = await fetch(`https://prod-search-api.jobsyn.org/api/v1/solr/search?q=${this.q}&location=${this.location}&page=1&num_items=10`, {
          method: 'GET',
          headers: {
            "Accept": "application/json",
            'Content-Type': 'application/json',
            'X-ORIGIN': 'production--openresty-dejobs-org.microsites.recruitrooster.com'
          }
        })
        const data = await response.json()
        this.setResults(data.jobs)
      }
    },
    clearSearch() {
      this.q = ''
      this.location = ''
      this.results = this.initialAllResults
    }
  }
})
