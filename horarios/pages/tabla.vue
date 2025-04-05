<script setup>
import { useRouter } from '#app'
import { ref, onMounted, computed } from 'vue'
import { useAuth } from '~/composables/auth'
import supabase from '~/supabase'

const usuarios = ref([])
const { userRole, roleLoaded, checkSession } = useAuth()
const router = useRouter()

// Consulta que obtiene los usuarios junto con sus reservas y la hora asociada desde public_horarios
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

const eliminarUsuario = async (id) => {
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

onMounted(async () => {
  await checkSession()
  if (roleLoaded.value && userRole.value !== 'admin') {
    router.push('/lobby')
  } else {
    await obtenerUsuarios()
  }
})

// Propiedad computada que agrega un campo "agenda" a cada usuario
const usuariosConAgenda = computed(() => 
  usuarios.value.map(usuario => {
    if (usuario.reservas && usuario.reservas.length > 0) {
      // Se extraen las horas de cada reserva.
      // Se asume que la relación "public_horarios" es un objeto (si es un array, se puede ajustar).
      const horas = usuario.reservas.map(r => r.public_horarios ? r.public_horarios.hora : null)
                                  .filter(Boolean)
      const agendaText = horas.length > 0 ? horas.join(', ') : 'Agendado'
      return { ...usuario, agenda: agendaText }
    } else {
      return { ...usuario, agenda: 'Sin agenda' }
    }
  })
)
</script>

<template>
  <div v-if="userRole === 'admin' && roleLoaded" class="p-6">
    <NuxtLink to="lobby">
      <UButton block class="w-full mt-2 mr-8 size-9" :ui="{ rounded: 'rounded-full' }">
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
              <td class="border border-gray-300 px-4 py-2">
                {{ usuario.nombre || 'Sin nombre' }}
              </td>
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
          <template v-else>
            <tr>
              <td class="border border-gray-300 px-4 py-2 text-center" colspan="5">
                No hay usuarios
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </div>
  <div v-else class="text-center py-8 text-gray-600">
    Cargando o sin acceso...
  </div>
</template>