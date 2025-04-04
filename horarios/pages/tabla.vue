<script setup lang="ts">
import { useRouter } from '#app'
import { ref, onMounted, computed } from 'vue'
import { useAuth } from '~/composables/auth'
import supabase from '~/supabase'

const router = useRouter()
const { userRole, roleLoaded, checkSession } = useAuth()
const usuarios = ref([])
const redirigiendo = ref(false)
/**
 * Obtiene los usuarios con sus reservas y horarios asociados
 */
const obtenerUsuarios = async () => {
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .select(`
        id,
        nombre,
        correo,
        reservas: public_reservas (
          id,
          horario_id,
          public_horarios (
            hora
          )
        )
      `)

    if (error) throw error
    usuarios.value = data || []
  } catch (error) {
    console.error('Error obteniendo usuarios:', error)
  }
}

/**
 * Elimina un usuario de la tabla `usuarios`
 */
const eliminarUsuario = async (id: string) => {
  const confirmacion = confirm('¿Estás seguro de que deseas eliminar este usuario?')
  if (!confirmacion) return

  try {
    await supabase.from('usuarios').delete().eq('id', id)
    alert('Usuario eliminado exitosamente')
    await obtenerUsuarios()
  } catch (error) {
    console.error('Error al eliminar usuario:', error)
    alert('Hubo un error al eliminar el usuario.')
  }
}
/**
 * Verifica si el usuario tiene permiso y obtiene datos
 */
 onMounted(async () => {
  await checkSession()
})

// Esperar a que roleLoaded esté listo, y luego verificar si no es admin
watch(roleLoaded, async (loaded) => {
  if (loaded && userRole.value !== 'admin') {
  redirigiendo.value = true
  await new Promise(resolve => setTimeout(resolve, 3000))
  router.push('/lobby')
  } else if (loaded && userRole.value === 'admin') {
    await obtenerUsuarios()
  }
})

/**
 * Agrega texto de agenda legible por cada usuario
 */
const usuariosConAgenda = computed(() =>
  usuarios.value.map(usuario => {
    const horas = usuario.reservas?.map(r => r.public_horarios?.hora).filter(Boolean) || []
    return {
      ...usuario,
      agenda: horas.length ? horas.join(', ') : 'Sin agenda'
    }
  })
)
</script>

<template>
  <div v-if="userRole === 'admin' && roleLoaded" class="p-6">
    <NuxtLink to="lobby">
      <UButton block class="w-full mt-2 mb-4" :ui="{ rounded: 'rounded-full' }">
        Atrás
      </UButton>
    </NuxtLink>

    <h1 class="text-2xl font-bold mb-4">Lista de Usuarios</h1>

    <div class="overflow-x-auto">
      <table class="min-w-full border-collapse border border-gray-300">
        <thead class="bg-gray-200">
          <tr>
            <th class="border border-gray-300 px-4 py-2">ID</th>
            <th class="border border-gray-300 px-4 py-2">Nombre</th>
            <th class="border border-gray-300 px-4 py-2">Email</th>
            <th class="border border-gray-300 px-4 py-2">Agenda</th>
            <th class="border border-gray-300 px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <template v-if="usuariosConAgenda.length">
            <tr
              v-for="usuario in usuariosConAgenda"
              :key="usuario.id"
              class="hover:bg-gray-100"
            >
              <td class="border border-gray-300 px-4 py-2">{{ usuario.id }}</td>
              <td class="border border-gray-300 px-4 py-2">{{ usuario.nombre || 'Sin nombre' }}</td>
              <td class="border border-gray-300 px-4 py-2">{{ usuario.correo }}</td>
              <td class="border border-gray-300 px-4 py-2">{{ usuario.agenda }}</td>
              <td class="border border-gray-300 px-4 py-2 text-center">
                <button
                  @click="eliminarUsuario(usuario.id)"
                  class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          </template>
          <tr v-else>
            <td colspan="5" class="text-center py-4 text-gray-500">
              No hay usuarios registrados.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <div v-else-if="redirigiendo" class="text-center py-8 text-gray-600">
    No tienes acceso. Redirigiendo al lobby...
  </div>
  <div v-else class="text-center py-8 text-gray-600">
    Cargando o sin acceso...
  </div>
</template>
