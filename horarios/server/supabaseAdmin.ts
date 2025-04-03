import { createClient } from '@supabase/supabase-js'

// Ingresa la URL de Supabase y la clave de servicio directamente
const SUPABASE_URL = 'https://kgwbhadfbdelnigprnju.supabase.co'
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtnd2JoYWRmYmRlbG5pZ3Bybmp1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczODkwNTI1NiwiZXhwIjoyMDU0NDgxMjU2fQ.9RdLZAmB8srNO0YVnIlH01iHmYlsP4xVx3MWjcFTQsQ'

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

export default supabaseAdmin
