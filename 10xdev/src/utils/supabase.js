import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://oikliouytasziovopiec.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9pa2xpb3V5dGFzemlvdm9waWVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ0ODc2MzUsImV4cCI6MjA2MDA2MzYzNX0.VWjPmwlCY7_BTFrYRmCnzxUx0B6uNMI1X7ZQmjQEbjo'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
