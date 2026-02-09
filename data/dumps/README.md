# DataCrazy Full Data Dump

**Exportado em:** 08 de fevereiro de 2026, 17:02 UTC
**Duração:** 534 segundos (~9 minutos)
**Status:** ✅ COMPLETO

---

## 📊 Resumo de Dados

| Entidade | Quantidade | Arquivo |
|----------|-----------|---------|
| **Leads** | 10.126 | `datacrazy-leads.json` (21 MB) |
| **Businesses** (Deals) | 13.941 | `datacrazy-businesses.json` (40 MB) |
| **Products** | 27 | `datacrazy-products.json` (5,9 KB) |
| **Tags** | 37 | `datacrazy-tags.json` (7,3 KB) |
| **Pipelines** | 2 | `datacrazy-pipelines.json` (435 B) |
| **Pipeline Stages** | 15 | `datacrazy-pipeline-stages.json` (3,2 KB) |
| **Activities** | 6 | `datacrazy-activities.json` (30 KB) |
| **Loss Reasons** | 7 | `datacrazy-loss-reasons.json` (1,2 KB) |
| **TOTAL** | **38.281 registros** | **69 MB (completo)** |

---

## 📁 Arquivos Gerados

### Arquivo Completo
- **`datacrazy-complete-dump.json`** (69 MB)
  - Contém TODOS os dados em um único arquivo JSON estruturado
  - Estrutura: `{ exportedAt, data: { leads, businesses, products, ... } }`

### Arquivos Individuais por Entidade
- **`datacrazy-leads.json`** - 10.126 leads com todas as informações (nome, email, telefone, empresa, tags, métricas, etc)
- **`datacrazy-businesses.json`** - 13.941 negócios/deals (total, status, products, estágios, etc)
- **`datacrazy-products.json`** - 27 produtos (nome, SKU, preço)
- **`datacrazy-tags.json`** - 37 tags (para segmentação)
- **`datacrazy-pipelines.json`** - 2 pipelines ("Leads" e "Ligações")
- **`datacrazy-pipeline-stages.json`** - 15 stages (9 no pipeline Leads + 6 no pipeline Ligações)
- **`datacrazy-activities.json`** - 6 atividades (reuniões, tarefas, etc)
- **`datacrazy-loss-reasons.json`** - 7 motivos de perda de negócios

### Arquivo de Resumo
- **`datacrazy-dump-summary.json`** - Metadados do dump com contagens

---

## 🔄 Próximos Passos - Migração

Agora que você tem todo o backup dos dados, existem **3 opções** para migrar:

### **Opção 1: API + Staging (Recomendada)**
Usar esses JSONs para carregar em staging tables no Supabase:
1. Criar tabelas staging (`staging_leads`, `staging_businesses`, etc)
2. Carregar JSONs via `COPY` ou API Supabase
3. Validar dados
4. Mover para tabelas finais com transformação

### **Opção 2: CSV Export
Converter JSONs para CSVs para importação manual:
```bash
node scripts/json-to-csv.js
```

### **Opção 3: Sincronização Incremental
Manter esses dados como base e sincronizar mudanças futuras via API DataCrazy

---

## 📝 Estrutura de Dados (Exemplo)

### Lead (Sample)
```json
{
  "id": "6a55bf3b-c991-48a0-8ad1-cb310005a80c",
  "name": "Ivaniza miler",
  "email": "ivanizafmiler@gmail.com",
  "phone": "5551999596428",
  "company": null,
  "source": "Anúncio",
  "tags": [
    {"id": "234caf17-c387-482f-ad51-a6739947bfb2", "name": "ads-facebook"}
  ],
  "metrics": {
    "purchaseCount": 0,
    "lastPurchaseDate": null,
    "averageTicket": 0,
    "totalSpent": 0
  },
  "createdAt": "2026-01-29T17:31:00.415Z"
}
```

### Business/Deal (Sample)
```json
{
  "id": "581b8fb9-84dd-4852-8179-b3fbffc7e25d",
  "leadId": "6a55bf3b-c991-48a0-8ad1-cb310005a80c",
  "stageId": "4443d70f-bebc-4e9f-b998-1655b473847a",
  "total": 0,
  "discount": 0,
  "status": "lost",
  "code": 31452,
  "products": [
    {
      "id": "9b6b58d8-f66e-48d6-a8d2-c128d249d267",
      "name": "SHIFT",
      "quantity": 1,
      "price": 0
    }
  ],
  "lastMovedAt": "2026-01-29T17:55:38.041Z",
  "createdAt": "2026-01-29T17:31:06.960Z"
}
```

---

## 🔐 Considerações de Segurança

⚠️ **IMPORTANTE:**
- Este dump contém **dados sensíveis** de clientes (emails, telefones)
- Não fazer commit desses arquivos no Git (estão em `.gitignore`)
- Manter em local seguro
- Após migração completa, considere deletar este backup

---

## 🛠️ Ferramentas para Próximas Etapas

### Script de Migração (em desenvolvimento)
```bash
# Será criado: scripts/migrate-datacrazy-to-zmobcrm.js
```

### Validação de Dados
```bash
# Será criado: scripts/validate-migration.js
```

---

## 📞 Suporte

Se encontrar problemas durante a migração:
1. Verifique se os JSONs estão completos (usar `wc -l` para verificar linhas)
2. Valide a integridade: `node scripts/validate-dump.js`
3. Consulte o data-engineer agent: `@data-engineer`

---

**Data Engineer:** Dara 🗄️
