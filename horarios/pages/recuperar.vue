<script setup lang="ts">
import { ref } from 'vue'
import supabase from '~/supabase'
import { useRouter } from '#app'

const router = useRouter()
const nuevaContrasena = ref('')
const confirmarContrasena = ref('')
const mensaje = ref('')
const cargando = ref(false)

/**
 * Actualiza la contraseña del usuario si ambas coinciden y son válidas
 */
const actualizarContrasena = async () => {
  if (nuevaContrasena.value.length < 8) {
    mensaje.value = 'La contraseña debe tener al menos 8 caracteres.'
    return
  }

  if (nuevaContrasena.value !== confirmarContrasena.value) {
    mensaje.value = 'Las contraseñas no coinciden.'
    return
  }

  cargando.value = true

  const { error } = await supabase.auth.updateUser({
    password: nuevaContrasena.value,
  })

  mensaje.value = error
    ? `Error: ${error.message}`
    : 'Contraseña actualizada correctamente. Serás redirigido al inicio de sesión.'

  if (!error) {
    setTimeout(() => router.push('/'), 2500)
  }

  cargando.value = false
}
</script>

<template>
  <div class="max-w-md mx-auto mt-12 p-6 bg-white rounded-lg shadow">
    <!-- Título -->
    <h1 class="text-xl font-bold mb-4 text-center">Restablecer Contraseña</h1>

    <!-- Campo nueva contraseña -->
    <UInput
      v-model="nuevaContrasena"
      type="password"
      placeholder="Nueva contraseña"
      class="mb-4"
    />

    <!-- Campo confirmar contraseña -->
    <UInput
      v-model="confirmarContrasena"
      type="password"
      placeholder="Confirmar contraseña"
      class="mb-4"
    />

    <!-- Botón de actualización -->
    <UButton
      @click="actualizarContrasena"
      :loading="cargando"
      block
      class="w-full"
    >
      Actualizar contraseña
    </UButton>

    <!-- Mensaje de estado -->
    <p v-if="mensaje" class="mt-4 text-sm text-center text-gray-600">{{ mensaje }}</p>
  </div>
</template>

<style scoped>
input {
  font-size: 16px;
}
</style>
