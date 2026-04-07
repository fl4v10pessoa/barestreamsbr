# Vercel Configuration Verification

Este arquivo documenta as mudanças feitas para suportar Vercel.

## ✅ Mudanças Implementadas

### 1. Estrutura Serverless
- [x] Criado `src/init.ts` - Módulo de inicialização compartilhado
- [x] Criado `api/handler.ts` - Handler para Vercel Functions
- [x] Refatorado `src/index.ts` - Suporte a porta via ENV

### 2. Configuração Vercel
- [x] `vercel.json` - Config de build e deployment
- [x] `.vercelignore` - Arquivos excluídos do upload
- [x] `DEPLOYMENT_VERCEL.md` - Guia detalhado

### 3. TypeScript
- [x] Atualizado `tsconfig.json` - Inclui `api/` no build
- [x] Adicionado `@vercel/node` no package.json

### 4. Variáveis de Ambiente
- [x] `.env.local` - Template com variáveis necessárias

## 📦 Instalação de Dependências

```bash
npm install
```

Novo package @vercel/node será instalado.

## 🧪 Teste Local

### Com Vercel CLI
```bash
npm install -g vercel
vercel dev
```

Acesse:
- Manifest: http://localhost:3000/manifest.json
- Stream: http://localhost:3000/stream/movie/tt1234567.json

### Com Node tradicional
```bash
npm run build
npm start
```

## 🚀 Deploy

### GitHub + Vercel Dashboard
1. Faça push do código
2. Acesse vercel.com/dashboard
3. Conecte seu repositório
4. Configure variáveis de ambiente
5. Deploy automático!

### Vercel CLI
```bash
vercel
# ou para produção:
vercel --prod
```

## ⚙️ Configurações Críticas

### `vercel.json`
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "api",
  "functions": {
    "api/**/*.ts": {
      "maxDuration": 30
    }
  }
}
```

- `maxDuration: 30` - Timeout de 30 segundos (máximo no free tier)
- `outputDirectory: "api"` - Vercel procura handlers em /api

### `tsconfig.json`
- `rootDir: "."` - Permite compilar ambos src/ e api/
- `outDir: "dist"` - Compilado para dist/

### `package.json`
```json
{
  "start": "node dist/src/index.js",
  "dependencies": {
    "@vercel/node": "^3.0.0"
  }
}
```

## 🔗 Estrutura Final

```
barestreamsbr-main/
├── src/
│   ├── index.ts          (lê PORT da ENV)
│   ├── init.ts           (NEW - inicialização compartilhada)
│   └── ... (resto dos módulos)
├── api/
│   └── handler.ts        (NEW - Vercel Function)
├── dist/
│   ├── src/
│   │   ├── index.js
│   │   ├── init.js
│   │   └── ...
│   └── api/
│       └── handler.js
├── vercel.json           (NEW)
├── .vercelignore         (NEW)
├── DEPLOYMENT_VERCEL.md  (NEW)
└── ... (resto)
```

## 🛠️ Build Process

1. `npm run build` compila TypeScript
   - `src/**/*.ts` → `dist/src/**/*.js`
   - `api/**/*.ts` → `dist/api/**/*.js`

2. Vercel detecta `/api` em `vercel.json`
3. Cria Vercel Functions a partir dos handlers
4. Deploy realizado

## ✨ Funcionalidades

| Feature | Status |
|---------|--------|
| GET /manifest.json | ✅ |
| GET /stream/:type/:id.json | ✅ |
| / (redirecionar para manifest) | ✅ |
| OPTIONS preflight | ✅ |
| CORS headers | ✅ |
| Error handling | ✅ |

## 🔧 Troubleshooting

### Erro: "Cannot find module '@vercel/node'"
```bash
npm install @vercel/node
```

### Erro: "dist/api/handler.js not found"
```bash
npm run build
# e verifique se dist/api/handler.js existe
```

### Teste local falha
- Verifique `.env.local` com variáveis requeridas
- Rode `vercel dev` em vez de `npm start`

### Deploy falha no Vercel
- Verifique logs: `vercel logs <project-name> --follow`
- Verifique Environment Variables no Vercel Dashboard

## 📚 Próximos Passos

1. **Redis Cloud** (opcional)
   - Crie conta em rediscloud.com
   - Configure `REDIS_URL` no Vercel

2. **Domínio Customizado**
   - Dashboard > Settings > Domains
   - Aponte seu domínio

3. **Monitoramento**
   - Setup de alertas
   - Logs em tempo real

4. **Scaling** (se necessário)
   - Upgrade para plano Pro/Enterprise
   - Aumentar `maxDuration` acima de 60s
