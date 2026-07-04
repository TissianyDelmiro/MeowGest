import { createClient } from "@/lib/supabase/server";
import type { GatoComStatus, Checkin } from "@/lib/types/database";

const DIAS_PARA_VACINA_PROXIMA = 14;

function calcularDiasSemCheckin(ultimoCheckin: string | null): number | null {
  if (!ultimoCheckin) return null;
  const hoje = new Date();
  const dataCheckin = new Date(ultimoCheckin);
  hoje.setHours(0, 0, 0, 0);
  dataCheckin.setHours(0, 0, 0, 0);
  const diffMs = hoje.getTime() - dataCheckin.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

function calcularStatusVacina(dataVacina: string | null): {
  vencida: boolean;
  proxima: boolean;
} {
  if (!dataVacina) return { vencida: false, proxima: false };

  // Convenção do MVP: vacina considerada válida por 1 ano a partir da data registrada.
  const dataLimite = new Date(dataVacina);
  dataLimite.setFullYear(dataLimite.getFullYear() + 1);

  const diasParaVencer = Math.floor(
    (dataLimite.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  return {
    vencida: diasParaVencer < 0,
    proxima: diasParaVencer >= 0 && diasParaVencer <= DIAS_PARA_VACINA_PROXIMA,
  };
}

export async function listarGatosComStatus(): Promise<GatoComStatus[]> {
  const supabase = createClient();

  const { data: gatos, error: erroGatos } = await supabase
    .from("cats")
    .select("*")
    .order("name");

  if (erroGatos || !gatos) {
    throw new Error("Não foi possível carregar a lista de gatos.");
  }

  // Busca o check-in mais recente de cada gato numa única query,
  // depois junta no código — mais simples e rápido de implementar
  // certo num MVP do que tentar fazer isso tudo numa query SQL complexa.
  const { data: checkins } = await supabase
    .from("checkins")
    .select("cat_id, checked_at")
    .order("checked_at", { ascending: false });

  const ultimoCheckinPorGato = new Map<string, string>();
  for (const checkin of checkins ?? []) {
    if (!ultimoCheckinPorGato.has(checkin.cat_id)) {
      ultimoCheckinPorGato.set(checkin.cat_id, checkin.checked_at);
    }
  }

  return gatos.map((gato) => {
    const ultimoCheckin = ultimoCheckinPorGato.get(gato.id) ?? null;
    const statusVacina = calcularStatusVacina(gato.last_vaccine_date);

    return {
      ...gato,
      ultimo_checkin: ultimoCheckin,
      dias_sem_checkin: calcularDiasSemCheckin(ultimoCheckin),
      vacina_vencida: statusVacina.vencida,
      vacina_proxima: statusVacina.proxima,
    };
  });
}

export async function buscarGatoPorId(id: string): Promise<GatoComStatus | null> {
  const todosGatos = await listarGatosComStatus();
  return todosGatos.find((gato) => gato.id === id) ?? null;
}

export async function buscarHistoricoCheckins(catId: string): Promise<Checkin[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("checkins")
    .select("*")
    .eq("cat_id", catId)
    .order("checked_at", { ascending: false })
    .limit(30);

  if (error) {
    throw new Error("Não foi possível carregar o histórico de check-ins.");
  }

  return data ?? [];
}
