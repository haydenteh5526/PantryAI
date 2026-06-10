import { createClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

type Extra = {
  SUPABASE_URL?: string;
  SUPABASE_ANON_KEY?: string;
};
const extra = (Constants.expoConfig?.extra ?? {}) as Extra;

const supabaseUrl = extra.SUPABASE_URL ?? process.env.SUPABASE_URL ?? "";
const supabaseAnonKey =
  extra.SUPABASE_ANON_KEY ?? process.env.SUPABASE_ANON_KEY ?? "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
