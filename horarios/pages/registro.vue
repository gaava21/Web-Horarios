<script setup>
import { ref } from 'vue'

const nombre = ref('')
const correo = ref('')
const usuario = ref('')
const contraseña = ref('')
async function usuarios() {
  try {
    const data = await $fetch('/api/auth/register', {
      method: "POST",
      body: {
        nombre: nombre.value,
        password: contraseña.value,
        email: correo.value
      }
    })
    //usuarios.value = data
    console.log(data)

  } catch (error) {
    console.error('Error obteniendo usuarios:', error)
  }
}
</script>

<template>
  <div class="flex">

  </div>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
      <UButton color="white" class=" text=black mr-60" :ui="{ rounded: 'rounded-full' }">Volver</UButton>
      <h1 class="text-xl font-semibold mb-4">Registro</h1>

      <UInput v-model="nombre" class="w-full mb-4" placeholder="Nombre" />
      <UInput v-model="correo" class="w-full mb-4" placeholder="Correo" />
      <UInput v-model="telefono" class="w-full mb-4" placeholder="Teléfono" />
      <UInput type="password" v-model="contraseña" class="w-full mb-4" placeholder="Contraseña" />

      <div class="space-y-2"> <!-- Asegura que los botones estén bien separados -->
        <UButton @click="usuarios" block class="w-full" :ui="{ rounded: 'rounded-full' }">
          Registrar
        </UButton>
        <UButton block class="w-full" :ui="{ rounded: 'rounded-full' }" color="red">
          Cancelar
        </UButton>
      </div>
    </div>
  </div>
</template>