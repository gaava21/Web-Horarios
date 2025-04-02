import { useAuth } from '~/composables/auth'

export default defineNuxtRouteMiddleware(async (to, from) => {
  const { user, checkSession } = useAuth()
  await checkSession()  // Espera a que se verifique la sesión
  if (!user.value) {
    return navigateTo('/') // Redirecciona al login si no hay sesión
  }
})
