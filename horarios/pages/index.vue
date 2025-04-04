<script setup lang="ts">
import { object, string, type InferType } from 'yup'
import type { FormSubmitEvent } from '#ui/types'
import { useAuth } from '~/composables/auth'
import { ref, reactive, onMounted } from 'vue'

const { signIn } = useAuth()
const loading = ref(false)

const schema = object({
  email: string().email('Email inválido').required('Requerido'),
  password: string().min(8, 'Mínimo 8 caracteres').required('Requerido')
})

type Schema = InferType<typeof schema>

const state = reactive({
  email: '',
  password: ''
})

onMounted(() => {
  console.log('Componente index.vue montado')  // ✅
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
  console.log('Evento onSubmit disparado')  // ✅ Verificar si se dispara
  console.log('Datos del formulario:', event.data)
  const { email, password } = event.data
  loading.value = true

  try {
    await signIn(email, password)
  } catch (err) {
    console.error('Error durante el inicio de sesión:', err)
    alert('Correo o contraseña incorrectos.')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
      <h1 class="text-xl font-semibold mb-4">Inicio</h1>
      <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
        <UFormGroup label="Email" name="email">
          <UInput v-model="state.email" />
        </UFormGroup>
        <UFormGroup label="Password" name="password">
          <UInput v-model="state.password" type="password" />
        </UFormGroup>
        <UButton type="submit" pendingText="Iniciando sesión" block class="w-full" :ui="{ rounded: 'rounded-full' }">
          Iniciar
        </UButton>
        <NuxtLink to="/registro">
          <UButton block class="w-full mt-2" :ui="{ rounded: 'rounded-full' }">
            Registro
          </UButton>
        </NuxtLink>
      </UForm>
    </div>
  </div>
</template>
