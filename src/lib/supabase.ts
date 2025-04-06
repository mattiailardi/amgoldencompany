
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

// Use the Supabase URL and Anon Key from the automatically generated client
const supabaseUrl = "https://ulrhljhdcgbzcifhcwzd.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVscmhsamhkY2diemNpZmhjd3pkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM5MDkxOTcsImV4cCI6MjA1OTQ4NTE5N30.3zP95giN8p4DQ1Qeq1qGqV7Ot4ovbI5pxxVB01sgN_c";

// Create Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Export a check function to verify if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return true; // Since we now have the correct values hardcoded
};
