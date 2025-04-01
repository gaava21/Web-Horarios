import { ref, onMounted } from "vue";
import supabase from "~/supabase";
import { useRouter } from "#app";
import type { AuthUser } from "@supabase/supabase-js";
//
// ✅ Define el tipo explícito para los usuarios
type Usuario = {
  id: string;
  correo: string;
  nombre: string;
};

const user = ref<AuthUser | null>(null);
const userName = ref<string | null>("Usuario"); // ✅ Variable para el nombre del usuario

export function useAuth() {
  const router = useRouter();

  // ✅ Función para iniciar sesión
  const signIn = async (email: string, password: string) => {
    console.log("Intentando iniciar sesión...");
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (error.message === "Email not confirmed") {
        // ✅ Reenvía el correo de confirmación
        const { error: resendError } = await supabase.auth.resend({
          email,
          type: "signup", // ✅ Especifica el tipo como 'signup' para confirmar registro
        });
        if (resendError) {
          console.error(
            "Error al reenviar correo de confirmación:",
            resendError.message
          );
        } else {
          alert(
            "Correo de confirmación reenviado. Por favor verifica tu correo."
          );
        }
        return;
      } else {
        console.error("Error en el inicio de sesión:", error.message);
        alert("Error durante el inicio de sesión: " + error.message);
        throw error;
      }
    }

    if (data.user) {
      // ✅ Caso donde el correo SÍ está confirmado
      console.log("Inicio de sesión exitoso:", data.user);
      user.value = data.user;
      await fetchUserName(data.user.id); // ✅ Obtener el nombre del usuario
      router.push("/lobby"); // ✅ Redirigir al lobby
    }
  };

  // ✅ Función para obtener el nombre del usuario
  const fetchUserName = async (userId: string) => {
    try {
      console.log("Obteniendo nombre para el usuario ID:", userId);  // ✅ Para depurar
      const data = await $fetch('/api/auth/obtener_usuarios_auth');  // ✅ Usa el mismo método que tabla.vue
      console.log("Datos obtenidos de la API:", data);  // ✅ Verifica lo que devuelve la API

      const usuario = data.find((u: any) => u && u.id === userId);  // ✅ Encuentra el usuario por ID
      console.log("Usuario encontrado:", usuario);  // ✅ Verifica el usuario encontrado

      userName.value = (usuario as Usuario)?.nombre || "Usuario";  // ✅ Forzar el tipo a Usuario
      console.log("Nombre establecido en userName.value:", userName.value);  // ✅ Para depurar
    } catch (error) {
      console.error("Error al obtener el nombre:", error);
    }
  };

  // ✅ Función para mantener la sesión activa
  const checkSession = async () => {
    const { data } = await supabase.auth.getSession();
    user.value = data?.session?.user || null;
    if (user.value) {
      await fetchUserName(user.value.id);  // ✅ Obtener nombre si hay sesión activa
    }
  };

  // ✅ Función para cerrar sesión
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error al cerrar sesión:", error.message);
      throw error;
    }
    user.value = null;
    userName.value = "Usuario"; // ✅ Limpiar nombre al cerrar sesión
    router.push("/");
  };

  // ✅ Comprobar la sesión al cargar la app
  onMounted(() => {
    checkSession();
    supabase.auth.onAuthStateChange((_event, session) => {
      user.value = session?.user || null;
      if (user.value) {
        fetchUserName(user.value.id);
      }
    });
  });

  return { user, userName, signIn, signOut, checkSession };
}
