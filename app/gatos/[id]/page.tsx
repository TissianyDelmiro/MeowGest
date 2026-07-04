import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { buscarGatoPorId, buscarHistoricoCheckins } from "@/lib/supabase/gatos";
import { CheckinButton } from "@/components/gatos/CheckinButton";

export const dynamic = "force-dynamic";

function formatarData(data: string): string {
  return new Date(data).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function formatarDataHora(data: string): string {
  return new Date(data).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function PerfilGatoPage({ params }: { params: { id: string } }) {
  const gato = await buscarGatoPorId(params.id);

  if (!gato) {
    notFound();
  }

  const historico = await buscarHistoricoCheckins(params.id);
  const jaViuHoje = gato.dias_sem_checkin === 0;

  return (
    <main className="min-h-screen px-4 py-6 max-w-md mx-auto pb-12">
      <Link
        href="/gatos"
        className="inline-flex items-center gap-1 text-stone-500 hover:text-terracota-600 mb-4"
      >
        ← Voltar para os meus gatos
      </Link>

      <div className="relative aspect-square bg-creme-100 rounded-card overflow-hidden mb-4">
        {gato.photo_url ? (
          <Image
            src={gato.photo_url}
            alt={`Foto de ${gato.name}`}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-7xl" aria-hidden="true">
            🐱
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mb-2">
        <h1 className="text-3xl">{gato.name}</h1>
        <Link
          href={`/gatos/${gato.id}/editar`}
          className="text-sm font-medium text-terracota-600 hover:text-terracota-700 px-3 py-2"
        >
          Editar
        </Link>
      </div>

      {(gato.vacina_vencida || gato.vacina_proxima) && (
        <p
          role="alert"
          className={`rounded-lg px-3 py-2 text-sm font-medium mb-4 ${
            gato.vacina_vencida
              ? "bg-red-50 text-red-700"
              : "bg-alerta-500/15 text-alerta-500"
          }`}
        >
          💉 {gato.vacina_vencida ? "Vacina vencida!" : "Vacina próxima do vencimento"} —
          última dose em {gato.last_vaccine_date ? formatarData(gato.last_vaccine_date) : "data desconhecida"}
        </p>
      )}

      <div className="mb-6">
        <CheckinButton catId={gato.id} nomeGato={gato.name} jaViuHoje={jaViuHoje} />
      </div>

      <dl className="bg-white rounded-card p-4 space-y-3 mb-6">
        <div className="flex justify-between text-sm">
          <dt className="text-stone-500">Idade aproximada</dt>
          <dd className="font-medium">{gato.approx_age || "Não informado"}</dd>
        </div>
        <div className="flex justify-between text-sm">
          <dt className="text-stone-500">Sexo</dt>
          <dd className="font-medium">
            {gato.sex === "macho" ? "Macho" : gato.sex === "fêmea" ? "Fêmea" : "Não informado"}
          </dd>
        </div>
        <div className="flex justify-between text-sm">
          <dt className="text-stone-500">Castrado</dt>
          <dd className="font-medium">{gato.is_neutered ? "Sim" : "Não"}</dd>
        </div>
        {gato.health_notes && (
          <div className="text-sm pt-2 border-t border-stone-100">
            <dt className="text-stone-500 mb-1">Observações de saúde</dt>
            <dd className="font-medium">{gato.health_notes}</dd>
          </div>
        )}
      </dl>

      <section aria-labelledby="historico-titulo">
        <h2 id="historico-titulo" className="text-lg font-semibold mb-3">
          Histórico de check-ins
        </h2>

        {historico.length === 0 ? (
          <p className="text-stone-500 text-sm">Nenhum check-in registrado ainda.</p>
        ) : (
          <ul className="space-y-2">
            {historico.map((checkin) => (
              <li
                key={checkin.id}
                className="bg-white rounded-lg px-3 py-2 text-sm flex items-center gap-2"
              >
                <span aria-hidden="true" className="text-salvia-500">✓</span>
                {formatarDataHora(checkin.checked_at)}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
