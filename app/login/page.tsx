"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";


export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [modo, setModo] = useState<"entrar" | "cadastrar">("entrar");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [mensagem, setMensagem] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setMensagem(null);
    setCarregando(true);

    if (modo === "entrar") {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password: senha,
      });

      if (error) {
        setErro("E-mail ou senha incorretos. Tente novamente.");
        setCarregando(false);
        return;
      }

      router.push("/gatos");
      router.refresh();
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password: senha,
      });

      if (error) {
        setErro("Não foi possível criar sua conta. Verifique os dados e tente de novo.");
        setCarregando(false);
        return;
      }

      setMensagem("Conta criada! Verifique seu e-mail para confirmar antes de entrar.");
      setCarregando(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="relative w-full h-64 mx-auto">
            <Image
              src="/logocat.png"
              alt="Logo MeowGest"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        <div className="bg-white rounded-card shadow-sm p-6">
          <div className="flex gap-2 mb-6" role="tablist" aria-label="Escolher entre entrar ou cadastrar">
            <button
              type="button"
              role="tab"
              aria-selected={modo === "entrar"}
              onClick={() => setModo("entrar")}
              className={`flex-1 py-2 rounded-full font-medium transition-colors ${
                modo === "entrar"
                  ? "bg-terracota-500 text-white"
                  : "bg-creme-100 text-stone-600"
              }`}
            >
              Entrar
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={modo === "cadastrar"}
              onClick={() => setModo("cadastrar")}
              className={`flex-1 py-2 rounded-full font-medium transition-colors ${
                modo === "cadastrar"
                  ? "bg-terracota-500 text-white"
                  : "bg-creme-100 text-stone-600"
              }`}
            >
              Criar conta
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-1">
                E-mail
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-stone-300 focus-visible:border-terracota-500"
                placeholder="seuemail@exemplo.com"
              />
            </div>

            <div>
              <label htmlFor="senha" className="block text-sm font-medium text-stone-700 mb-1">
                Senha
              </label>
              <input
                id="senha"
                type="password"
                required
                minLength={6}
                autoComplete={modo === "entrar" ? "current-password" : "new-password"}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-stone-300 focus-visible:border-terracota-500"
                placeholder="Mínimo 6 caracteres"
              />
            </div>

            {erro && (
              <p role="alert" className="text-sm text-red-700 bg-red-50 rounded-lg px-3 py-2">
                {erro}
              </p>
            )}

            {mensagem && (
              <p role="status" className="text-sm text-salvia-600 bg-salvia-400/10 rounded-lg px-3 py-2">
                {mensagem}
              </p>
            )}

            <button
              type="submit"
              disabled={carregando}
              className="w-full bg-terracota-500 hover:bg-terracota-600 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              {carregando
                ? "Aguarde..."
                : modo === "entrar"
                  ? "Entrar"
                  : "Criar minha conta"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
