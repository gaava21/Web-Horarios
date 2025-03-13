<script setup lang="ts">
    import { object, string, type InferType } from 'yup'
    import type { FormSubmitEvent } from '#ui/types'
    import { UPopover } from '#components'
    import { useAuth } from '~/composables/auth'

    const schema = object({
    email: string().email('Invalid email').required('Required'),
    password: string()
      .min(8, 'Must be at least 8 characters')
      .required('Required')
  })
  
  const { user, userName, signOut } = useAuth()

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
  <div class="flex items-center justify-end p-4 bg-gray-100 shadow-md mr-5">
    <NuxtLink to="/horarios">
      <UButton color="white" class="p-2 mr-2 mt-2 mb-2 text-black rounded-lg ml-auto">
        <img src="C:\Users\gerar\OneDrive - Universidad Técnica Nacional\Escritorio\Web-Horarios\horarios\images\horarios.png" 
            alt="Botón" class="w-6 h-6 inline-block mr-2" />
        Horarios
      </UButton>
    </NuxtLink>
    <UButton color="white" class="p-2 mr-2 mt-2 mb-2 text-black rounded-lg ml-right">
      <img src="C:\Users\gerar\OneDrive - Universidad Técnica Nacional\Escritorio\Web-Horarios\horarios\images\home.png" 
          alt="Botón" class="w-6 h-6 inline-block mr-2" />
      Inicio
    </UButton>
    <UPopover>
      <UButton color="white" class="p-2 mr-2 mt-2 mb-2 w-10 text-black text-center rounded-lg">
      ... 
      </UButton>
      <template #panel>
        <div class="bg-white shadow-lg rounded-lg p-2 w-48 text-center">
          <h1 class="text-xl font-semibold mb-4">Bienvenido {{ userName || 'Usuario' }} </h1>
          <p v-if="user">Usuario: {{ userName || 'Usuario' }}</p>
          <UButton color="white" class=" text-black">
            <img src="C:\Users\gerar\OneDrive - Universidad Técnica Nacional\Escritorio\Web-Horarios\horarios\images\perfil.png" 
                alt="Botón" class="w-6 h-6 inline-block mr-2" />
            Perfil
          </UButton>
          <UButton class="mb-2 mt-2" color="gray" block>Configuración</UButton>
          <UButton @click="signOut" class="mt-4">Cerrar sesión</UButton>
        </div>
      </template>
    </UPopover>
  </div>
</template>

