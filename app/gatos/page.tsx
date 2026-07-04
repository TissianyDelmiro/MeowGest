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

  // Gerar lista de alertas dinâmicos
  const alertas: {
    gatoId: string;
    texto: string;
    tipo: "urgente" | "aviso";
  }[] = [];

  gatos.forEach((gato) => {
    // 1. Não visto há 2+ dias (Urgente)
    if (gato.dias_sem_checkin !== null && gato.dias_sem_checkin >= 2) {
      alertas.push({
        gatoId: gato.id,
        texto: `👀 ${gato.name} não é visto há ${gato.dias_sem_checkin} dias`,
        tipo: "urgente",
      });
    }

    // 2. Vacinas (Vencida ou Próxima)
    if (gato.last_vaccine_date) {
      const dataLimite = new Date(gato.last_vaccine_date);
      dataLimite.setFullYear(dataLimite.getFullYear() + 1);
      dataLimite.setHours(0, 0, 0, 0);

      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);

      const diffMs = dataLimite.getTime() - hoje.getTime();
      const diasParaVencer = Math.round(diffMs / (1000 * 60 * 60 * 24));

      if (diasParaVencer < 0) {
        alertas.push({
          gatoId: gato.id,
          texto: `⚠️ ${gato.name} está com a vacina vencida!`,
          tipo: "urgente",
        });
      } else if (diasParaVencer <= 30) {
        alertas.push({
          gatoId: gato.id,
          texto: `📅 A vacina de ${gato.name} vence em ${diasParaVencer} dias`,
          tipo: "aviso",
        });
      }
    }
  });

  // Ordenar alertas: urgentes primeiro
  alertas.sort((a, b) => {
    if (a.tipo === "urgente" && b.tipo === "aviso") return -1;
    if (a.tipo === "aviso" && b.tipo === "urgente") return 1;
    return 0;
  });

  return (
    <main className="pb-24 max-w-md mx-auto">
      <div className="px-4 py-4">
        {/* Painel de Alertas */}
        {alertas.length > 0 && (
          <div className="mb-6 space-y-2" role="region" aria-label="Alertas de saúde e check-in">
            {alertas.map((alerta, index) => (
              <Link
                key={index}
                href={`/gatos/${alerta.gatoId}`}
                className={`block p-4 rounded-card border shadow-sm transition-all hover:scale-[1.01] ${
                  alerta.tipo === "urgente"
                    ? "bg-red-50/90 border-red-200 text-red-900 hover:bg-red-100"
                    : "bg-amber-50/90 border-amber-200 text-amber-900 hover:bg-amber-100"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold leading-snug">{alerta.texto}</span>
                  <span className="text-xs font-bold shrink-0 opacity-80">Ver perfil →</span>
                </div>
              </Link>
            ))}
          </div>
        )}

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
