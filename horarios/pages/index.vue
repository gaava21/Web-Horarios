<script setup lang="ts">
  import { object, string, type InferType } from 'yup'
  import type { FormSubmitEvent } from '#ui/types'

    const schema = object({
    email: string().email('Invalid email').required('Required'),
    password: string()
      .min(8, 'Must be at least 8 characters')
      .required('Required')
  })

  type Schema = InferType<typeof schema>

  const state = reactive({
    email: undefined,
    password: undefined
  })

  async function onSubmit(event: FormSubmitEvent<Schema>) {
    // Do something with event.data
    console.log(event.data)
  }
</script>

<template>
  <div class="flex">
    <UButton color="white" class="p-2 mr-2 mt-2 mb-2 text-black rounded-lg ml-auto">
      <img src="C:\Users\gerar\OneDrive - Universidad Técnica Nacional\Escritorio\Web-Horarios\horarios\images\perfil.png" 
          alt="Botón" class="w-6 h-6 inline-block mr-2" />
      Perfil
    </UButton>
  </div>
    

  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
      <UButton color="white" class=" text=black mr-60" :ui="{ rounded: 'rounded-full'}">Volver</UButton>
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

