import { createClient } from '@supabase/supabase-js'

const config = useRuntimeConfig()

export const supabase = createClient(
  config.public.supabaseUrl as string,
  config.public.supabaseKey as string
) 