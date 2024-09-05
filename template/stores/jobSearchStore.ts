import {defineStore} from "pinia"

interface FilterItem {
    display: string
    link: string
    value: number
}

interface Filters {
    [key: string]: FilterItem[]
}

interface SearchResponse {
    filters: Filters
    jobs: any[]
    pagination: {
        total_pages: number
    }
}

interface JobSearchState {
    q: string
    location: string
    results: SearchResponse
    initialAllResults: SearchResponse
    hasPerformedInitialSearch: boolean
    page: number
    isLoading: boolean
    lastClickedJobGuid: string | null
}

export const useJobSearchStore = defineStore("jobSearch", {
    state: (): JobSearchState => ({
        q: "",
        location: "",
        results: {
            filters: {},
            jobs: [],
            pagination: {
                total_pages: 0,
            },
        },
        initialAllResults: {
            filters: {},
            jobs: [],
            pagination: {
                total_pages: 0,
            },
        },
        hasPerformedInitialSearch: false,
        page: 1,
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
        setResults(results: SearchResponse) {
            this.results = results
        },
        incrementPage() {
            if (this.page < this.results?.pagination?.total_pages) {
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
                    this.initialAllResults?.jobs?.length > 0 &&
                    !forceSearch
                ) {
                    this.results = {...this.initialAllResults}
                    return
                }

                // If search params haven't changed and it's not a forced search, don't perform a new search
                if (
                    this.hasPerformedInitialSearch &&
                    !forceSearch &&
                    this.page >= 1 &&
                    this.results?.jobs?.length > 0
                ) {
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
                    this.results.jobs = [...this.results.jobs, ...data.jobs]
                }

                // If this was an "all jobs" search, save the results and mark that we've performed the initial search
                if (this.q === "" && this.location === "" && !this.hasPerformedInitialSearch) {
                    this.initialAllResults = {...this.results}
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
            const currentResultsCount = this.results?.jobs.length
            await this.performSearch(true)
            if (this.results?.jobs.length > currentResultsCount) {
                return this.results?.jobs[currentResultsCount].guid
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
