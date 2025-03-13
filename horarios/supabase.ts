import { createClient } from '@supabase/supabase-js'
const supabase_Url = 'https://kgwbhadfbdelnigprnju.supabase.co'
const supabase_Key ='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtnd2JoYWRmYmRlbG5pZ3Bybmp1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczODkwNTI1NiwiZXhwIjoyMDU0NDgxMjU2fQ.9RdLZAmB8srNO0YVnIlH01iHmYlsP4xVx3MWjcFTQsQ'

const supabase = createClient(supabase_Url, supabase_Key, {
    auth: {
        persistSession: true
    }
})

export default supabase