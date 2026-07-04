-- ============================================================
-- MeowGest — Script de configuração do banco de dados Supabase
-- ============================================================
-- Como usar: vá em Supabase Dashboard > SQL Editor > New Query,
-- cole este script inteiro e clique em "Run".

-- Tabela de gatos
create table if not exists cats (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  photo_url text,
  approx_age text,
  sex text check (sex in ('macho', 'femea')),
  is_neutered boolean not null default false,
  health_notes text,
  last_vaccine_date date,
  created_at timestamptz not null default now()
);

-- Tabela de check-ins (um gato pode ter vários check-ins ao longo do tempo)
create table if not exists checkins (
  id uuid primary key default gen_random_uuid(),
  cat_id uuid not null references cats(id) on delete cascade,
  checked_at timestamptz not null default now()
);

-- Índices para acelerar as queries mais comuns
create index if not exists idx_cats_user_id on cats(user_id);
create index if not exists idx_checkins_cat_id on checkins(cat_id);
create index if not exists idx_checkins_checked_at on checkins(checked_at desc);

-- ============================================================
-- Row Level Security (RLS): cada protetor só vê e edita os
-- próprios gatos. Isso é o que garante a segurança multiusuário
-- mencionada nos critérios de avaliação do hackathon.
-- ============================================================

alter table cats enable row level security;
alter table checkins enable row level security;

-- Políticas para a tabela "cats"
create policy "Usuários veem apenas seus próprios gatos"
  on cats for select
  using (auth.uid() = user_id);

create policy "Usuários criam gatos para si mesmos"
  on cats for insert
  with check (auth.uid() = user_id);

create policy "Usuários atualizam apenas seus próprios gatos"
  on cats for update
  using (auth.uid() = user_id);

create policy "Usuários deletam apenas seus próprios gatos"
  on cats for delete
  using (auth.uid() = user_id);

-- Políticas para a tabela "checkins" (acesso controlado através do gato relacionado)
create policy "Usuários veem check-ins dos seus próprios gatos"
  on checkins for select
  using (
    exists (
      select 1 from cats
      where cats.id = checkins.cat_id
      and cats.user_id = auth.uid()
    )
  );

create policy "Usuários criam check-ins para seus próprios gatos"
  on checkins for insert
  with check (
    exists (
      select 1 from cats
      where cats.id = checkins.cat_id
      and cats.user_id = auth.uid()
    )
  );

-- ============================================================
-- Storage: bucket para fotos dos gatos
-- ============================================================
-- Depois de rodar este script, vá em Storage > Create bucket
-- e crie um bucket chamado "fotos-gatos" marcado como "Public bucket".
-- Isso é necessário porque a criação de buckets não pode ser feita
-- via SQL Editor, só pela interface ou API de Storage.
