<script setup>
import { UButton } from '#components';
import { ref } from 'vue'

// Definir horarios con cupos y entrenadores
const horarios = ref([
  { hora: '05:00 AM', cuposMax: 12, cuposReservados: 0, entrenador: 'Andrés' },
  { hora: '06:00 AM', cuposMax: 12, cuposReservados: 0, entrenador: 'Andrés' },
  { hora: '07:00 AM', cuposMax: 12, cuposReservados: 0, entrenador: 'Andrés' },
  { hora: '08:00 AM', cuposMax: 12, cuposReservados: 0, entrenador: 'Andrés' },
  { hora: '09:00 AM', cuposMax: 12, cuposReservados: 0, entrenador: 'Andrés' },
  { hora: '10:00 AM', cuposMax: 12, cuposReservados: 0, entrenador: 'Andrés' },
  { hora: '03:00 PM', cuposMax: 12, cuposReservados: 0, entrenador: 'Andrés' },
  { hora: '04:00 PM', cuposMax: 12, cuposReservados: 0, entrenador: 'Andrés' },
  { hora: '05:00 PM', cuposMax: 12, cuposReservados: 0, entrenador: 'Andrés' },
  { hora: '06:00 PM', cuposMax: 12, cuposReservados: 0, entrenador: 'Andrés' },
  { hora: '07:00 PM', cuposMax: 12, cuposReservados: 0, entrenador: 'Andrés' },
  { hora: '08:00 PM', cuposMax: 12, cuposReservados: 0, entrenador: 'Andrés' }
])

// Función para agendar (sumar una reserva)
const agendar = (index) => {
  if (horarios.value[index].cuposReservados < horarios.value[index].cuposMax) {
    horarios.value[index].cuposReservados++
  }
}

// Función para desagendar (liberar una reserva)
const desagendar = (index) => {
  if (horarios.value[index].cuposReservados > 0) {
    horarios.value[index].cuposReservados--
  }
}
</script>

<template>
  <div class="flex items-center justify-end p-4 bg-gray-100 shadow-md mr-5">
    <ULink to="lobby">
      <UButton color="white" class="p-2 mr-2 mt-2 mb-2 text-black rounded-lg ml-right">
        <img
          src="C:\Users\gerar\OneDrive - Universidad Técnica Nacional\Escritorio\Web-Horarios\horarios\images\home.png"
          alt="Botón" class="w-6 h-6 inline-block mr-2" />
        Inicio
      </UButton>
    </ULink>
    <UPopover>
      <UButton color="white" class="p-2 mr-2 mt-2 mb-2 w-10 text-black text-center rounded-lg">
        ...
      </UButton>
      <template #panel>
        <div class="bg-white shadow-lg rounded-lg p-2 w-48 text-center">
          <UButton color="white" class=" text-black">
            <img
              src="C:\Users\gerar\OneDrive - Universidad Técnica Nacional\Escritorio\Web-Horarios\horarios\images\perfil.png"
              alt="Botón" class="w-6 h-6 inline-block mr-2" />
            Perfil
          </UButton>
          <UButton class="mb-2 mt-2" color="gray" block>Configuración</UButton>
          <UButton color="gray" block>Cerrar sesión</UButton>
        </div>
      </template>
    </UPopover>
  </div>
  <div class="flex flex-col items-center min-h-screen bg-gray-100 p-6 space-y-6">
    <h1 class="text-2xl font-semibold mb-4">Reservas de Horarios </h1>
    <div>
      <ULink to="horarios">
        <UButton class="mr-2">
          1
        </UButton>
      </ULink> 
      <ULink to="manana">
        <UButton>
          2
        </UButton>
      </ULink> 
    </div>
    <!-- Tarjetas de horarios -->
    <div v-for="(horario, index) in horarios" :key="horario.hora" class="bg-white p-6 rounded-lg shadow-md border w-96">
      <div class="flex justify-between items-center">
        <h2 class="text-lg font-semibold">Clase de las {{ horario.hora }}</h2>
        <p class="text-md font-semibold">Cupos: {{ horario.cuposMax - horario.cuposReservados }}</p>
      </div>

      <p class="text-gray-600 mt-2">Entrenador: <span class="font-semibold">{{ horario.entrenador }}</span></p>

      <!-- Botones Agendar/Desagendar -->
      <div class="flex flex-col items-end mt-4">
        <UButton class="px-4 py-2 mb-2 border rounded-full text-black"
          :disabled="horario.cuposReservados >= horario.cuposMax" @click="agendar(index)">
          Agendar
        </UButton>
        <UButton class="px-4 py-2 border rounded-full text-black" :disabled="horario.cuposReservados === 0"
          @click="desagendar(index)">
          Desagendar
        </UButton>
      </div>
    </div>
  </div>
</template>
