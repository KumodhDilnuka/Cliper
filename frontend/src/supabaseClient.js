// import {createClient} from '@supabase/supabase-js';

// const supabaseUrl = import.meta.env.VITE_SUPERBASE_URL;
// const supabaseAnonKey = import.meta.env.VITE_SUPERBASE_ANON_KEY;

// export const superbase = createClient(supabaseUrl, supabaseAnonKey)

// console.log("Supabase URL:", import.meta.env.VITE_SUPERBASE_URL ? "Detected✔️" : "Not Detected❌");

//Nadija's one--->
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
