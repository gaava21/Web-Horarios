import supabase from "~/supabase";
import { H3Event } from "h3";

interface AuthParams {
  email: string;
  password: string;
  nombre: string;
  telefono: string;
}

export default defineEventHandler(async (event: H3Event) => {
  const body = await readBody<AuthParams>(event);

  // Paso 1: Registrar al usuario en Auth
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email: body.email,
    password: body.password,
  });

  if (signUpError) {
    throw createError({ statusCode: 400, message: signUpError.message });
  }

  // Obtenemos el ID del usuario creado
  const userId = signUpData.user?.id;
  if (!userId) {
    throw createError({ statusCode: 400, message: "No se obtuvo el ID del usuario" });
  }

  // Paso 2: Insertar los datos adicionales en la tabla "usuarios"
  const { data: insertData, error: insertError } = await supabase
    .from("usuarios")
    .insert({
      id: userId,           // Usamos el mismo ID que el de Auth para relacionar ambas fuentes
      nombre: body.nombre,  // Nombre personalizado
      correo: body.email,   // Correo del usuario
      tipo_usuario: "socio" // O el valor que corresponda según tu lógica
    });

  if (insertError) {
    throw createError({ statusCode: 400, message: insertError.message });
  }

  return { signUpData, insertData };
});
