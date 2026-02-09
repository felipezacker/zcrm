# Story TECH-005: Limpeza de Repositório

**Story ID:** TECH-005  
**Epic:** TECH-DEBT-001  
**Status:** Ready for Dev  
**Priority:** P4 - Baixo  
**Estimated:** 1h  
**Agent:** @dev (Dex)

---

## Story

Como **desenvolvedor**, preciso **limpar arquivos desnecessários do repositório** e melhorar o `.gitignore` para manter o repo limpo.

## Acceptance Criteria

- [ ] Arquivos `.DS_Store` removidos do Git
- [ ] `.gitignore` atualizado com regras para `.DS_Store`
- [ ] `npm run build` passa

## Dev Notes

### Origens

- Brownfield Discovery: SYS-009

### Implementação

```bash
# Remover .DS_Store do git (manter local)
find . -name ".DS_Store" -not -path "./node_modules/*" | xargs git rm --cached 2>/dev/null

# Adicionar ao .gitignore
echo ".DS_Store" >> .gitignore
echo "**/.DS_Store" >> .gitignore
```

## Tasks

- [ ] 1. Verificar `.gitignore` atual
- [ ] 2. Adicionar `.DS_Store` e `**/.DS_Store` ao `.gitignore`
- [ ] 3. Remover `.DS_Store` do git tracking (`git rm --cached`)
- [ ] 4. Run `npm run build`

## Testing

- [ ] `.DS_Store` não aparece em `git status`
- [ ] Build passa

## Dev Agent Record

### Checkboxes
### Debug Log
### Completion Notes
### Change Log
### File List

---

— Story criada pelo Brownfield Discovery Workflow
