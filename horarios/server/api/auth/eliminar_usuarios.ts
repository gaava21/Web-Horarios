import { H3Event } from 'h3'
import supabaseAdmin from '~/server/supabaseAdmin'

export default defineEventHandler(async (event: H3Event) => {
  const body = await readBody(event)
  const { id } = body

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'ID de usuario requerido' })
  }

  // 1. Eliminar el usuario del módulo de autenticación (auth)
  const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(id)
  if (authError) {
    console.error('Error al eliminar usuario en auth:', authError)
    throw createError({ 
      statusCode: 500, 
      statusMessage: `Error al eliminar usuario en auth: ${authError.message}` 
    })
  }

  // 2. Eliminar el registro en la tabla pública "usuarios"
  const { error: publicError } = await supabaseAdmin
    .from('usuarios')
    .delete()
    .eq('id', id)
  if (publicError) {
    console.error('Error al eliminar usuario en la tabla pública:', publicError)
    throw createError({ 
      statusCode: 500, 
      statusMessage: `Error al eliminar usuario en la tabla pública: ${publicError.message}` 
    })
  }

  return { message: 'Usuario eliminado exitosamente del auth y de la parte pública' }
})
