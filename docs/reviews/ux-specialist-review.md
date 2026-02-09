# UX Specialist Review

**Documento:** FASE 6 - Brownfield Discovery  
**Revisor:** @ux-design-expert (Uma)  
**Data:** 2026-02-09

---

## Gate Status: ✅ VALIDATED

---

## Débitos Validados

| ID | Débito | Severidade | Horas | Prioridade | Impacto UX |
|----|--------|------------|-------|------------|------------|
| UX-001 | Design system não documentado | 🔴 Crítico | 20h | P1 | Inconsistência visual, onboarding lento |
| UX-002 | Sem Storybook | 🔴 Crítico | 12h | P2 | Difícil preview e teste de variações |
| UX-003 | FormField 13KB | 🟠 Alto | 12h | P2 | Difícil manutenção, god component |
| UX-004 | Naming inconsistente | 🟠 Alto | 3h | P3 | Confusão para novos devs |
| UX-005 | Poucos testes (16%) | 🟠 Alto | 20h | P1 | Risco de regressão visual |
| UX-006 | Contexts overload | 🟠 Alto | 12h | P2 | Re-renders desnecessários |
| UX-007 | Estilos mistos | 🟡 Médio | 3h | P3 | Inconsistência de abordagem |
| UX-008 | Falta Loading Skeletons | 🟡 Médio | 6h | P3 | UX de loading pobre |
| UX-009 | Sem Error Boundaries | 🟡 Médio | 6h | P2 | Crash da UI inteira |
| UX-010 | Ícones hardcoded | 🟢 Baixo | 1.5h | P4 | Manutenção mais difícil |

---

## Débitos Adicionados

| ID | Débito | Severidade | Horas | Prioridade |
|----|--------|------------|-------|------------|
| UX-011 | Falta de tokens CSS centralizados | 🟡 Médio | 4h | P3 |
| UX-012 | Animações sem padrão definido | 🟡 Médio | 4h | P3 |
| UX-013 | Mobile-first não consistente | 🟠 Alto | 8h | P2 |

---

## Respostas ao Architect

**Q1:** FormField de 13KB deve ser refatorado?
> **R:** Sim, definitivamente. Recomendo quebrar em:
> - `FormInput` (texto básico)
> - `FormSelect` (select/combo)
> - `FormTextarea` (multiline)
> - `FormField` (wrapper com label/error)

**Q2:** Há padrão de loading states?
> **R:** Não detectei padrão documentado. Recomendo criar `Skeleton` components e documentar uso.

**Q3:** A inconsistência de naming é conhecida?
> **R:** Provavelmente herdada de diferentes contribuidores. Recomendo padronizar para PascalCase (React convention).

---

## Recomendações de Design

1. **Design System Doc:** Criar `docs/design-system.md` com tokens, cores, tipografia
2. **Component Library:** Implementar Storybook para documentação visual
3. **Loading States:** Criar `Skeleton`, `Spinner`, `LoadingOverlay` components
4. **Error Handling:** Implementar Error Boundaries em nível de feature
5. **Mobile Review:** Fazer audit de responsividade em todas as features

---

## Quick Wins (impacto alto, esforço baixo)

1. Padronizar naming de arquivos (3h)
2. Adicionar Error Boundaries básicos (6h)
3. Criar Loading Skeletons para listas (6h)

---

**Status:** FASE 6 - VALIDADO ✅
