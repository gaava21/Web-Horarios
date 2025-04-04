import { useAuth } from '~/composables/auth'

export default defineNuxtRouteMiddleware(async () => {
  const { user, checkSession } = useAuth()
  await checkSession()
  if (!user.value) {
    return navigateTo('/')
  }
})
