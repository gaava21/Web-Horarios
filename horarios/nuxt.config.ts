// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: ['@nuxt/ui']
  ,colorMode: {
    preference: 'light'
  },

  runtimeConfig: {
    CLAVE_SECRETA_ADMIN: process.env.NUXT_CLAVE_SECRETA_ADMIN,
    public: {}
  },
})