import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://oyobfpumknigromvtxas.supabase.co"; 
const supabaseAnonKey = "sb_publishable_6uxNRG-jTrkoTl0P-6QPKg_WQ4gtA0G"; 

export const supabase = createClient(supabaseUrl, supabaseAnonKey);