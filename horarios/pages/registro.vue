<script setup>
import { ref } from 'vue'
import { useRouter } from '#app'
import { object, string } from 'yup'

const router = useRouter()
const nombre = ref('')
const correo = ref('')
const contraseña = ref('')
const telefono = ref('')
const tipo_usuario = ref('')
const mensaje = ref('')

// Definir el esquema de validación con Yup
const registroSchema = object({
  nombre: string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .required('El nombre es obligatorio'),
  correo: string()
    .email('Correo inválido')
    .required('El correo es obligatorio'),
  contraseña: string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .required('La contraseña es obligatoria'),
  telefono: string()
    .matches(/^[0-9]+$/, 'El teléfono debe contener solo números')
    .min(8, 'El teléfono debe tener al menos 8 dígitos')
    .required('El teléfono es obligatorio'),
  tipo_usuario: string() // Opcional o con validación condicional según tu lógica
})

async function usuarios() {
  try {
    // Prepara los datos a validar
    const formData = {
      nombre: nombre.value,
      correo: correo.value,
      contraseña: contraseña.value,
      telefono: telefono.value,
      tipo_usuario: tipo_usuario.value
    }
    
    // Valida el formulario (abortEarly: false para recoger todos los errores)
    await registroSchema.validate(formData, { abortEarly: false })
    
    // Si pasa la validación, procede a registrar el usuario
    await $fetch('/api/auth/register', {
      method: "POST",
      body: {
        nombre: nombre.value,
        password: contraseña.value,
        email: correo.value,
        telefono: telefono.value,
        claveRol: tipo_usuario.value
      }
    })

    mensaje.value = "Registro exitoso. Revisa tu correo para confirmar tu cuenta."
    setTimeout(() => {
      router.push('/')
    }, 3000)
    
  } catch (error) {
    // Si el error es de validación de Yup, muestra los errores
    console.error('Error registrando usuario:', error)
    mensaje.value = error.errors ? error.errors.join(', ') : "Ocurrió un error durante el registro."
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
