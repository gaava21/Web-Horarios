<script setup>
import { ref } from 'vue'
import { useRouter } from '#app'

const router = useRouter()
const nombre = ref('')
const correo = ref('')
const contraseña = ref('')
const telefono = ref('')
const tipo_usuario = ref('')
const mensaje = ref('')

async function usuarios() {
  try {
    const data = await $fetch('/api/auth/register', {
      method: "POST",
      body: {
        nombre: nombre.value,
        password: contraseña.value,
        email: correo.value,
        telefono: telefono.value,
        tipo_usuario: tipo_usuario.value
      }
    })

    mensaje.value = "Registro exitoso. Revisa tu correo para confirmar tu cuenta."

    // ✅ Esperar 3 segundos y redirigir al login
    setTimeout(() => {
      router.push('/')
    }, 3000)

  } catch (error) {
    console.error('Error registrando usuario:', error)
    mensaje.value = "Ocurrió un error durante el registro."
  }
}
</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
      <NuxtLink to="/">
        <UButton block class="w-full mt-2 mr-8 size-9" :ui="{ rounded: 'rounded-full' }">
          Atrás
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

        <p class="text-sm text-center mt-4" :class="mensaje.includes('exitoso') ? 'text-green-600' : 'text-red-600'">
          {{ mensaje }}
        </p>

        <NuxtLink to="/olvido">
          <UButton block class="w-full mt-2" :ui="{ rounded: 'rounded-full' }">
            Olvidé mi contraseña
          </UButton>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
