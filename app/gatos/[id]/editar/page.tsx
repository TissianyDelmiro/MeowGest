import Link from "next/link";
import { notFound } from "next/navigation";
import { buscarGatoPorId } from "@/lib/supabase/gatos";
import { CatForm } from "@/components/gatos/CatForm";

export const dynamic = "force-dynamic";

export default async function EditarGatoPage({ params }: { params: { id: string } }) {
  const gato = await buscarGatoPorId(params.id);

  if (!gato) {
    notFound();
  }

  return (
    <main className="min-h-screen px-4 py-6 max-w-md mx-auto">
      <Link
        href={`/gatos/${gato.id}`}
        className="inline-flex items-center gap-1 text-stone-500 hover:text-terracota-600 mb-4"
      >
        ← Voltar para o perfil de {gato.name}
      </Link>

      <h1 className="text-2xl mb-6">Editar {gato.name}</h1>

      <CatForm gatoExistente={gato} />
    </main>
  );
}
