import { createClient } from '@supabase/supabase-js'
import type { Database } from './supabase'

const url = process.env.SUPABASE_URL!
const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY!

export default createClient<Database>(url, publishableKey)
