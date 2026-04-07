# Deployment Guide - Vercel

Este guia descreve como fazer deploy do addon Barestreams no Vercel.

## ✅ Pré-requisitos

- Conta no [Vercel.com](https://vercel.com)
- Repositório Git (GitHub, GitLab ou Bitbucket)
- Node.js 20.x ou superior

## 📋 Arquivos de Configuração

O projeto foi configurado para funcionar no Vercel com os seguintes arquivos:

- **`vercel.json`** - Configuração do build e deploy
- **`.vercelignore`** - Arquivos excluídos do upload
- **`api/handler.ts`** - Handler serverless para Vercel Functions
- **`src/init.ts`** - Módulo compartilhado de inicialização

## 🚀 Deploy via CLI

### 1. Instale o Vercel CLI
```bash
npm i -g vercel
```

### 2. Faça login
```bash
vercel login
```

### 3. Deploy
```bash
vercel
```

ou com opções:
```bash
vercel --prod  # Deploy para produção diretamente
```

## 🌐 Deploy via GitHub

### 1. Push do código para GitHub
```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 2. Conecte no Vercel Dashboard
- Acesse [vercel.com/dashboard](https://vercel.com/dashboard)
- Clique em "Add New..." > "Project"
- Selecione seu repositório
- Clique "Import"

### 3. Configure Variáveis de Ambiente

No Vercel Dashboard, vá em **Settings** > **Environment Variables** e adicione:

```env
REDIS_URL=redis://...  # (opcional)
REDIS_TTL_HOURS=24
MAX_REQUEST_WAIT_SECONDS=30
EZTV_URL=https://eztv.re
YTS_URL=https://yts.mx
TGX_URL=https://www.torrentgalaxy.to
APIBAY_URL=https://apibay.org
X1337X_URL=https://www.1337xx.to
KAT_URL=https://kickass.cd
USE_TRACKERSLIST=true
```

### 4. Deploy automático
Cada push para `main` fará deploy automático!

## ⚙️ Variáveis de Ambiente Importantes

| Variável | Obrigatória | Descrição |
|----------|-----------|-----------|
| `REDIS_URL` | ❌ | URL de conexão Redis (deixe vazio para desabilitar cache) |
| `MAX_REQUEST_WAIT_SECONDS` | ❌ | Timeout máximo (padrão: 30s) |
| `EZTV_URL` | ✅ | URL base do EZTV |
| `YTS_URL` | ✅ | URL base do YTS |
| `TGX_URL` | ✅ | URL base do TorrentGalaxy |
| `APIBAY_URL` | ✅ | URL base do ApiBay |
| `X1337X_URL` | ✅ | URL base do 1337x |
| `KAT_URL` | ✅ | URL base do Kickass |

## ⏱️ Limitações do Vercel

### Timeout
- **Plano Gratuito**: 60 segundos
- **Pro/Enterprise**: até 900 segundos

⚠️ **Seu addon faz scraping** que pode levar 5-30 segundos. Configure `MAX_REQUEST_WAIT_SECONDS=30` para estar seguro.

### Memória
- **512MB** disponível (suficiente para o addon)

### Funcionalidades
- ✅ HTTP/HTTPS
- ✅ Node.js serverless
- ✅ Variáveis de ambiente
- ❌ Conexões persistentes (Redis deve ser externo)

## 🔗 URLs do Addon

Após deploy, seu addon estará disponível em:

```
https://<seu-projeto>.vercel.app/manifest.json
```

Copie a URL do manifest para adicionar no Stremio:
```
https://<seu-projeto>.vercel.app
```

## 🐛 Troubleshooting

### "Timeout" 504
- Reduza `MAX_REQUEST_WAIT_SECONDS` ou aumente no Pro plan
- Verifique se as URLs dos scrapers estão acessíveis

### "Redis unavailable"
- Se não configurou `REDIS_URL`, é normal
- Addon funcionará sem cache

### Função não inicia
- Verifique os logs: `vercel logs <project-name>`
- Verifique se todas as variáveis estão setadas

### Erros de conexão externa
- Alguns provedores podem bloquear requisições do Vercel
- Configure `FLARESOLVERR_URL` para bypass Cloudflare

## 📊 Monitoramento

No Vercel Dashboard você pode:
- Ver logs em tempo real
- Monitorar performance
- Gerenciar deployments
- Configurar domínio customizado

## 🔄 Rollback

Se um deploy falhar, você pode voltar para versão anterior:

```bash
vercel rollback
```

ou no Dashboard: **Deployments** > clicar na versão desejada > **Promote to Production**

## 💡 Dicas

1. **Cache**: Configure Redis Cloud para manter cache entre requisições
2. **FlareSolverr**: Use serviço externo para bypass Cloudflare
3. **Domínio**: Aponte um domínio customizado no Vercel
4. **Staging**: Use branch `staging` para testes antes de `main`

## 🆘 Suporte

Para problemas:
- [Vercel Docs](https://vercel.com/docs)
- [Vercel Community](https://vercel.com/community)
- [GitHub Issues](https://github.com)
