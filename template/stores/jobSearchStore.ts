import {defineStore} from "pinia"

interface FilterItem {
    display: string
    link: string
    value: number
}

interface Filters {
    [key: string]: FilterItem[]
}
interface JobSearchState {
    q: string
    location: string
    results: any[]
    filters: Filters
    initialAllResults: any[]
    initialAllTotalPages: number
    hasPerformedInitialSearch: boolean
    page: number
    totalPages: number
    isLoading: boolean
    lastClickedJobGuid: string | null
}

export const useJobSearchStore = defineStore("jobSearch", {
    state: (): JobSearchState => ({
        q: "",
        location: "",
        results: [],
        filters: {},
        initialAllResults: [],
        initialAllTotalPages: 1,
        hasPerformedInitialSearch: false,
        page: 1,
        totalPages: 1,
        isLoading: false,
        lastClickedJobGuid: null,
    }),
    actions: {
        setSearchParams(q: string, location: string) {
            if (this.q !== q || this.location !== location) {
                this.page = 1
            }
            this.q = q
            this.location = location
        },
        setResults(results: any[]) {
            this.results = results.jobs
            this.totalPages = results.pagination.total_pages
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
                if (
                    this.q === "" &&
                    this.location === "" &&
                    this.page === 1 &&
                    this.initialAllResults.length > 0 &&
                    !forceSearch
                ) {
                    this.results = this.initialAllResults
                    this.totalPages = this.initialAllTotalPages
                    return
                }

                // If search params haven't changed and it's not a forced search, don't perform a new search
                if (!forceSearch && this.page >= 1 && this.results.length > 0) {
                    return
                }

                const response = await fetch(
                    `https://prod-search-api.jobsyn.org/api/v1/solr/search?q=${this.q}&location=${this.location}&page=${this.page}`,
                    {
                        method: "GET",
                        headers: {
                            "Accept": "application/json",
                            "Content-Type": "application/json",
                            "X-ORIGIN":
                                "production--openresty-dejobs-org.microsites.recruitrooster.com",
                        },
                    }
                )
                const data = await response.json()

                if (this.page === 1) {
                    this.setResults(data)
                } else {
                    this.results = [...this.results, ...data.jobs]
                    // this.totalPages = data.pagination.total_pages
                }

                // If this was an "all jobs" search, save the results and mark that we've performed the initial search
                if (this.q === "" && this.location === "" && !this.hasPerformedInitialSearch) {
                    this.initialAllResults = this.results
                    this.initialAllTotalPages = this.totalPages
                    this.hasPerformedInitialSearch = true
                }
            } catch (error) {
                console.error("Error performing search:", error)
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
        },
        setLastClickedJobGuid(guid: string) {
            this.lastClickedJobGuid = guid
        },
        clearLastClickedJobGuid() {
            this.lastClickedJobGuid = null
        },
    },
})
