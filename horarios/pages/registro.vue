<script setup>
import { ref } from 'vue'

const nombre = ref('')
const correo = ref('')
const contraseña = ref('')
const telefono = ref('') // Agrega esta variable para el teléfono
const tipo_usuario = ref('')

async function usuarios() {
  try {
    const data = await $fetch('/api/auth/register', {
      method: "POST",
      body: {
        nombre: nombre.value,
        password: contraseña.value,
        email: correo.value,
        telefono: telefono.value,
        tipo_usuario: tipo_usuario.value  // Se lo mandamos al backend
      }
    })
    console.log(data)
  } catch (error) {
    console.error('Error obteniendo usuarios:', error)
  }
}
</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
      <NuxtLink to="/">
        <UButton block class="w-full mt-2 mr-8 size-9" :ui="{ rounded: 'rounded-full' }">
          Atras
        </UButton>
      </NuxtLink>
      <h1 class="text-xl font-semibold mb-4">Registro</h1>
      <UInput v-model="tipo_usuario" class="w-full mb-4" placeholder="Clave Segura (opcional)" />
      <UInput v-model="nombre" class="w-full mb-4" placeholder="Nombre" />
      <UInput v-model="correo" class="w-full mb-4" placeholder="Correo" />
      <UInput v-model="telefono" class="w-full mb-4" placeholder="Teléfono" />
      <UInput type="password" v-model="contraseña" class="w-full mb-4" placeholder="Contraseña" />

      <div class="space-y-2">
        <UButton @click="usuarios" block class="w-full" :ui="{ rounded: 'rounded-full' }">
          Registrar
        </UButton>

        <NuxtLink to="olvido">
          <UButton block class="w-full mt-2" :ui="{ rounded: 'rounded-full' }">
            Olvidé mi contraseña
          </UButton>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
