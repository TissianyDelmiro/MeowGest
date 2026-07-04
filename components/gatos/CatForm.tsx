"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Gato } from "@/lib/types/database";

type Props = {
  gatoExistente?: Gato;
};

export function CatForm({ gatoExistente }: Props) {
  const router = useRouter();
  const supabase = createClient();

  const [nome, setNome] = useState(gatoExistente?.name ?? "");
  const [idade, setIdade] = useState(gatoExistente?.approx_age ?? "");
  const [sexo, setSexo] = useState<"macho" | "fêmea" | "desconhecido" | "">(gatoExistente?.sex ?? "");
  const [castrado, setCastrado] = useState(gatoExistente?.is_neutered ?? false);
  const [saude, setSaude] = useState(gatoExistente?.health_notes ?? "");
  const [dataVacina, setDataVacina] = useState(gatoExistente?.last_vaccine_date ?? "");
  const [foto, setFoto] = useState<File | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);

    if (!nome.trim()) {
      setErro("Dá um nome pro gato antes de salvar :)");
      return;
    }

    setEnviando(true);

    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        setErro("Sua sessão expirou. Entre novamente.");
        setEnviando(false);
        return;
      }

      let photoUrl = gatoExistente?.photo_url ?? null;

      if (foto) {
        const caminhoArquivo = `${userData.user.id}/${Date.now()}-${foto.name}`;
        const { error: erroUpload } = await supabase.storage
          .from("cat-photos")
          .upload(caminhoArquivo, foto);

        if (erroUpload) {
          setErro("Não foi possível enviar a foto. Você pode salvar sem foto e tentar de novo depois.");
          setEnviando(false);
          return;
        }

        const { data: urlData } = supabase.storage
          .from("cat-photos")
          .getPublicUrl(caminhoArquivo);
        photoUrl = urlData.publicUrl;
      }

      const dadosGato = {
        name: nome.trim(),
        approx_age: idade.trim() || null,
        sex: (sexo || null) as "macho" | "fêmea" | "desconhecido" | null,
        is_neutered: castrado,
        health_notes: saude.trim() || null,
        last_vaccine_date: dataVacina || null,
        photo_url: photoUrl,
      };

      if (gatoExistente) {
        const { error } = await supabase
          .from("cats")
          .update(dadosGato)
          .eq("id", gatoExistente.id);

        if (error) throw error;
        router.push(`/gatos/${gatoExistente.id}`);
      } else {
        const { data, error } = await supabase
          .from("cats")
          .insert({ ...dadosGato, user_id: userData.user.id })
          .select()
          .single();

        if (error) {
          throw error;
        }
        router.push("/gatos");
      }

      router.refresh();
    } catch (err) {
      setErro("Algo deu errado ao salvar. Verifique sua internet e tente novamente.");
      setEnviando(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="nome" className="block text-sm font-medium text-stone-700 mb-1">
          Nome do gato *
        </label>
        <input
          id="nome"
          required
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-stone-300 focus-visible:border-terracota-500"
          placeholder="Ex: Mimosa"
        />
      </div>

      <div>
        <label htmlFor="foto" className="block text-sm font-medium text-stone-700 mb-1">
          Foto (opcional)
        </label>
        {gatoExistente?.photo_url && (
          <div className="mb-3 flex items-center gap-3 bg-stone-50 p-2 rounded-xl border border-stone-100">
            <img
              src={gatoExistente.photo_url}
              alt="Foto atual"
              className="w-16 h-16 object-cover rounded-lg shadow-sm"
            />
            <div>
              <p className="text-xs font-semibold text-stone-600">Foto cadastrada</p>
              <p className="text-xs text-stone-400">Escolha um novo arquivo apenas se quiser trocar</p>
            </div>
          </div>
        )}
        <input
          id="foto"
          type="file"
          accept="image/*"
          onChange={(e) => setFoto(e.target.files?.[0] ?? null)}
          className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-terracota-50 file:text-terracota-700 hover:file:bg-terracota-100"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="idade" className="block text-sm font-medium text-stone-700 mb-1">
            Idade aproximada
          </label>
          <input
            id="idade"
            value={idade}
            onChange={(e) => setIdade(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-stone-300 focus-visible:border-terracota-500"
            placeholder="Ex: 2 anos"
          />
        </div>

        <div>
          <label htmlFor="sexo" className="block text-sm font-medium text-stone-700 mb-1">
            Sexo
          </label>
          <select
            id="sexo"
            value={sexo}
            onChange={(e) => setSexo(e.target.value as "macho" | "fêmea" | "desconhecido" | "")}
            className="w-full px-4 py-3 rounded-xl border border-stone-300 focus-visible:border-terracota-500"
          >
            <option value="">Não sei / Desconhecido</option>
            <option value="macho">Macho</option>
            <option value="fêmea">Fêmea</option>
          </select>
        </div>
      </div>

      <fieldset className="flex items-center gap-2">
        <input
          id="castrado"
          type="checkbox"
          checked={castrado}
          onChange={(e) => setCastrado(e.target.checked)}
          className="w-5 h-5 rounded border-stone-300"
        />
        <label htmlFor="castrado" className="text-sm font-medium text-stone-700">
          Já é castrado
        </label>
      </fieldset>

      <div>
        <label htmlFor="vacina" className="block text-sm font-medium text-stone-700 mb-1">
          Data da última vacina
        </label>
        <input
          id="vacina"
          type="date"
          value={dataVacina}
          onChange={(e) => setDataVacina(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-stone-300 focus-visible:border-terracota-500"
        />
      </div>

      <div>
        <label htmlFor="saude" className="block text-sm font-medium text-stone-700 mb-1">
          Observações de saúde
        </label>
        <textarea
          id="saude"
          value={saude}
          onChange={(e) => setSaude(e.target.value)}
          rows={3}
          className="w-full px-4 py-3 rounded-xl border border-stone-300 focus-visible:border-terracota-500"
          placeholder="Ex: tosse leve há 2 dias, de olho"
        />
      </div>

      {erro && (
        <p role="alert" className="text-sm text-red-700 bg-red-50 rounded-lg px-3 py-2">
          {erro}
        </p>
      )}

      <div className="space-y-3">
        <button
          type="submit"
          disabled={enviando}
          className="w-full bg-terracota-500 hover:bg-terracota-600 disabled:opacity-60 text-white font-semibold py-4 rounded-xl text-lg transition-colors shadow-sm"
        >
          {enviando ? "Salvando..." : gatoExistente ? "Salvar alterações" : "Cadastrar gato"}
        </button>

        <button
          type="button"
          onClick={() => router.push("/gatos")}
          className="w-full bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold py-4 rounded-xl text-lg transition-colors"
        >
          Voltar para os meus gatos
        </button>
      </div>
    </form>
  );
}
