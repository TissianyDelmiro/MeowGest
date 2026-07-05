# 🐾 MeowGest

> Simple management for those who care for many cats.

MeowGest is a web app built for the **#hackthekitty** hackathon — a themed competition for World Cat Domination Day. The app was born from real interviews with independent cat colony caretakers who had no tools to stay organized.

🔗 **Video Demo:** https://youtu.be/ZWuKWrecWpA

🔗 **Vercel:** https://meow-gest.vercel.app/login
    

---

## 🐱 The Problem

Independent caretakers managing 2 to 20+ cats face daily challenges:

- Missing vaccine and neutering dates
- Not knowing if a cat disappeared or is just hiding
- No documentation of rescued street cats' history
- Difficulty asking for help and donations on social media

This problem was validated through **real user interviews** with two independent caretakers:

| Profile | Situation | Biggest pain point |
|---|---|---|
| Independent caretaker (unemployed) | Rescues street cats, no fixed income | Difficulty buying food and medicine |
| Independent rescuer | Cares for 16 cats, has arranged adoptions | No rescue documentation; hard to find 24h vet; loses track of vaccine dates |

---

## ✅ The Solution

A simple, visual dashboard where the caretaker can:

1. **Register each cat** with photo, name, age, sex, neutering status and vaccine date
2. **Do a daily check-in** confirming the cat was seen
3. **Receive automatic alerts** for overdue vaccines, upcoming vaccines and cats not seen in 2+ days
4. **Generate a sharing card** to post on WhatsApp and Instagram asking for help

---

## 🖥️ Features

- 🔐 Email authentication (each caretaker sees only their own cats)
- 📋 Cat registration with photo upload
- ✅ Daily check-in with history log
- 🚨 Alert panel (overdue vaccine, upcoming vaccine, cat not seen)
- 📤 Shareable outreach card (WhatsApp, Instagram, download)
- 📱 Responsive, mobile-first interface

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 + React + TypeScript |
| Styling | Tailwind CSS |
| Database | Supabase (PostgreSQL) |
| Authentication | Supabase Auth |
| Storage (photos) | Supabase Storage |
| Deploy | Vercel |

---

## 🗄️ Database Structure

```sql
-- Cats registered by each caretaker
cats (id, user_id, name, photo_url, approx_age,
      sex, is_neutered, health_notes, last_vaccine_date)

-- Daily check-ins
checkins (id, cat_id, user_id, checked_at)
```

All tables have **Row Level Security (RLS)** enabled — each caretaker only accesses their own data.

---

## 🚀 Running locally

```bash
# 1. Clone the repository
git clone https://github.com/TissianyDelmiro/MeowGest.git
cd MeowGest/meowgest

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.local.example .env.local
# Fill in your Supabase keys

# 4. Run the project
npm run dev
```

Access `http://localhost:3000`

---

## 🔑 Environment variables

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-public-key
```

---

## 👩‍💻 Built by

**Tissiany Delmiro** — Frontend Developer
Solo project built in 14 days for the **#hackthekitty** hackathon (June/July 2026)

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Tissiany%20Delmiro-blue)](https://linkedin.com/in/tissiany-delmiro)
[![GitHub](https://img.shields.io/badge/GitHub-TissianyDelmiro-black)](https://github.com/TissianyDelmiro)

---

## 📄 License

MIT

# 🐾 MeowGest

> Gestão simples para quem cuida de muitos gatos.

MeowGest é um aplicativo web desenvolvido para o hackathon **#hackthekitty** — uma competição temática do World Cat Domination Day. O app nasceu de entrevistas reais com protetores independentes que cuidam de colônias de gatos e não tinham nenhuma ferramenta para se organizar.

🔗 **Demo:** _em breve_

---

## 🐱 O Problema

Protetores independentes que cuidam de 2 a 20+ gatos enfrentam desafios diários:

- Perdem datas de vacina e castração
- Não sabem se um gato sumiu ou só está escondido
- Não documentam o histórico de gatos resgatados da rua
- Têm dificuldade de pedir ajuda e doações nas redes sociais

Esse problema foi validado com **entrevistas reais** com dois protetores:

| Perfil | Situação | Maior dor |
|---|---|---|
| Protetor desempregado | Resgata gatos de rua, sem renda fixa | Dificuldade de comprar ração e remédio |
| Resgatadora independente | Cuida de 16 gatos, já deu vários para adoção | Não documenta resgates; dificuldade de achar vet 24h; perde datas de vacina |

---

## ✅ A Solução

Um painel simples e visual onde o protetor:

1. **Cadastra cada gato** com foto, nome, idade, sexo, castração e vacina
2. **Faz check-in diário** confirmando que viu o gato
3. **Recebe alertas** automáticos de vacina vencida, vacina próxima de vencer e gatos não vistos há 2+ dias
4. **Gera um card de divulgação** para compartilhar no WhatsApp e Instagram pedindo ajuda

---

## 🖥️ Funcionalidades

- 🔐 Autenticação por e-mail (cada protetor vê só seus próprios gatos)
- 📋 Cadastro de gatos com upload de foto
- ✅ Check-in diário com histórico
- 🚨 Painel de alertas (vacina vencida, próxima de vencer, gato não visto)
- 📤 Card de divulgação compartilhável (WhatsApp, Instagram, download)
- 📱 Interface responsiva e mobile-first

---

## 🛠️ Stack

| Camada | Tecnologia |
|---|---|
| Frontend | Next.js 14 + React + TypeScript |
| Estilo | Tailwind CSS |
| Banco de dados | Supabase (PostgreSQL) |
| Autenticação | Supabase Auth |
| Storage (fotos) | Supabase Storage |
| Deploy | Vercel |

---

## 🗄️ Estrutura do Banco

```sql
-- Gatos cadastrados por cada protetor
cats (id, user_id, name, photo_url, approx_age, 
      sex, is_neutered, health_notes, last_vaccine_date)

-- Check-ins diários
checkins (id, cat_id, user_id, checked_at)
```

Todas as tabelas têm **Row Level Security (RLS)** ativo — cada protetor acessa apenas seus próprios dados.

---

## 🚀 Como rodar localmente

```bash
# 1. Clone o repositório
git clone https://github.com/TissianyDelmiro/MeowGest.git
cd MeowGest/meowgest

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp .env.local.example .env.local
# Preencha com suas chaves do Supabase

# 4. Rode o projeto
npm run dev
```

Acesse `http://localhost:3000`

---

## 🔑 Variáveis de ambiente

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-publica
```

---

## 👩‍💻 Desenvolvido por

**Tissiany Delmiro** — Frontend Developer  
Projeto solo desenvolvido em 14 dias para o hackathon **#hackthekitty** (junho/julho 2026)

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Tissiany%20Delmiro-blue)](https://linkedin.com/in/tissiany-delmiro)
[![GitHub](https://img.shields.io/badge/GitHub-TissianyDelmiro-black)](https://github.com/TissianyDelmiro)

---

## 📄 Licença

MIT
