# O Elo AI

Landing page e MVP inicial do **O Elo AI**: uma comunidade/experiência sobre criação consciente entre humanos e inteligência artificial.

## O que existe agora

- Landing page bilíngue PT/EN.
- Manifesto curto do projeto.
- Experiência **O Primeiro Pacto**.
- **Oráculo do Elo** com API serverless: usa OpenAI quando `OPENAI_API_KEY` existe e fallback local quando não existe.
- Captura de emails via API serverless com campos de email, idioma, origem, data e consentimento.
- Persistência opcional em Supabase via REST.
- CI com lint e build.

## Como rodar

```bash
npm install
npm run dev
```

Acesse `http://localhost:5173`.

## Checks

```bash
npm run lint
npm run build
```

## Variáveis de ambiente opcionais

### Oráculo com IA

```bash
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4.1-mini
```

Sem `OPENAI_API_KEY`, o oráculo responde com fallback temático local.

### Captura real com Supabase

Crie uma tabela `subscribers` com colunas compatíveis:

- `email` text
- `language` text
- `source` text
- `consent` boolean
- `created_at` timestamptz

Depois configure:

```bash
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=...
SUPABASE_SUBSCRIBERS_TABLE=subscribers
```

Sem Supabase, a API aceita o cadastro e registra no log do servidor.

## Deploy recomendado

Use Vercel, porque o projeto já inclui funções em `api/`.

1. Conecte o repositório na Vercel.
2. Configure as variáveis de ambiente desejadas.
3. Use o build padrão do Vite: `npm run build`.
4. Publique e aponte o domínio.

## Próximos passos

1. Criar domínio público.
2. Adicionar imagem Open Graph própria.
3. Criar jornada expandida do Pacto.
4. Ligar a newsletter/comunidade.
5. Medir origem, conversão e perguntas feitas ao Oráculo.
