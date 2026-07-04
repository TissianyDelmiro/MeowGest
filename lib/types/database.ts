// Tipos das tabelas do Supabase — mantém o app inteiro tipado,
// sem usar "any" em nenhum lugar que toque dados do banco.

export type Gato = {
  id: string;
  user_id: string;
  name: string;
  photo_url: string | null;
  approx_age: string | null;
  sex: "macho" | "fêmea" | "desconhecido" | null;
  is_neutered: boolean;
  health_notes: string | null;
  last_vaccine_date: string | null; // formato YYYY-MM-DD
  created_at: string;
};

export type Checkin = {
  id: string;
  cat_id: string;
  checked_at: string; // timestamp ISO
};

// Tipo auxiliar usado na lista de gatos: junta o gato com informações
// derivadas (dias desde o último check-in, status de vacina) que a UI precisa.
export type GatoComStatus = Gato & {
  ultimo_checkin: string | null;
  dias_sem_checkin: number | null;
  vacina_vencida: boolean;
  vacina_proxima: boolean;
};

// Estrutura usada para criar/editar um gato a partir do formulário
export type GatoFormData = {
  name: string;
  approx_age: string;
  sex: "macho" | "fêmea" | "desconhecido" | "";
  is_neutered: boolean;
  health_notes: string;
  last_vaccine_date: string;
  photoFile: File | null;
};

// Tipagem do schema completo do Supabase, usada pelo client tipado
export type Database = {
  public: {
    Tables: {
      cats: {
        Row: Gato;
        Insert: Omit<Gato, "id" | "created_at" | "user_id"> & {
          user_id?: string;
        };
        Update: Partial<Omit<Gato, "id" | "created_at" | "user_id">>;
      };
      checkins: {
        Row: Checkin;
        Insert: Omit<Checkin, "id" | "checked_at"> & {
          checked_at?: string;
        };
        Update: Partial<Omit<Checkin, "id">>;
      };
    };
  };
};
