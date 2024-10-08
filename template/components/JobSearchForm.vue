<template>
    <form @submit.prevent="handleSearch" class="bg-primary">
        <h1 class="text-lg text-white">Search Jobs</h1>
        <div class="space-y-4 lg:space-y-0 lg:flex lg:space-x-4">
            <div class="flex-1">
                <label for="q" class="sr-only">Job Title or Keywords</label>
                <AutocompleteInput
                    id="q"
                    v-model="searchQuery"
                    :fetch-suggestions="fetchTitleSuggestions"
                    placeholder="Job title or keywords"
                    @clear="clearSearch"
                />
            </div>
            <div class="flex-1">
                <label for="location" class="sr-only">Location</label>
                <AutocompleteInput
                    id="location"
                    v-model="locationQuery"
                    :fetch-suggestions="fetchLocationSuggestions"
                    placeholder="City, state, or zip code"
                    @clear="clearLocation"
                >
                </AutocompleteInput>
            </div>
            <button
                type="submit"
                class="w-full lg:w-auto px-6 py-2 bg-secondary text-white rounded-md hover:bg-secondary-dark transition-colors"
            >
                Search
            </button>
        </div>
    </form>
</template>

<script setup lang="ts">
import {ref, watch, onMounted} from "vue"
import {useRoute, useRouter} from "vue-router"
import {useDebounce, useGeolocation} from "@vueuse/core"
import {useJobSearchStore} from "~/stores/jobSearchStore"
import AutocompleteInput from "./AutocompleteInput.vue"
//   import IconMapPin from './IconMapPin.vue'

const route = useRoute()
const router = useRouter()
const jobSearchStore = useJobSearchStore()

const searchQuery = ref("")
const locationQuery = ref("")
const debouncedSearchQuery = useDebounce(searchQuery, 300)
const debouncedLocationQuery = useDebounce(locationQuery, 300)
const {coords, error: geoError} = useGeolocation()

const {buids} = useAppConfig()

async function fetchTitleSuggestions(query: string) {
    if (!query) return []
    const params = new URLSearchParams({
        q: query,
    })
    const response = await fetch(
        `https://prod-search-api.jobsyn.org/api/v1/complete/title?${params}`,
        {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "X-ORIGIN": "production--openresty-dejobs-org.microsites.recruitrooster.com",
            },
        }
    )
    const data = await response.json()
    return data.map((item: {display: string}) => ({value: item.display}))
}

async function fetchLocationSuggestions(query: string) {
    if (!query) return []
    const response = await fetch(
        `https://prod-search-api.jobsyn.org/api/v1/complete/location?q=${encodeURIComponent(query)}`
    )
    const data = await response.json()
    return data.map((item: {display: string}) => ({value: item.display}))
}

function handleSearch() {
    jobSearchStore.setSearchParams(searchQuery.value, locationQuery.value)
    jobSearchStore.performSearch(true) // Force a new search
    updateRoute()
}

function updateRoute() {
    const query = {}
    if (searchQuery.value) {
        query.q = searchQuery.value
    }
    if (locationQuery.value) {
        query.location = locationQuery.value
    }
    router.replace({
        path: "/jobs/",
        query,
    })
}

function clearSearch() {
    searchQuery.value = ""
    jobSearchStore.setSearchParams("", locationQuery.value)
    jobSearchStore.performSearch()
    updateRoute()
}

function clearLocation() {
    locationQuery.value = ""
    jobSearchStore.setSearchParams(searchQuery.value, "")
    jobSearchStore.performSearch()
    updateRoute()
}

function useCurrentLocation() {
    if (coords.value) {
        locationQuery.value = `${coords.value.latitude},${coords.value.longitude}`
    } else if (geoError.value) {
        console.error("Geolocation error:", geoError.value)
        // You might want to show an error message to the user here
    }
}

watch(
    () => route.query,
    (newQuery) => {
        const newQ = typeof newQuery.q === "string" ? newQuery.q : ""
        const newLocation = typeof newQuery.location === "string" ? newQuery.location : ""

        if (newQ !== searchQuery.value || newLocation !== locationQuery.value) {
            searchQuery.value = newQ
            locationQuery.value = newLocation
            jobSearchStore.setSearchParams(newQ, newLocation)
        }
    },
    {immediate: true}
)
</script>
