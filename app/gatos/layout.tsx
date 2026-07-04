import Link from "next/link";
import { SignOutButton } from "@/components/gatos/SignOutButton";

export default function GatosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[url('/imagemfundo.png')] bg-cover bg-center bg-fixed">
      <header className="bg-white/90 backdrop-blur-sm border-b border-stone-100 px-4 py-4 flex items-center justify-between sticky top-0 z-50 max-w-md mx-auto w-full">
        <Link
          href="/gatos"
          className="text-2xl font-bold text-stone-800 hover:text-terracota-600 transition-colors flex items-center gap-2"
        >
          🐾 MeowGest
        </Link>
        <SignOutButton />
      </header>
      {children}
    </div>
  );
}
