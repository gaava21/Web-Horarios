export default defineNuxtConfig({
  routeRules: {
    '/lobby': { appMiddleware: 'auth' }
  },

  runtimeConfig: {
    CLAVE_SECRETA_ADMIN: process.env.CLAVE_SECRETA_ADMIN as string, // ← correcto aquí

    public: {
      // variables visibles en el cliente (ej: API_URL)
    }
  }
})
