"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Props = {
  catId: string;
  nomeGato: string;
  jaViuHoje: boolean;
};

export function CheckinButton({ catId, nomeGato, jaViuHoje }: Props) {
  const router = useRouter();
  const supabase = createClient();
  const [enviando, setEnviando] = useState(false);
  const [confirmado, setConfirmado] = useState(jaViuHoje);

  async function handleCheckin() {
    setEnviando(true);

    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        console.error("Usuário não autenticado");
        setEnviando(false);
        return;
      }

      const { error } = await supabase.from("checkins").insert({
        cat_id: catId,
        user_id: userData.user.id
      });

      if (!error) {
        setConfirmado(true);
        router.refresh();
      } else {
        console.error("Erro ao registrar checkin:", error);
      }
    } catch (err) {
      console.error("Erro no checkin:", err);
    } finally {
      setEnviando(false);
    }
  }

  if (confirmado) {
    return (
      <div
        role="status"
        className="w-full bg-salvia-400/15 text-salvia-600 font-semibold py-4 rounded-xl text-lg text-center flex items-center justify-center gap-2"
      >
        <span aria-hidden="true">✓</span> Visto hoje!
      </div>
    );
  }

  return (
    <button
      onClick={handleCheckin}
      disabled={enviando}
      className="w-full bg-salvia-500 hover:bg-salvia-600 disabled:opacity-60 text-white font-semibold py-4 rounded-xl text-lg"
    >
      {enviando ? "Registrando..." : `Vi o ${nomeGato} hoje`}
    </button>
  );
}
