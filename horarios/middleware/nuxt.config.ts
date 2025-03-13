export default defineNuxtConfig({
    routeRules: {
      '/lobby': { appMiddleware: 'auth' }  // Protege la ruta /lobby con el middleware auth
    }
  })
  