import Link from "next/link";
import Image from "next/image";
import type { GatoComStatus } from "@/lib/types/database";

type Props = {
  gato: GatoComStatus;
};

function descricaoStatus(gato: GatoComStatus): {
  texto: string;
  cor: string;
  icone: string;
} {
  if (gato.dias_sem_checkin === null) {
    return { texto: "Ainda sem check-in", cor: "bg-stone-100 text-stone-600", icone: "○" };
  }
  if (gato.dias_sem_checkin === 0) {
    return { texto: "Visto hoje", cor: "bg-salvia-400/15 text-salvia-600", icone: "✓" };
  }
  if (gato.dias_sem_checkin === 1) {
    return { texto: "Visto ontem", cor: "bg-salvia-400/15 text-salvia-600", icone: "✓" };
  }
  return {
    texto: `Não visto há ${gato.dias_sem_checkin} dias`,
    cor: "bg-alerta-500/15 text-alerta-500",
    icone: "⚠",
  };
}

export function CatCard({ gato }: Props) {
  const status = descricaoStatus(gato);

  return (
    <Link
      href={`/gatos/${gato.id}`}
      className="block bg-white rounded-card shadow-sm overflow-hidden hover:shadow-md transition-shadow focus-visible:shadow-md"
    >
      <div className="relative aspect-square bg-creme-100">
        {gato.photo_url ? (
          <Image
            src={gato.photo_url}
            alt={`Foto de ${gato.name}`}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl" aria-hidden="true">
            🐱
          </div>
        )}

        {gato.vacina_vencida && (
          <span
            className="absolute top-2 right-2 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded-full"
            title="Vacina vencida"
          >
            💉 Vacina vencida
          </span>
        )}
        {!gato.vacina_vencida && gato.vacina_proxima && (
          <span
            className="absolute top-2 right-2 bg-alerta-500 text-white text-xs font-semibold px-2 py-1 rounded-full"
            title="Vacina próxima do vencimento"
          >
            💉 Vacina próxima
          </span>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold truncate">{gato.name}</h3>
        <span
          className={`inline-flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-full mt-2 ${status.cor}`}
        >
          <span aria-hidden="true">{status.icone}</span>
          {status.texto}
        </span>
      </div>
    </Link>
  );
}
