import supabase from "~/supabase";
import { H3Event } from "h3";
class AuthParams {
  constructor(email: string, password: string, nombre: string) {
    this.nombre = nombre;
    this.email = email;
    this.password = password;
  }
  public nombre: string;
  public email: string;
  public password: string;
}
export default defineEventHandler(async (event: H3Event) => {
  let body = await readBody<AuthParams>(event);
  const { data, error } = await supabase.auth.signUp({
    email: body.email,
    password: body.password,
  });
  if (error) throw error;
  return data;
});
