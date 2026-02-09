# QA Fix Request — Phase B: Production Observability

**Reviewer:** Quinn (QA Guardian)
**Date:** 2026-02-08
**Commit:** `81d72d5`
**Gate Decision:** 🟡 CONCERNS
**Target:** @dev (Dex)

---

## 🔴 CRITICAL (Must Fix)

### C1 — Remover Sentry Integrations Deprecadas
**File:** `lib/sentry.ts:14-17`
**Problem:** `new Sentry.Integrations.Http()`, `OnUncaughtException()`, `OnUnhandledRejection()` são deprecadas no @sentry/nextjs v8+. Podem causar erro em runtime.
**Fix:** Remover o array `integrations` inteiro. Sentry v8 auto-detecta tudo.
**Effort:** 5 min

### C2 — Reescrever Testes Sentry com Assertions Reais
**File:** `lib/sentry.test.ts`
**Problem:** Testes verificam `expect(fn).toBeDefined()` — não testam comportamento real. PII Redaction tests não testam redação.
**Fix:**
- Importar o mock de `@sentry/nextjs` e verificar `.toHaveBeenCalledWith()`
- Testar `redactHeaders`, `redactUrl`, `redactObject` diretamente (exportar ou testar via `beforeSend`)
- Remover testes de PII que não testam nada
**Effort:** 30 min

---

## 🟠 HIGH (Strongly Recommended)

### H1 — Trocar `substr` por `substring` + usar crypto
**File:** `lib/logger.ts:23`
**Problem:** `substr` é deprecated. `Math.random()` não é criptograficamente seguro.
**Fix:**
```typescript
// Substituir:
return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Por:
return crypto.randomUUID();
```
**Effort:** 5 min

### H2 — Adaptar Middleware para App Router
**File:** `lib/middleware/logging.ts`
**Problem:** Usa `NextApiRequest`/`NextApiResponse` (Pages Router). Projeto usa App Router.
**Fix:** Criar versão compatível com Route Handlers (`NextRequest`/`NextResponse`) ou wrapper genérico.
**Effort:** 30 min

### H3 — Limitar Body Logging em Produção
**File:** `lib/middleware/logging.ts:33`
**Problem:** Loga response body inteiro. Pode ser enorme (listagens, relatórios).
**Fix:** Adicionar limite: `body: isDev ? redactSensitiveData(body) : { truncated: true, size: JSON.stringify(body).length }`
**Effort:** 10 min

### H4 — Remover/Desabilitar `sendMetricToAnalytics`
**File:** `lib/analytics.ts:66-83`
**Problem:** Envia para `/api/analytics/metrics` que não existe. Gera 404 silencioso.
**Fix:** Remover chamada ou adicionar flag de controle (`ANALYTICS_ENDPOINT` env var). Só enviar se endpoint configurado.
**Effort:** 5 min

### H5 — Middleware Intercepta Apenas `res.json()`
**File:** `lib/middleware/logging.ts:22-38`
**Problem:** `res.send()`, `res.end()`, streaming ficam sem log de response.
**Fix:** Interceptar também `res.send()` e `res.end()`, ou usar abordagem `res.on('finish')`.
**Effort:** 15 min

### H6 — Criar Sentry Config Files na Raiz
**Problem:** `@sentry/nextjs` requer `sentry.client.config.ts` e `sentry.server.config.ts` na raiz do projeto para inicializar corretamente.
**Fix:** Criar os dois arquivos importando `initSentry()` de `lib/sentry.ts`.
**Effort:** 10 min

---

## 🟡 MEDIUM (Technical Debt)

### M1 — Proteção contra Prototype Pollution
**File:** `lib/logger.ts:42`
**Fix:** Trocar `for (const key in redacted)` por `for (const key of Object.keys(redacted))`

### M2 — Limite de Profundidade Recursiva
**File:** `lib/logger.ts:48-49`
**Fix:** Adicionar parâmetro `depth` com limite (ex: `maxDepth = 5`)

### M3 — Unificar Lógica de Redação
**Files:** `lib/logger.ts` + `lib/sentry.ts`
**Fix:** Criar `lib/utils/redact.ts` compartilhado

### M4 — Remover `getFID` Deprecado
**File:** `lib/analytics.ts:96`
**Fix:** Remover `getFID(reportWebVitals)`. INP já cobre essa métrica.

### M5 — Documentar Variáveis de Ambiente
**File:** `.env.example`
**Fix:** Adicionar `SENTRY_DSN`, `LOG_LEVEL`, `ANALYTICS_ENDPOINT`

---

## 🏗️ Integração (Pendente)

Nenhum módulo está integrado ao app. Após os fixes, integrar:

1. **Logger** — Importar em API routes e middleware global
2. **Sentry** — Criar config files na raiz, adicionar ao `next.config.js`
3. **Analytics** — Chamar `initializeAnalytics()` no layout root
4. **ErrorBoundary** — Wrapping no root layout

---

## Checklist de Conclusão

- [ ] C1: Sentry integrations deprecadas removidas
- [ ] C2: Testes Sentry reescritos com assertions reais
- [ ] H1: `crypto.randomUUID()` implementado
- [ ] H2: Middleware adaptado para App Router
- [ ] H3: Body logging limitado em produção
- [ ] H4: `sendMetricToAnalytics` condicionado a endpoint existir
- [ ] H5: Middleware intercepta todos os tipos de response
- [ ] H6: Sentry config files criados na raiz
- [ ] M1-M5: Debt técnico documentado/corrigido
- [ ] Todos os testes passando
- [ ] Integração com app existente

---

**Após fixes, solicitar re-review:** `@qa *review Phase-B`

— Quinn, guardião da qualidade 🛡️
