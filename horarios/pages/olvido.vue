<script setup lang="ts">
import { ref } from 'vue'
import supabase from '~/supabase'

const correo = ref('')
const mensaje = ref('')
const cargando = ref(false)

/**
 * Envía un enlace de recuperación de contraseña al correo proporcionado
 */
const enviarEnlaceRecuperacion = async () => {
  if (!correo.value) {
    mensaje.value = 'Por favor, ingresa tu correo electrónico.'
    return
  }

  cargando.value = true

  const { error } = await supabase.auth.resetPasswordForEmail(correo.value, {
    redirectTo: 'http://localhost:3000/recuperar', // Ajustar en producción
  })

  mensaje.value = error
    ? `Error: ${error.message}`
    : 'Se ha enviado un enlace para restablecer tu contraseña. Revisa tu correo.'

  cargando.value = false
}
</script>

<template>
  <div class="max-w-md mx-auto mt-12 p-6 bg-white rounded-lg shadow">
    
    <!-- Botón para volver al registro -->
      <NuxtLink to="registro">
        <UButton block class="w-full mt-2 mb-2 size-9" :ui="{ rounded: 'rounded-full' }">
          Atrás
        </UButton>
      </NuxtLink>

    <!-- Título -->
    <h1 class="text-xl font-bold mb-4 text-center">¿Olvidaste tu contraseña?</h1>

    <!-- Campo de correo -->
    <UInput
      v-model="correo"
      type="email"
      placeholder="Tu correo"
      class="mb-4"
    />

    <!-- Botón para enviar enlace -->
    <UButton
      @click="enviarEnlaceRecuperacion"
      :loading="cargando"
      block
      class="w-full"
    >
      Enviar enlace de recuperación
    </UButton>

    <!-- Mensaje de estado -->
    <p v-if="mensaje" class="mt-4 text-sm text-center text-gray-600">{{ mensaje }}</p>
  </div>
</template>
