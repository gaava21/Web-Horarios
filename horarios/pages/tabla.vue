<script setup>
import { ref, onMounted, computed } from 'vue'

const usuarios = ref([])

// Función para obtener los usuarios
const obtenerUsuarios = async () => {
  try {
    const data = await $fetch('/api/auth/obtener_usuarios_auth')
    // Filtramos los elementos nulos o sin id
    usuarios.value = data.filter(u => u && u.id)
  } catch (error) {
    console.error('Error obteniendo usuarios:', error)
  }
}

onMounted(() => {
  obtenerUsuarios()
})

// Propiedad computada para tener solo usuarios válidos
const usuariosValidos = computed(() => {
  return usuarios.value.filter(usuario => usuario && usuario.id)
})
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
          </tr>
        </thead>
        <tbody>
          <!-- Si hay usuarios válidos, se renderizan -->
          <template v-if="usuariosValidos.length">
            <tr v-for="usuario in usuariosValidos" :key="usuario.id" class="hover:bg-gray-100">
              <td class="border border-gray-300 px-4 py-2">{{ usuario.id }}</td>
              <td class="border border-gray-300 px-4 py-2">
                {{ usuario.nombre|| 'Sin nombre' }}
              </td>
              <td class="border border-gray-300 px-4 py-2">{{ usuario.correo }}</td>
            </tr>
          </template>
          <!-- Si no hay usuarios, muestra un mensaje -->
          <template v-else>
            <tr>
              <td class="border border-gray-300 px-4 py-2" colspan="3">No hay usuarios</td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>
