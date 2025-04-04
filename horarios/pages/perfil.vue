<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '~/composables/auth'
import supabase from '~/supabase'

const { user, userName, signOut } = useAuth()

const nuevoCorreo = ref('')
const nuevoNombre = ref('')
const mensaje = ref('')
const cargando = ref(false)

/**
 * Actualiza el correo electrónico del usuario
 */
const cambiarCorreo = async () => {
  if (!nuevoCorreo.value || !user.value?.id) return

  cargando.value = true
  const { error } = await supabase.auth.updateUser({ email: nuevoCorreo.value })

  mensaje.value = error
    ? `Error al cambiar el correo: ${error.message}`
    : 'Correo actualizado correctamente. Revisa tu nuevo correo para confirmar.'

  cargando.value = false
  if (!error) window.location.reload()
}

/**
 * Actualiza el nombre del usuario en la tabla personalizada
 */
const cambiarNombre = async () => {
  if (!nuevoNombre.value || !user.value?.id) return

  cargando.value = true
  const { error } = await supabase
    .from('usuarios')
    .update({ nombre: nuevoNombre.value })
    .eq('id', user.value.id)

  mensaje.value = error
    ? `Error al cambiar el nombre: ${error.message}`
    : 'Nombre actualizado correctamente.'

  cargando.value = false
  if (!error) window.location.reload()
}

/**
 * Enviar correo de recuperación para cambiar contraseña
 */
const solicitarCambioContrasena = async () => {
  if (!user.value?.email) return

  cargando.value = true
  const { error } = await supabase.auth.resetPasswordForEmail(user.value.email, {
    redirectTo: 'http://localhost:3000/recuperar',
  })

  mensaje.value = error
    ? `Error al enviar enlace de cambio de contraseña: ${error.message}`
    : 'Correo enviado para cambiar la contraseña.'

  cargando.value = false
}
</script>

<template>
  <div class="min-h-screen bg-gray-200 flex items-center justify-center">
    <div class="p-6 max-w-md mx-auto space-y-4 bg-white shadow-lg rounded-lg mt-8">
      
      <!-- Botón de regreso -->
      <NuxtLink to="lobby">
        <UButton block class="w-full mt-2 mr-8 size-9" :ui="{ rounded: 'rounded-full' }">
          Atrás
        </UButton>
      </NuxtLink>

      <!-- Datos actuales -->
      <h2 class="text-2xl font-bold text-center">Perfil del Usuario</h2>
      <p><strong>Nombre actual:</strong> {{ userName }}</p>
      <p><strong>Correo actual:</strong> {{ user?.email }}</p>

      <!-- Cambiar nombre -->
      <div>
        <label class="block font-semibold mb-1">Nuevo nombre</label>
        <UInput v-model="nuevoNombre" placeholder="Ingrese nuevo nombre" class="mb-2" />
        <UButton @click="cambiarNombre" :loading="cargando" class="w-full">Cambiar nombre</UButton>
      </div>

      <!-- Cambiar correo -->
      <div>
        <label class="block font-semibold mb-1 mt-4">Nuevo correo</label>
        <UInput v-model="nuevoCorreo" placeholder="Ingrese nuevo correo" class="mb-2" />
        <UButton @click="cambiarCorreo" :loading="cargando" class="w-full">Cambiar correo</UButton>
      </div>

      <!-- Cambiar contraseña -->
      <div>
        <UButton @click="solicitarCambioContrasena" :loading="cargando" class="w-full mt-4">
          Cambiar contraseña por correo
        </UButton>
      </div>

      <!-- Mensaje -->
      <p class="text-sm text-center text-gray-600 mt-4">{{ mensaje }}</p>

      <!-- Cerrar sesión -->
      <div class="text-center mt-4">
        <UButton @click="signOut" color="red" variant="solid">Cerrar sesión</UButton>
      </div>
    </div>
  </div>
</template>
