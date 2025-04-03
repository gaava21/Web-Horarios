export default defineNuxtConfig({
  routeRules: {
    '/lobby': { appMiddleware: ['auth'] },
    '/perfil': { appMiddleware: ['auth'] },
    '/horarios': { appMiddleware: ['auth'] }
  },
  runtimeConfig: {
    CLAVE_SECRETA_ADMIN: process.env.CLAVE_SECRETA_ADMIN,
    public: {}
  }
})
