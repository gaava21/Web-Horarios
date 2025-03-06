<script setup lang="ts">
import { object, string, type InferType } from 'yup'
import type { FormSubmitEvent } from '#ui/types'
import supabase from '~/supabase'
import { navigateTo } from '#app'
definePageMeta({
})
const schema = object({
  email: string().email('Invalid email').required('Required'),
  password: string().min(8, 'Must be at least 8 characters').required('Required')
})

type Schema = InferType<typeof schema>

const state = reactive({
  email: '',
  password: ''
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
  console.log('Datos del formulario:', event.data)
  const { email, password } = event.data

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error('Error durante el inicio de sesión:', error)
      alert('Error durante el inicio de sesión: ' + error.message)
      return
    }

    console.log('Inicio de sesión exitoso:', data)
    navigateTo('/lobby')
  } catch (err) {
    console.error('Ocurrió un error inesperado:', err)
    alert('Ocurrió un error inesperado, intenta de nuevo.')
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
        <UButton block class="w-full" :ui="{ rounded: 'rounded-full' }">
          Iniciar
        </UButton>
      </UForm>
    </div>
  </div>
</template>