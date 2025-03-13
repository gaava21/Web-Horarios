import { H3Event } from 'h3'
import supabase from '~/supabase'

export default defineEventHandler(async (event: H3Event) => {
  // Consulta personalizada a la tabla pública de usuarios
  const { data, error } = await supabase
    .from('usuarios')  // Reemplaza 'usuarios' con el nombre real de tu tabla
    .select('id, correo, nombre')  // Asegúrate de que el campo 'nombre' existe en la tabla pública

  if (error) {
    console.error('Error obteniendo usuarios:', error)
    throw createError({ statusCode: 500, statusMessage: 'Error al obtener usuarios' })
  }

  return data
})
