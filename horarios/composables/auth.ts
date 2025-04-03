import { ref, onMounted } from 'vue'
import supabase from '~/supabase'
import { useRouter } from '#app'
import type { AuthUser } from '@supabase/supabase-js'

type Usuario = {
  id: string
  correo: string
  nombre: string
  tipo_usuario: string
}

const user = ref<AuthUser | null>(null)
const userName = ref<string | null>('Usuario')
const userRole = ref<string | null>(null)
const roleLoaded = ref(false)

export function useAuth() {
  const router = useRouter()

  const signIn = async (email: string, password: string) => {
    console.log('Intentando iniciar sesión...')
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      console.error('Error en el inicio de sesión:', error.message)
      alert('Error durante el inicio de sesión: ' + error.message)
      throw error
    }

    if (data.user) {
      console.log('Inicio de sesión exitoso:', data.user)
      user.value = data.user
      await fetchUserName(data.user.id)
      router.push('/lobby')
    }
  }

  const fetchUserName = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('nombre, tipo_usuario')
        .eq('id', userId)
        .single()

      if (error) throw error

      userName.value = data?.nombre || 'Usuario'
      userRole.value = data?.tipo_usuario || null
      roleLoaded.value = true
      console.log('Nombre y rol cargados:', userName.value, userRole.value)
    } catch (error) {
      console.error('Error al obtener el nombre y rol:', error)
    }
  }

  const checkSession = async () => {
    const { data } = await supabase.auth.getSession()
    user.value = data?.session?.user || null

    if (user.value) {
      await fetchUserName(user.value.id)
    }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Error al cerrar sesión:', error.message)
      throw error
    }
    user.value = null
    userName.value = 'Usuario'
    userRole.value = null
    roleLoaded.value = false
    router.push('/')
  }

  onMounted(() => {
    checkSession()
    supabase.auth.onAuthStateChange((_event, session) => {
      user.value = session?.user || null
      if (user.value) {
        fetchUserName(user.value.id)
      }
    })
  })

  return { user, userName, userRole, roleLoaded, signIn, signOut, checkSession }
}
