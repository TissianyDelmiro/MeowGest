import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

// Use este client dentro de Server Components, Server Actions e Route Handlers.
// Ele lê/escreve a sessão do usuário através dos cookies da requisição,
// o que é o que permite que o login persista entre navegações.
export function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch {
            // Chamado de um Server Component sem permissão de escrita —
            // é seguro ignorar aqui porque o middleware já cuida do refresh da sessão.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: "", ...options });
          } catch {
            // Mesmo caso do set() acima.
          }
        },
      },
    }
  );
}
