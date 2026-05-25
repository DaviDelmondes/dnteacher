# DN Teacher

Landing page + backend full-stack para a DN Teacher. React 18 + Vite + TypeScript no frontend, Vercel Serverless Functions no backend, Neon (PostgreSQL) para dados e Gmail SMTP para notificações.

## Pré-requisitos

- Node.js 18+
- Conta gratuita no [Vercel](https://vercel.com)
- Conta gratuita no [Neon](https://neon.tech)
- Gmail com App Password ativado

## Setup local

```bash
# 1. Clone e instale dependências
git clone <repo-url> dnteacher
cd dnteacher
npm install

# 2. Copie as variáveis de ambiente
cp .env.example .env
# Edite .env com seus valores reais

# 3. Rode a migration do banco
npx prisma migrate dev --name init

# 4. Inicie o servidor de desenvolvimento
npm run dev
# Frontend em http://localhost:5173
# Para testar as APIs, use: vercel dev
```

## Criar banco no Neon

1. Acesse [neon.tech](https://neon.tech) e crie uma conta (pode usar GitHub)
2. Clique em **New Project** → nome: `dnteacher`
3. Escolha a região mais próxima
4. Copie a **Connection String** do painel
5. Cole no `.env` como `DATABASE_URL` e também como `DIRECT_URL`
6. Rode `npx prisma migrate dev --name init`

## Como gerar Gmail App Password

1. Acesse [myaccount.google.com](https://myaccount.google.com)
2. Segurança → Verificação em duas etapas (ative se não tiver)
3. Segurança → Senhas de app → Selecione "Outro" → digite "DN Teacher"
4. Copie a senha de 16 dígitos → cole em `SMTP_PASS` no `.env`

## Deploy no Vercel

```bash
# Instale o Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy (segue o wizard interativo)
vercel

# Configure as variáveis de ambiente no painel da Vercel:
# DATABASE_URL, DIRECT_URL, SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, EMAIL_TO

# Deploy em produção
vercel --prod
```

## Conectar domínio customizado (Registro.br → Vercel)

1. No painel da Vercel: Settings → Domains → Add domain → `dnteacher.dev`
2. A Vercel exibirá os nameservers
3. No painel do Registro.br: acesse seu domínio → DNS → altere os nameservers para os da Vercel
4. Aguarde propagação (até 48h)

## Scripts

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run preview` | Preview do build |
| `npm run db:migrate` | Roda migrations do Prisma |
| `npm run db:studio` | Abre Prisma Studio |
| `npm run db:push` | Push do schema sem migration |
