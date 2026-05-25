

# DN Teacher — Arquitetura do Projeto Full-Stack

> Guia completo para usar com Claude Code.  
> Copie seções inteiras e cole no Claude Code como prompt de contexto.

-----

## Stack Técnica — 100% Gratuita

|Camada  |Tecnologia                      |Custo    |
|--------|--------------------------------|---------|
|Frontend|React 18 + Vite + TypeScript    |Grátis   |
|Estilo  |TailwindCSS 3 + shadcn/ui       |Grátis   |
|Backend |Vercel Serverless Functions (TS)|Grátis   |
|ORM     |Prisma                          |Grátis   |
|Banco   |Neon — PostgreSQL Serverless    |Grátis   |
|Email   |Nodemailer + Gmail SMTP         |Grátis   |
|Deploy  |Vercel (frontend + backend)     |Grátis   |
|Domínio |dnteacher.dev (Registro.br)     |~R$50/ano|


> **Por que Neon?** PostgreSQL serverless gratuito (0,5 GB, sem hibernação, sem prazo de expiração). Crie em: neon.tech
> 
> **Por que Vercel para o backend?** A pasta `/api` do projeto vira automaticamente serverless functions — sem servidor separado, sem Render, sem hibernação, sem custo.

-----

## Estrutura de Pastas

```
dnteacher/                     # repositório único — tudo sobe para o Vercel
│
├── src/                       # React (frontend)
│   ├── components/
│   │   ├── ui/                # shadcn/ui
│   │   ├── Navbar.tsx
│   │   ├── Hero.tsx
│   │   ├── Services.tsx
│   │   ├── Niches.tsx
│   │   ├── Process.tsx
│   │   ├── Portfolio.tsx
│   │   ├── ContactForm.tsx
│   │   ├── Faq.tsx
│   │   └── Footer.tsx
│   ├── hooks/
│   │   └── useContact.ts
│   ├── lib/
│   │   └── api.ts
│   ├── types/
│   │   └── index.ts
│   ├── App.tsx
│   └── main.tsx
│
├── api/                       # Vercel Serverless Functions (backend)
│   ├── contact.ts             # POST /api/contact
│   └── health.ts              # GET /api/health
│
├── lib/                       # utilitários do backend
│   ├── prisma.ts              # Prisma Client singleton
│   └── email.ts               # Nodemailer
│
├── prisma/
│   └── schema.prisma
│
├── .env.example
├── vercel.json
├── tailwind.config.ts
├── vite.config.ts
└── package.json
```

> **Como funciona:** a pasta `/api` é processada automaticamente pelo Vercel como serverless functions. O React em `/src` é o site estático. Tudo num repositório, um único deploy.

-----

## Schema do Banco de Dados (Prisma)

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")   // necessário no Neon
}

model Contact {
  id        String   @id @default(cuid())
  name      String
  phone     String
  email     String?
  service   String
  message   String?
  status    Status   @default(PENDING)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("contacts")
}

enum Status {
  PENDING
  IN_PROGRESS
  CLOSED
}
```

-----

## API Routes

### POST /api/contact

Recebe o formulário, salva no Neon via Prisma e envia email.

**Request body:**

```json
{
  "name": "João Silva",
  "phone": "11999999999",
  "email": "joao@email.com",
  "service": "Landing Page",
  "message": "Preciso de um site para minha barbearia"
}
```

**Response 201:**

```json
{
  "success": true,
  "message": "Contato registrado com sucesso",
  "id": "clxyz123"
}
```

-----

## Variáveis de Ambiente

```env
# .env (local) — copie para variáveis de ambiente no Vercel também

# Neon PostgreSQL — pegar no painel em neon.tech
DATABASE_URL="postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require"
DIRECT_URL="postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require"

# Email (Gmail App Password)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="seu-email@gmail.com"
SMTP_PASS="xxxx xxxx xxxx xxxx"   # App Password de 16 dígitos
EMAIL_TO="davi@dnteacher.dev"

# Vercel (deixar vazio em produção — Vercel usa /api automaticamente)
VITE_API_URL=""
```

-----

## Prompts para o Claude Code

### Prompt 1 — Setup inicial

```
Crie um projeto full-stack chamado "dnteacher" com repositório único para deploy no Vercel.

ESTRUTURA:
- /src — React 18 + Vite + TypeScript (frontend)
- /api — Vercel Serverless Functions TypeScript (backend)
- /lib — utilitários compartilhados (Prisma client, email)
- /prisma — schema Prisma

DEPENDÊNCIAS:
Frontend: react, react-dom, vite, typescript, tailwindcss, axios
Backend/shared: @prisma/client, prisma, nodemailer, @types/nodemailer

