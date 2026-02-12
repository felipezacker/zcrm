# Epic: Technical Debt Remediation 2026-Q1

**Status**: Planning
**Owner**: PM Agent (Orion)
**Priority**: High
**Effort**: ~130 Hours

## Contexto
Este épico endereça os débitos técnicos críticos identificados no assessment de Fevereiro/2026. O foco é garantir a segurança da plataforma (multi-tenancy, testes) e melhorar a experiência móvel para os vendedores em campo.

## Objetivos (OKRs)
1. **Segurança**: Eliminar risco de vazamento de dados entre clientes (Multi-tenant) e garantir integridade de deploy (CI).
2. **Performance**: Garantir tempo de resposta < 200ms em operações de CRUD com índices corretos.
3. **Usabilidade**: Permitir uso satisfatório do CRM em dispositivos móveis (iPhone SE/Android).

## Escopo
- Automação de Infraestrutura (CI/CD)
- Refatoração de Banco de Dados
- Adaptação de Frontend Mobile
- Melhoria de DX (Typescript)

## Fora de Escopo
- Redesign completo da UI (apenas ajustes mobile).
- Mudança de provedor de Cloud/Database.
- Novas features de produto.

## Dependências
- Acesso administrativo ao Supabase.
- Acesso ao repositório GitHub para configurar Actions.

## Milestones
- **M1: Fundação (Semana 1-2)**: CI configurado e Banco seguro (RLS revisado).
- **M2: Experiência (Semana 3-4)**: Mobile layout e Typescript.
