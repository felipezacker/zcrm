# Technical Debt Assessment - DRAFT

**Documento:** FASE 4 - Brownfield Discovery (Para Revisão)  
**Projeto:** NossoCRM (zcrm-v1)  
**Data:** 2026-02-09  
**Status:** ⚠️ DRAFT - PENDENTE REVISÃO ESPECIALISTAS

---

## 1. Débitos de Sistema (@architect)

| ID | Débito | Severidade | Esforço | Prioridade |
|----|--------|------------|---------|------------|
| SYS-001 | TypeScript strict: false | 🔴 Crítico | 8-16h | P1 |
| SYS-002 | Dependências muito recentes | 🔴 Crítico | 2-4h | P2 |
| SYS-003 | Estrutura mista app/features | 🟠 Alto | 4-8h | P2 |
| SYS-004 | Baixa cobertura de testes | 🟠 Alto | 40-80h | P1 |
| SYS-005 | Context overload (12 contexts) | 🟠 Alto | 8-16h | P2 |
| SYS-006 | Documentação fragmentada | 🟡 Médio | 8-16h | P3 |
| SYS-007 | Falta de barrel exports | 🟡 Médio | 4-8h | P3 |
| SYS-008 | Design system não documentado | 🟡 Médio | 16-24h | P2 |
| SYS-009 | Arquivos .DS_Store | 🟢 Baixo | 0.5h | P4 |
| SYS-010 | Múltiplas configs de agentes | 🟢 Baixo | 2-4h | P4 |

⚠️ PENDENTE: Revisão do @architect

---

## 2. Débitos de Database (@data-engineer)

| ID | Débito | Severidade | Esforço | Prioridade |
|----|--------|------------|---------|------------|
| DB-001 | RLS policies muito permissivas | 🔴 Crítico | 4-8h | P1 |
| DB-002 | Falta de índices de busca | 🔴 Crítico | 2-4h | P1 |
| DB-003 | Soft delete sem cleanup | 🟠 Alto | 4-8h | P2 |
| DB-004 | FKs sem índice | 🟠 Alto | 2-4h | P2 |
| DB-005 | Schema único consolidado (80KB) | 🟠 Alto | 8-16h | P3 |
| DB-006 | JSONB sem validação | 🟡 Médio | 4-8h | P3 |
| DB-007 | Falta de constraints CHECK | 🟡 Médio | 2-4h | P3 |
| DB-008 | Triggers sem log de erro | 🟡 Médio | 2-4h | P3 |
| DB-009 | Inconsistência naming | 🟢 Baixo | 1-2h | P4 |
| DB-010 | Comentários faltando | 🟢 Baixo | 2-4h | P4 |

⚠️ PENDENTE: Revisão do @data-engineer

---

## 3. Débitos de Frontend/UX (@ux-design-expert)

| ID | Débito | Severidade | Esforço | Prioridade |
|----|--------|------------|---------|------------|
| UX-001 | Design system não documentado | 🔴 Crítico | 16-24h | P1 |
| UX-002 | Componentes sem Storybook | 🔴 Crítico | 8-16h | P2 |
| UX-003 | FormField muito grande (13KB) | 🟠 Alto | 8-16h | P2 |
| UX-004 | Inconsistência de naming | 🟠 Alto | 2-4h | P3 |
| UX-005 | Poucos testes componentes (16%) | 🟠 Alto | 16-24h | P1 |
| UX-006 | Contexts overload | 🟠 Alto | 8-16h | P2 |
| UX-007 | Estilos mistos (CSS-in-JS+Tailwind) | 🟡 Médio | 2-4h | P3 |
| UX-008 | Falta Loading Skeletons | 🟡 Médio | 4-8h | P3 |
| UX-009 | Ausência Error Boundaries | 🟡 Médio | 4-8h | P2 |
| UX-010 | Ícones hardcoded | 🟢 Baixo | 1-2h | P4 |

⚠️ PENDENTE: Revisão do @ux-design-expert

---

## 4. Matriz Preliminar

| Prioridade | Total | Horas Est. |
|------------|-------|------------|
| P1 (Crítico) | 6 | 72-136h |
| P2 (Alto) | 10 | 60-116h |
| P3 (Médio) | 10 | 42-84h |
| P4 (Baixo) | 4 | 5.5-14h |
| **TOTAL** | **30** | **179.5-350h** |

---

## 5. Perguntas para Especialistas

### Para @data-engineer:
1. As policies RLS com `USING (true)` são intencionais para single-tenant?
2. Existe job de cleanup para soft deletes?
3. O schema consolidado de 80KB é um problema de manutenção?

### Para @ux-design-expert:
1. FormField de 13KB deve ser refatorado ou é intencional?
2. Há padrão de loading states definido?
3. A inconsistência de naming (PascalCase vs lowercase) é conhecida?

---

**Status:** FASE 4 COMPLETA - AGUARDANDO REVISÃO ✅
