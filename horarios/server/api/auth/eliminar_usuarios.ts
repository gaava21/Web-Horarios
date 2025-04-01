import { H3Event } from 'h3'
import supabase from '~/supabase'

export default defineEventHandler(async (event: H3Event) => {
  const body = await readBody(event)

  if (!body.id) {
    throw createError({ statusCode: 400, statusMessage: 'ID de usuario requerido' })
  }

  const { error } = await supabase
    .from('usuarios')
    .delete()
    .eq('id', body.id)

  if (error) {
    console.error('Error al eliminar usuario:', error)
    throw createError({ statusCode: 500, statusMessage: 'Error al eliminar usuario' })
  }

  return { message: 'Usuario eliminado exitosamente' }
})
