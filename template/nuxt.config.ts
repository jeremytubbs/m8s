// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: "2024-04-03",
    devtools: {enabled: true},
    hooks: {
        "pages:extend"(routes) {
            routes.push({
                path: "/:location/:title/:guid/job/",
                file: "~/pages/job.vue",
            })
        },
    },
    modules: ["@nuxtjs/tailwindcss", "@pinia/nuxt", "@nuxt/eslint"],
})
