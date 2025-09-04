//Do not touch without consultation

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://oyobfpumknigromvtxas.supabase.co";              //never ever share
const supabaseAnonKey = "sb_publishable_6uxNRG-jTrkoTl0P-6QPKg_WQ4gtA0G";   //never ever share 
export const supabase = createClient(supabaseUrl, supabaseAnonKey);