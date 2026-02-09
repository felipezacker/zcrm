# Epic: Resolução de Débitos Técnicos - NossoCRM

**Epic ID:** TECH-DEBT-001  
**Projeto:** NossoCRM (zcrm-v1)  
**Data:** 2026-02-09  
**Status:** 🟡 Ready for Development

---

## Objetivo

Resolver os 35 débitos técnicos identificados no Brownfield Discovery, melhorando segurança, performance e manutenibilidade do produto.

---

## Escopo

### Incluído
- 6 débitos críticos (segurança, type safety)
- 13 débitos altos (performance, arquitetura)
- 12 débitos médios (documentação, qualidade)
- 4 débitos baixos (limpeza)

### Excluído
- Features novas
- Refatoração de lógica de negócio
- Migração de dependências major

---

## Critérios de Sucesso

- [ ] TypeScript strict: true passa sem erros
- [ ] Coverage de testes > 50%
- [ ] Queries principais < 100ms
- [ ] Zero issues críticos de RLS
- [ ] Design system documentado
- [ ] `npm run precheck` passa 100%

---

## Timeline

| Fase | Duração | Stories |
|------|---------|---------|
| Fase 1: Quick Wins | 1-2 sem | 6 stories |
| Fase 2: Fundação | 2-4 sem | 6 stories |
| Fase 3: Otimização | 4-6 sem | 4 stories |

**Total:** 6-8 semanas

---

## Budget Aprovado

| Item | Valor |
|------|-------|
| Horas estimadas | 337h |
| Custo (R$150/h) | R$ 50.550 |
| Buffer (15%) | Incluído |

---

## Stories (Resumo)

### Fase 1: Quick Wins
1. **TECH-001:** Adicionar índices de performance no DB
2. **TECH-002:** Implementar Error Boundaries
3. **TECH-003:** Criar Loading Skeletons
4. **TECH-004:** Adicionar índices em FKs
5. **TECH-005:** Padronizar naming de componentes
6. **TECH-006:** Limpeza básica (.DS_Store, gitignore)

### Fase 2: Fundação
7. **TECH-007:** Habilitar TypeScript strict mode
8. **TECH-008:** Revisar e corrigir políticas RLS
9. **TECH-009:** Documentar Design System
10. **TECH-010:** Implementar testes críticos
11. **TECH-011:** Refatorar FormField
12. **TECH-012:** Consolidar Contexts

### Fase 3: Otimização
13. **TECH-013:** Implementar Storybook
14. **TECH-014:** Completar documentação
15. **TECH-015:** Resolver débitos P3 restantes
16. **TECH-016:** Aumentar coverage para 50%

---

## Riscos

| Risco | Mitigação |
|-------|-----------|
| TypeScript strict quebra código | Migração por módulo |
| Escopo aumenta | Sprints timeboxed |
| Dependencies conflitos | Análise prévia |

---

## Anexos

- [Technical Debt Report](../reports/TECHNICAL-DEBT-REPORT.md)
- [Technical Debt Assessment](../prd/technical-debt-assessment.md)

---

**Responsável:** @pm  
**Criado via:** Brownfield Discovery Workflow
