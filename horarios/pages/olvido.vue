<script setup lang="ts">
import { ref } from 'vue'
import supabase from '~/supabase'

const correo = ref('')
const mensaje = ref('')
const cargando = ref(false)

const enviarEnlaceRecuperacion = async () => {
  if (!correo.value) {
    mensaje.value = 'Por favor, ingresa tu correo electrónico.'
    return
  }

  cargando.value = true

  const { error } = await supabase.auth.resetPasswordForEmail(correo.value, {
    redirectTo: 'http://localhost:3000/recuperar', // Cambia esto a tu URL de producción si aplica
  })

  if (error) {
    mensaje.value = `Error: ${error.message}`
  } else {
    mensaje.value = 'Se ha enviado un enlace para restablecer tu contraseña. Revisa tu correo.'
  }

  cargando.value = false
}
</script>

<template>
  <div class="max-w-md mx-auto mt-12 p-6 bg-white rounded-lg shadow">
    <NuxtLink to="registro">
      <UButton block class="w-full mt-2 mr-8 mb-2 size-9" :ui="{ rounded: 'rounded-full' }">
        Atras
      </UButton>
    </NuxtLink>
    <h1 class="text-xl font-bold mb-4 text-center">¿Olvidaste tu contraseña?</h1>

    <UInput
      v-model="correo"
      type="email"
      placeholder="Tu correo"
      class="mb-4"
    />

    <UButton @click="enviarEnlaceRecuperacion" :loading="cargando" block class="w-full">
      Enviar enlace de recuperación
    </UButton>

    <p v-if="mensaje" class="mt-4 text-sm text-center text-gray-600">{{ mensaje }}</p>
  </div>
</template>
