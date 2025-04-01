<script setup>
import { ref, onMounted, computed } from 'vue'

const usuarios = ref([])

// 🔄 Obtener usuarios desde la API
const obtenerUsuarios = async () => {
  try {
    const data = await $fetch('/api/auth/obtener_usuarios_auth')
    usuarios.value = data.filter(u => u && u.id)
  } catch (error) {
    console.error('Error obteniendo usuarios:', error)
  }
}

// 🗑️ Eliminar un usuario
const eliminarUsuario = async (id) => {
  const confirmacion = confirm('¿Estás seguro de que deseas eliminar este usuario?')
  if (!confirmacion) return

  try {
    await $fetch('/api/auth/eliminar_usuario', {
      method: 'POST',
      body: { id }
    })
    alert('Usuario eliminado exitosamente')
    await obtenerUsuarios() // 🔁 Recargar la lista
  } catch (error) {
    console.error('Error al eliminar usuario:', error)
    alert('Hubo un error al eliminar el usuario.')
  }
}

onMounted(() => {
  obtenerUsuarios()
})

const usuariosValidos = computed(() =>
  usuarios.value.filter(usuario => usuario && usuario.id)
)
</script>

<template>
  <div class="p-6">
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
</template>
