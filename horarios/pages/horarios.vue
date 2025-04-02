<script setup>
import { ref, onMounted } from 'vue'
import supabase from '~/supabase'

const horarios = ref([])
const usuarioActual = ref(null)
const reservasUsuario = ref([])
const diaActual = new Date().toLocaleDateString('es-ES', { weekday: 'long' })
const diaCapitalizado = diaActual.charAt(0).toUpperCase() + diaActual.slice(1)


onMounted(async () => {
  const { data: { user } } = await supabase.auth.getUser()
  usuarioActual.value = user
  await obtenerHorarios()
  await obtenerReservasUsuario()
})

const obtenerHorarios = async () => {
  const { data, error } = await supabase
    .from('public_horarios')
    .select('*, public_clases(nombre)')
    .eq('dia', diaCapitalizado)

  if (error) {
    console.error('Error al obtener horarios del día:', error)
    return
  }

  horarios.value = data
}


const obtenerReservasUsuario = async () => {
  const fechaHoy = new Date().toISOString().slice(0, 10)

  const { data, error } = await supabase
    .from('public_reservas')
    .select('horario_id')
    .eq('usuario_id', usuarioActual.value.id)
    .eq('dia', fechaHoy)

  if (error) {
    console.error('Error al obtener reservas del usuario:', error)
    return
  }

  reservasUsuario.value = data.map(r => r.horario_id)
}


const agendar = async (index) => {
  const horario = horarios.value[index]
  const fechaHoy = new Date().toISOString().slice(0, 10)

  // 1. Verificar si ya existe una reserva para este usuario, horario y día
  const { data: reservasExistentes, error: errorCheck } = await supabase
    .from('public_reservas')
    .select('*')
    .eq('usuario_id', usuarioActual.value.id)
    .eq('horario_id', horario.id)
    .eq('dia', fechaHoy)

  if (errorCheck) {
    console.error('Error al verificar reservas existentes:', errorCheck)
    return
  }

  if (reservasExistentes.length > 0) {
    alert('Ya tienes una reserva para este horario.')
    return
  }

  // 2. Insertar si no hay reserva previa
  const { error } = await supabase.from('public_reservas').insert({
    usuario_id: usuarioActual.value.id,
    clase_id: horario.clase_id,
    horario_id: horario.id,
    estado: 'confirmada',
    dia: fechaHoy
  })

  if (error) {
    console.error('Error al reservar:', error)
  } else {
    alert('Reserva creada')
    await obtenerHorarios()
    await obtenerReservasUsuario()
  }
}


const desagendar = async (index) => {
  const horario = horarios.value[index]

  const { error } = await supabase
    .from('public_reservas')
    .delete()
    .eq('usuario_id', usuarioActual.value.id)
    .eq('horario_id', horario.id)
    .eq('dia', new Date().toISOString().slice(0, 10))

  if (error) {
    console.error('Error al cancelar reserva:', error)
  } else {
    alert('Reserva cancelada')
    await obtenerHorarios()
    await obtenerReservasUsuario()
  }
}
</script>

<template>
  <div class="flex items-center justify-end p-4 bg-gray-100 shadow-md mr-5">
    <ULink to="lobby">
      <UButton color="white" class="p-2 mr-2 mt-2 mb-2 text-black rounded-lg ml-right">
        <img
          src="\images\home.png"
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
            <h1 class="text-xl font-semibold mb-4">Bienvenido {{ userName || 'Usuario' }} </h1>
            <NuxtLink to="perfil">
              <UButton color="white" class=" text-black">
                <img src="/images/perfil.png" 
                    alt="Botón" class="w-6 h-6 inline-block mr-2" />
                Perfil Configuración
              </UButton>
            </NuxtLink>
            <UButton @click="signOut" class="mt-4">Cerrar sesión</UButton>
          </div>
        </template>
    </UPopover>
  </div>
  <div class="p-6 space-y-4">
    <div v-for="(horario, index) in horarios" :key="horario.id" class="p-4 border rounded shadow">
      <p><strong>Día:</strong> {{ horario.dia }}</p>
      <p><strong>Hora:</strong> {{ horario.hora }}</p>
      <p><strong>Entrenador:</strong> {{ horario.instructor }}</p>
      <p><strong>Clase:</strong> {{ horario.public_clases?.nombre }}</p>

      <UButton
      class="mt-2 mr-2"
      :disabled="reservasUsuario.includes(horario.id)"
      @click="agendar(index)">
      Agendar
    </UButton>

    <UButton
      v-if="reservasUsuario.includes(horario.id)"
      class="mt-2"
      @click="desagendar(index)">
      Desagendar
    </UButton>

    </div>
  </div>
</template>
