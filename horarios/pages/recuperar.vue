<script setup lang="ts">
import { ref } from 'vue'
import supabase from '~/supabase'
import { useRouter } from '#app'

const router = useRouter()
const nuevaContrasena = ref('')
const confirmarContrasena = ref('')
const mensaje = ref('')
const cargando = ref(false)

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

  if (error) {
    mensaje.value = `Error: ${error.message}`
  } else {
    mensaje.value = 'Contraseña actualizada correctamente. Serás redirigido al inicio de sesión.'
    setTimeout(() => {
      router.push('/')
    }, 2500)
  }

  cargando.value = false
}
</script>

<template>
  <div class="max-w-md mx-auto mt-12 p-6 bg-white rounded-lg shadow">
    <h1 class="text-xl font-bold mb-4 text-center">Restablecer Contraseña</h1>

    <UInput
      v-model="nuevaContrasena"
      type="password"
      placeholder="Nueva contraseña"
      class="mb-4"
    />
    <UInput
      v-model="confirmarContrasena"
      type="password"
      placeholder="Confirmar contraseña"
      class="mb-4"
    />

    <UButton @click="actualizarContrasena" :loading="cargando" block class="w-full">
      Actualizar contraseña
    </UButton>

    <p v-if="mensaje" class="mt-4 text-sm text-center text-gray-600">{{ mensaje }}</p>
  </div>
</template>

<style scoped>
  input {
    font-size: 16px;
  }
</style>
