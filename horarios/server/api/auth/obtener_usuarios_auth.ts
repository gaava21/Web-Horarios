import { H3Event } from 'h3'
import supabase from '~/supabase'

export default defineEventHandler(async (event: H3Event) => {
  // Agregar header para evitar el error 406
  setHeader(event, 'Accept', 'application/json')

  const { data, error } = await supabase
    .from('usuarios')
    .select('id, correo, nombre')

  if (error) {
    console.error('Error obteniendo usuarios:', error)
    throw createError({ statusCode: 500, statusMessage: 'Error al obtener usuarios' })
  }

  return data
})
