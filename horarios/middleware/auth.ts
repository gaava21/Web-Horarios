import { useAuth } from '~/composables/auth'

export default defineNuxtRouteMiddleware((to, from) => {
  const { user, checkSession } = useAuth()

  if (!user.value) {
    checkSession() // Verifica si hay una sesión activa
    if (!user.value) {
      return navigateTo('/') // Redirecciona al login si no hay sesión
    }
  }
})
