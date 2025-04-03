import supabase from "~/supabase";
import { readBody } from 'h3'

interface AuthParams {
  email: string;
  password: string;
  nombre: string;
  telefono: string;
  claveRol?: string;
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(); // ✅ Obtener variables del runtime
  const CLAVE_SECRETA_ADMIN = config.CLAVE_SECRETA_ADMIN;

  const body = await readBody<AuthParams>(event); // ✅ Solo una vez
  console.log("CLAVE INGRESADA:", body.claveRol);
  console.log("CLAVE CORRECTA desde runtimeConfig:", CLAVE_SECRETA_ADMIN);

  if (body.claveRol && body.claveRol !== CLAVE_SECRETA_ADMIN) {
    throw createError({ statusCode: 403, message: "Clave de administrador incorrecta" });
  }

  const tipoUsuario = body.claveRol === CLAVE_SECRETA_ADMIN ? 'admin' : 'socio';
  console.log('Rol definido:', tipoUsuario);

  // Paso 1: Registro en Auth
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email: body.email,
    password: body.password,
  });

  if (signUpError) {
    console.error("Error en signUp:", signUpError.message);
    throw createError({ statusCode: 400, message: signUpError.message });
  }

  const userId = signUpData.user?.id;
  if (!userId) {
    throw createError({ statusCode: 400, message: "No se obtuvo el ID del usuario" });
  }

  // Paso 2: Insertar en tabla 'usuarios'
  const { error: insertError } = await supabase
    .from("usuarios")
    .insert({
      id: userId,
      nombre: body.nombre,
      correo: body.email,
      tipo_usuario: tipoUsuario
    });

  if (insertError) {
    console.error("Error en insert:", insertError.message);
    throw createError({ statusCode: 400, message: insertError.message });
  }

  return { success: true, tipo_usuario: tipoUsuario };
});
