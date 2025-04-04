<script setup lang="ts">
import { useAuth } from '~/composables/auth'

// Extrae nombre, rol y función para cerrar sesión desde el composable de autenticación
const { userName, userRole, signOut } = useAuth()
</script>

<template>
  <div class="min-h-screen bg-cover bg-center" style="background-image: url(/images/portada.png)">
    <div class="flex items-center justify-end p-4 bg-gray-100">

      <!-- Botón visible solo para usuarios con rol admin -->
      <NuxtLink v-if="userRole === 'admin'" to="/tabla">
        <UButton color="white" class="p-2 mr-2 text-black rounded-lg ml-auto">
          <img src="/images/perfil.png" class="w-6 h-6 inline-block mr-2" />
          Admin Panel
        </UButton>
      </NuxtLink>

      <!-- Acceso general a la sección de horarios -->
      <NuxtLink to="/horarios">
        <UButton color="white" class="p-2 mr-2 text-black rounded-lg ml-auto">
          <img src="/images/horarios.png" class="w-6 h-6 inline-block mr-2" />
          Horarios
        </UButton>
      </NuxtLink>

      <!-- Menú desplegable: Perfil y cerrar sesión -->
      <UPopover>
        <UButton color="white" class="p-2 w-10 text-black text-center rounded-lg">
          ...
        </UButton>
        <template #panel>
          <div class="bg-white shadow-lg rounded-lg p-2 w-48 text-center">
            <h1 class="text-xl font-semibold mb-4">
              Bienvenido {{ userName || 'Usuario' }}
            </h1>

            <NuxtLink to="/perfil">
              <UButton color="white" class="text-black">
                <img src="/images/perfil.png" class="w-6 h-6 inline-block mr-2" />
                Perfil Configuración
              </UButton>
            </NuxtLink>

            <UButton @click="signOut" class="mt-4">Cerrar sesión</UButton>
          </div>
        </template>
      </UPopover>
    </div>
  </div>
</template>
