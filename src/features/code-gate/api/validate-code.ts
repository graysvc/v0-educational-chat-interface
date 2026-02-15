import { supabase } from "@/shared/api";
import { TABLES } from "@/shared/config";

export interface ValidateCodeResult {
  valid: boolean;
  error?: string;
}

export async function validateCode(code: string): Promise<ValidateCodeResult> {
  const { data, error } = await supabase
    .from(TABLES.CODES)
    .select("code")
    .eq("code", code.toUpperCase().trim())
    .maybeSingle();

  if (error) {
    return { valid: false, error: "Error al verificar el código. Intentá de nuevo." };
  }

  if (!data) {
    return { valid: false, error: "Código incorrecto. Revisá e intentá de nuevo." };
  }

  return { valid: true };
}
