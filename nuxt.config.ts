// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxt/eslint", "nuxt-primevue"],
  primevue: {
    options: { ripple: true },
  },
  css: [
    "primevue/resources/themes/aura-light-green/theme.css",
    "primeflex/primeflex.css",
    "primeicons/primeicons.css",
  ],
  imports: {
    dirs: ["dtos/*.ts"],
  },
});
