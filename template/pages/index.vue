<template>
    <main id="main">
        <Head>
            <Title>Home</Title>
        </Head>
        <JobSearchForm @search="performSearch" />
    </main>
</template>

<script setup lang="ts">
// import { useQuery } from
// const { q, location } = useQuery()
// let searchParams = { q, location }

function performSearch(searchParams: { q: string, location: string }) {
  // Perform the actual search here, e.g., navigate to search results page or fetch results
  console.log('Searching with params:', searchParams)
}
</script>