CONFIG:
- tailwind.config.ts com tema dark (bg: #06080b, accent: #0ea5ff)
- vite.config.ts configurado para SPA
- vercel.json com rewrites { source: "/((?!api/).*)", destination: "/index.html" }
- tsconfig.json compatível com Vercel Functions
- .env.example com DATABASE_URL, DIRECT_URL, SMTP_*, EMAIL_TO, VITE_API_URL

DATABASE (Prisma):
- provider: postgresql (Neon)
- model Contact: id(cuid), name, phone, email?, service, message?, status(enum PENDING/IN_PROGRESS/CLOSED), createdAt, updatedAt
```

-----

### Prompt 2 — Backend (Serverless Functions)

```
No projeto dnteacher, crie os arquivos do backend:

1. lib/prisma.ts
   - Singleton do Prisma Client com padrão de hot-reload para desenvolvimento
   - Exporta { prisma }

2. lib/email.ts
   - Nodemailer transporter com Gmail SMTP usando variáveis de ambiente
   - Função sendContactEmail(data: ContactData): Promise<void>
   - Template HTML do email com os dados do contato formatados em português
   - Envia para process.env.EMAIL_TO

3. api/contact.ts (Vercel Serverless Function)
   - Aceita apenas método POST (retorna 405 para outros)
   - Valida campos obrigatórios: name, phone, service
   - Salva no banco com prisma.contact.create()
   - Chama sendContactEmail()
   - Retorna 201 { success: true, id }
   - Trata erros com try/catch e retorna 500 com mensagem amigável
   - Adiciona headers CORS para o domínio do frontend

4. api/health.ts
   - Retorna 200 { status: "ok", timestamp: new Date() }
```

-----

### Prompt 3 — Frontend completo

```
No projeto dnteacher/src, crie os componentes da landing page da DN Teacher:

Tema: dark (fundo #06080b), accent azul (#0ea5ff), fontes Syne (headings) + Instrument Sans (body) via Google Fonts

Componentes em src/components/:
1. Navbar.tsx — fixo com blur, logo "DN.Teacher" (ponto azul), menu com links âncora, botão WhatsApp
2. Hero.tsx — headline grande, subtítulo, 2 botões (WhatsApp primário + Ver projetos secundário), 3 stats com counter animado
3. Services.tsx — bento grid responsivo com 6 serviços: Landing Pages, Sistemas Web, Apps Mobile, Automação WhatsApp, Sites Institucionais, Suporte
4. Niches.tsx — 5 cards de nichos com emoji, nome e necessidades: Barbearia, Academia, Igreja, Restaurante, Autônomos
5. Process.tsx — 4 etapas: Diagnóstico → Proposta → Desenvolvimento → Entrega
6. Portfolio.tsx — 4 projetos demonstrativos: BarberPro, FitPanel, ChurchApp, MenuDigital
7. ContactForm.tsx — formulário completo (nome, telefone, email, select de serviço, textarea). Submit faz POST para /api/contact com axios. Exibe loading, sucesso e erro.
8. Faq.tsx — 6 perguntas em accordion
9. Footer.tsx — 4 colunas: marca + tagline, Serviços, Empresa, Contato

App.tsx deve renderizar todos os componentes em sequência com IDs para navegação.
Todos os textos em português brasileiro.
```

-----

### Prompt 4 — Hook de contato

```
Em dnteacher/src/hooks/useContact.ts, crie um custom hook React que:

- Interface ContactFormData: { name: string, phone: string, email?: string, service: string, message?: string }
- Estado: { loading, success, error }
- Função submit(data: ContactFormData): Promise<void>
  - Faz POST para /api/contact (URL relativa — funciona em dev e produção no Vercel)
  - Em sucesso: seta success=true, limpa após 5 segundos
  - Em erro: seta error com mensagem amigável em português

Em src/lib/api.ts:
- Instância axios com baseURL="" (relativa) e Content-Type: application/json
- Exporta como default

No componente ContactForm.tsx, use o hook e mostre:
- Botão com spinner quando loading
- Banner verde de sucesso quando success
- Banner vermelho com mensagem quando error
```

-----

### Prompt 5 — Deploy e README

```
Finalize o projeto dnteacher para deploy:

1. Verifique e corrija o vercel.json:
{
  "rewrites": [{ "source": "/((?!api/).*)", "destination": "/index.html" }]
}

2. Crie README.md completo em português com:
   a) Pré-requisitos (Node 18+, conta Vercel, conta Neon)
   b) Setup local passo a passo:
      - Clone, npm install
      - Criar banco no neon.tech (passo a passo)
      - Copiar .env.example para .env e preencher
      - npx prisma migrate dev --name init
      - npm run dev
   c) Como gerar Gmail App Password (passo a passo)
   d) Deploy no Vercel:
      - vercel login
      - vercel (segue o wizard)
      - Configurar variáveis de ambiente no painel Vercel
      - vercel --prod
   e) Como conectar domínio customizado (Registro.br -> Vercel)

3. Garanta que o package.json tenha estes scripts:
   - dev: vite
   - build: vite build
   - preview: vite preview
   - db:migrate: prisma migrate dev
   - db:studio: prisma studio
   - db:push: prisma db push
```

-----

## Como Criar o Banco no Neon (Passo a Passo)

1. Acesse **neon.tech** e crie conta gratuita (pode entrar com GitHub)
1. Clique em **“New Project”** e dê o nome `dnteacher`
1. Escolha a região mais próxima (US East se não tiver São Paulo)
1. Copie a **Connection String** no formato `postgresql://...`
1. Cole no `.env` como `DATABASE_URL` e também como `DIRECT_URL`
1. Rode `npx prisma migrate dev --name init` — as tabelas são criadas automaticamente

-----

## Checklist de Lançamento

- [ ] Substituir número WhatsApp real nos links `wa.me`
- [ ] Criar projeto no Neon e configurar DATABASE_URL
- [ ] Gerar Gmail App Password e configurar SMTP
- [ ] Rodar `npx prisma migrate dev` localmente
- [ ] Testar formulário localmente
- [ ] Deploy no Vercel (`vercel --prod`)
- [ ] Configurar variáveis de ambiente no painel Vercel
- [ ] Testar formulário em produção
- [ ] Registrar domínio no Registro.br e apontar para Vercel
- [ ] Testar responsividade no mobile
- [ ] Verificar velocidade no PageSpeed Insights

-----

## Ordem de Desenvolvimento

1. Setup do projeto → Prompt 1
1. Backend serverless → Prompt 2
1. Frontend completo → Prompt 3
1. Hook de integração → Prompt 4
1. Deploy → Prompt 5

**Tempo estimado com Claude Code:** 1 a 2 dias.
**Custo total de hospedagem:** R$ 0,00