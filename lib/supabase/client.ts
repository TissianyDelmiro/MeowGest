import { createBrowserClient } from "@supabase/ssr";

// Use este client dentro de Client Components (arquivos com "use client").
// Cada chamada cria uma instância nova e leve — o SDK do Supabase
// já gerencia a sessão via cookies por baixo dos panos.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
