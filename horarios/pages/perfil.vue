<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '~/composables/auth'
import supabase from '~/supabase'

const { user, userName, signOut } = useAuth()

const nuevoCorreo = ref('')
const nuevoNombre = ref('') // <-- Nuevo nombre
const mensaje = ref('')
const cargando = ref(false)

// Cambiar correo (actualizando tanto en auth como en la tabla "usuarios")
const cambiarCorreo = async () => {
  if (!nuevoCorreo.value || !user.value?.id) return

  cargando.value = true

  // 1. Actualiza el correo en la parte de Auth de Supabase
  const { error: authError } = await supabase.auth.updateUser({ email: nuevoCorreo.value })
  if (authError) {
    mensaje.value = `Error al cambiar el correo en auth: ${authError.message}`
    cargando.value = false
    return
  }

  // 2. Actualiza el correo en la tabla pública "usuarios"
  const { error: dbError } = await supabase
    .from('usuarios')
    .update({ correo: nuevoCorreo.value })
    .eq('id', user.value.id)

  if (dbError) {
    mensaje.value = `Error al actualizar el correo en la tabla: ${dbError.message}`
  } else {
    mensaje.value = 'Correo actualizado correctamente en auth y en la tabla. Revisa tu nuevo correo para confirmar.'
    window.location.reload()
  }
  cargando.value = false
}

// Cambiar nombre
const cambiarNombre = async () => {
  if (!nuevoNombre.value || !user.value?.id) return

  cargando.value = true
  const { error } = await supabase
    .from('usuarios')
    .update({ nombre: nuevoNombre.value })
    .eq('id', user.value.id)

  if (error) {
    mensaje.value = `Error al cambiar el nombre: ${error.message}`
  } else {
    mensaje.value = 'Nombre actualizado correctamente.'
    window.location.reload()
  }

  cargando.value = false
}

// Enviar correo para cambiar contraseña
const solicitarCambioContrasena = async () => {
  if (!user.value?.email) return

  cargando.value = true
  const { error } = await supabase.auth.resetPasswordForEmail(user.value.email, {
    redirectTo: 'http://localhost:3000/recuperar',
  })

  if (error) {
    mensaje.value = `Error al enviar enlace de cambio de contraseña: ${error.message}`
  } else {
    mensaje.value = 'Correo enviado para cambiar la contraseña.'
  }
  cargando.value = false
}
</script>

<template>
  <div class="min-h-screen bg-gray-200 flex items-center justify-center">
    <div class="p-6 max-w-md mx-auto space-y-4 bg-white shadow-lg rounded-lg mt-8">
      <NuxtLink to="lobby">
        <UButton block class="w-full mt-2 mr-8 size-9" :ui="{ rounded: 'rounded-full' }">
          Atras
        </UButton>
      </NuxtLink>
      <h2 class="text-2xl font-bold text-center">Perfil del Usuario</h2>

      <p><strong>Nombre actual:</strong> {{ userName }}</p>
      <p><strong>Correo actual:</strong> {{ user?.email }}</p>

      <!-- Cambiar nombre -->
      <div>
        <label class="block font-semibold mb-1">Nuevo nombre</label>
        <UInput v-model="nuevoNombre" placeholder="Ingrese nuevo nombre" class="mb-2" />
        <UButton @click="cambiarNombre" :loading="cargando" class="w-full">
          Cambiar nombre
        </UButton>
      </div>

      <!-- Cambiar correo -->
      <div>
        <label class="block font-semibold mb-1 mt-4">Nuevo correo</label>
        <UInput v-model="nuevoCorreo" placeholder="Ingrese nuevo correo" class="mb-2" />
        <UButton @click="cambiarCorreo" :loading="cargando" class="w-full">
          Cambiar correo
        </UButton>
      </div>

      <!-- Cambiar contraseña -->
      <div>
        <UButton @click="solicitarCambioContrasena" :loading="cargando" class="w-full mt-4">
          Cambiar contraseña por correo
        </UButton>
      </div>

      <p class="text-sm text-center text-gray-600 mt-4">{{ mensaje }}</p>

      <div class="text-center mt-4">
        <UButton @click="signOut" color="red" variant="solid">
          Cerrar sesión
        </UButton>
      </div>
    </div>
  </div>
</template>
