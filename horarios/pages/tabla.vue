<script setup>
import { useRouter } from '#app'
import { ref, onMounted, computed } from 'vue'
import { useAuth } from '~/composables/auth'
import supabase from '~/supabase'

const usuarios = ref([])
const { userRole, roleLoaded, checkSession } = useAuth()
const router = useRouter()

// 🔄 Obtener usuarios directamente desde Supabase
const obtenerUsuarios = async () => {
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .select('id, nombre, correo')

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
    await obtenerUsuarios() // 🔁 Solo si es admin
  }
})

const usuariosValidos = computed(() =>
  usuarios.value.filter(usuario => usuario && usuario.id)
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
            <th class="border border-gray-300 px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <template v-if="usuariosValidos.length">
            <tr
              v-for="usuario in usuariosValidos"
              :key="usuario.id"
              class="hover:bg-gray-100"
            >
              <td class="border border-gray-300 px-4 py-2">{{ usuario.id }}</td>
              <td class="border border-gray-300 px-4 py-2">
                {{ usuario.nombre || 'Sin nombre' }}
              </td>
              <td class="border border-gray-300 px-4 py-2">{{ usuario.correo }}</td>
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
              <td class="border border-gray-300 px-4 py-2 text-center" colspan="4">
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
