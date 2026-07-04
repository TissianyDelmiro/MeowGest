import Link from "next/link";
import { listarGatosComStatus } from "@/lib/supabase/gatos";
import { CatCard } from "@/components/gatos/CatCard";
import type { GatoComStatus } from "@/lib/types/database";

export const dynamic = "force-dynamic";

export default async function GatosPage() {
  let gatos: GatoComStatus[] = [];
  let erroCarregamento = false;

  try {
    gatos = await listarGatosComStatus();
  } catch {
    gatos = [];
    erroCarregamento = true;
  }

  return (
    <main className="pb-24 max-w-md mx-auto">
      <div className="px-4 py-4">
        <div className="mb-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 bg-stone-100 px-2.5 py-1 rounded-full">
            {gatos.length} {gatos.length === 1 ? "gato" : "gatos"}
          </span>
        </div>

        {erroCarregamento && (
          <p role="alert" className="bg-red-50 text-red-700 rounded-xl p-4 mb-4">
            Não conseguimos carregar seus gatos agora. Verifique sua internet e tente
            novamente em alguns instantes.
          </p>
        )}

        {!erroCarregamento && gatos.length === 0 && (
          <div className="text-center py-16">
            <span className="text-6xl" aria-hidden="true">🐾</span>
            <h2 className="text-xl font-semibold mt-4">Nenhum gato cadastrado ainda</h2>
            <p className="text-stone-500 mt-1 max-w-xs mx-auto">
              Toque no botão abaixo para cadastrar o primeiro gato da sua colônia.
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          {gatos.map((gato) => (
            <CatCard key={gato.id} gato={gato} />
          ))}
        </div>
      </div>

      {/* Botão flutuante grande — ação mais importante da tela, fácil de alcançar no celular */}
      <Link
        href="/gatos/novo"
        className="fixed bottom-6 right-6 bg-terracota-500 hover:bg-terracota-600 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg text-3xl font-bold"
        aria-label="Adicionar novo gato"
      >
        +
      </Link>
    </main>
  );
}
