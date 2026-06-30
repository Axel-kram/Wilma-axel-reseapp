import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    'Saknar Supabase-konfiguration. Kontrollera att VITE_SUPABASE_URL och VITE_SUPABASE_ANON_KEY är satta (se README.md steg 5).'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
