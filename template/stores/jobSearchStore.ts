import { defineStore } from 'pinia'

interface JobSearchState {
  q: string
  location: string
  results: any[]
  initialAllResults: any[]
  hasPerformedInitialSearch: boolean
  page: number
  totalPages: number
  isLoading: boolean
}

export const useJobSearchStore = defineStore('jobSearch', {
  state: (): JobSearchState => ({
    q: '',
    location: '',
    results: [],
    initialAllResults: [],
    hasPerformedInitialSearch: false,
    page: 1,
    totalPages: 1,
    isLoading: false
  }),
  actions: {
    setSearchParams(q: string, location: string) {
      this.q = q
      this.location = location
      this.page = 1 // Reset page when search params change
    },
    setResults(results: any[], totalPages: number) { // Replace 'any' with a more specific type
      this.results = results
      this.totalPages = totalPages
    },
    incrementPage() {
      if (this.page < this.totalPages) {
        this.page++
      }
    },
    async performSearch(forceSearch: boolean = false) {
      if (this.isLoading && this.hasPerformedInitialSearch) return

      this.isLoading = true

      try {
        if (this.q === '' && this.location === '' && this.hasPerformedInitialSearch && !forceSearch) {
          this.results = this.initialAllResults
          return
        }

        // If search params haven't changed and it's not a forced search, don't perform a new search
        if (!forceSearch && this.page === 1 && this.results.length > 0) {
          return
        }

        const response = await fetch(`https://prod-search-api.jobsyn.org/api/v1/solr/search?q=${this.q}&location=${this.location}&page=${this.page}&num_items=10`, {
          method: 'GET',
          headers: {
            "Accept": "application/json",
            'Content-Type': 'application/json',
            'X-ORIGIN': 'production--openresty-dejobs-org.microsites.recruitrooster.com'
          }
        })
        const data = await response.json()

        if (this.page === 1) {
          this.setResults(data.jobs, data.pagination.total_pages)
        } else {
          this.results = [...this.results, ...data.jobs]
          // this.totalPages = data.pagination.total_pages
        }

        // If this was an "all jobs" search, save the results and mark that we've performed the initial search
        if (this.q === '' && this.location === '') {
          this.initialAllResults = this.results
          this.hasPerformedInitialSearch = true
        }
      } catch (error) {
        console.error('Error performing search:', error)
      } finally {
        this.isLoading = false
      }
    },
    async loadMore() {
      this.incrementPage()
      const currentResultsCount = this.results.length
      await this.performSearch(true)
      if (this.results.length > currentResultsCount) {
        return this.results[currentResultsCount].guid
      }
      return null
    }
  }
})
