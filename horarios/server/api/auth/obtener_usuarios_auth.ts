import { H3Event, getCookie } from 'h3'
import supabase from '~/supabase'

export default defineEventHandler(async (event: H3Event) => {
  // 1. Obtener el token de acceso desde la cookie
  const access_token = getCookie(event, 'sb-access-token')

  if (!access_token) {
    throw createError({ statusCode: 401, statusMessage: 'No autorizado' })
  }

  // 2. Verificar usuario con el token
  const { data: { user }, error: authError } = await supabase.auth.getUser(access_token)

  if (authError || !user) {
    throw createError({ statusCode: 401, statusMessage: 'Token inválido o sesión expirada' })
  }

  // 3. Consultar si el usuario tiene rol de admin
  const { data: usuario, error: rolError } = await supabase
    .from('usuarios')
    .select('tipo_usuario')
    .eq('id', user.id)
    .single()

  if (rolError || usuario?.tipo_usuario !== 'admin') {
    throw createError({ statusCode: 403, statusMessage: 'Acceso denegado: solo administradores' })
  }

  // 4. Si es admin, obtener lista de usuarios
  const { data, error } = await supabase
    .from('usuarios')
    .select('id, correo, nombre')

  if (error) {
    console.error('Error obteniendo usuarios:', error)
    throw createError({ statusCode: 500, statusMessage: 'Error al obtener usuarios' })
  }

  return data
})
