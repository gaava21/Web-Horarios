import supabase from "~/supabase";
export default defineEventHandler(async (event) => {
    const { data } = await supabase.from('usuarios').select();
    return data;
});