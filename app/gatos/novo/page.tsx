import Link from "next/link";
import { CatForm } from "@/components/gatos/CatForm";

export default function NovoGatoPage() {
  return (
    <main className="min-h-screen px-4 py-6 max-w-md mx-auto">
      <Link
        href="/gatos"
        className="inline-flex items-center gap-1 text-stone-500 hover:text-terracota-600 mb-4"
      >
        ← Voltar para os meus gatos
      </Link>

      <h1 className="text-2xl mb-1">Novo gato</h1>
      <p className="text-stone-500 mb-6">
        Preencha o que você souber — pode editar depois.
      </p>

      <CatForm />
    </main>
  );
}
