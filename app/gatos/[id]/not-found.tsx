import Link from "next/link";

export default function GatoNaoEncontrado() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 text-center">
      <div>
        <span className="text-6xl" aria-hidden="true">🐱‍👤</span>
        <h1 className="text-2xl mt-4">Gato não encontrado</h1>
        <p className="text-stone-500 mt-1 mb-6">
          Esse gato não existe ou foi removido.
        </p>
        <Link
          href="/gatos"
          className="inline-block bg-terracota-500 hover:bg-terracota-600 text-white font-semibold px-6 py-3 rounded-xl"
        >
          Voltar para a lista
        </Link>
      </div>
    </main>
  );
}
