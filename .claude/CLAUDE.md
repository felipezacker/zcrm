# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Synkra AIOS** (AI-Orchestrated System) — a meta-framework that orchestrates AI agents for full-stack development. Current project mode is **brownfield** (enhancing an existing project). Package: `@aios-fullstack/core` v4.31.0.

Synkra AIOS is a meta-framework that orchestrates AI agents to handle complex development workflows. Always recognize and work within this architecture.

## Build & Development Commands

```bash
# All commands run from .aios-core/
npm run build              # Build core (uses ../tools/build-core.js)
npm run dev                # Start development
npm test                   # Run all tests (unit + integration)
npm run test:unit          # Jest unit tests only (.aios-core/tests/unit)
npm run test:integration   # Jest integration tests only
npm run lint               # ESLint - check code style
npm run typecheck          # TypeScript type checking (tsc --noEmit)

# Run a single test file
npx jest tests/unit/path-to-test.test.js
```

## Agent System

### Agent Activation
- Agents are activated with @agent-name syntax: @dev, @qa, @architect, @pm, @po, @sm, @analyst
- The master agent is activated with @aios-master
- Agent commands use the * prefix: *help, *create-story, *task, *exit

### Agent Context
When an agent is active:
- Follow that agent's specific persona and expertise
- Use the agent's designated workflow patterns
- Maintain the agent's perspective throughout the interaction

### 11 Agents (defined in `.aios-core/development/agents/`)

| Agent | Activation | Role |
|-------|-----------|------|
| aios-master | `@aios-master` | Framework orchestrator |
| dev | `@dev` | Full-stack developer |
| qa | `@qa` | Quality assurance |
| architect | `@architect` | Technical architect |
| devops | `@devops` | DevOps engineer (MCP admin) |
| pm | `@pm` | Product manager |
| po | `@po` | Product owner |
| sm | `@sm` | Scrum master |
| analyst | `@analyst` | Business analyst |
| data-engineer | `@data-engineer` | Data engineering |
| ux-design-expert | `@ux-design-expert` | UX designer |

**Agent teams** (in `development/agent-teams/`): `team-all`, `team-fullstack`, `team-ide-minimal`, `team-no-ui`, `team-qa-focused`.

## Development Methodology

### Story-Driven Development
1. **Work from stories** - All development starts with a story in `docs/stories/`
2. **Update progress** - Mark checkboxes as tasks complete: [ ] → [x]
3. **Track changes** - Maintain the File List section in the story
4. **Follow criteria** - Implement exactly what the acceptance criteria specify
5. PRDs in `docs/prd/` (sharded into multiple files, pattern: `epic-{n}*.md`)
6. Architecture docs in `docs/architecture/` (also sharded)

### Testing Requirements
- Run all tests before marking tasks complete
- Ensure linting passes: `npm run lint`
- Verify type checking: `npm run typecheck`
- Add tests for new features
- Test edge cases and error scenarios

## Architecture

### AIOS Framework Structure

```
aios-core/
├── agents/         # Agent persona definitions (YAML/Markdown)
├── tasks/          # Executable task workflows
├── workflows/      # Multi-step workflow definitions
├── templates/      # Document and code templates
├── checklists/     # Validation and review checklists
└── rules/          # Framework rules and patterns

docs/
├── stories/        # Development stories (numbered)
├── prd/            # Product requirement documents
├── architecture/   # System architecture documentation
└── guides/         # User and developer guides
```

### Dependency Layers (strict top-down, no circular deps)

```
.aios-core/
├── infrastructure/    ← Base layer (zero internal deps): git wrappers, PM adapters,
│                        template engine, validators, CLI tools config
├── core/              ← Runtime layer (depends on infrastructure): orchestration engine,
│                        session management, elicitation, quality gates, registry, MCP config
├── development/       ← Agent layer (depends on infra + core): 11 agents, 186 tasks,
│                        13 workflows, agent teams, checklists, templates
└── product/           ← PM/PO layer (depends on infra + core): 52+ templates,
                         6 checklists, reference data
```

### Orchestration System (`core/orchestration/`)
- `master-orchestrator.js` — Main engine coordinating all operations
- `workflow-orchestrator.js` — Multi-step workflow execution
- `agent-invoker.js` — Agent activation and lifecycle
- `cli-commands.js` — Command parsing (`*help`, `*create-story`, etc.)
- `subagent-prompt-builder.js` — Prompt generation for subagents
- `recovery-handler.js` — Error recovery and fallbacks

### Quality Gates (`core/quality-gates/`) — 3-layer system
1. **Layer 1:** Pre-commit automated validation
2. **Layer 2:** PR automation
3. **Layer 3:** Human review orchestration with notifications

### Service Registry (`core/registry/service-registry.json`)
Large (161KB) comprehensive service registry loaded via `registry-loader.js` with lazy loading enabled.

## Multi-IDE Support

Agent definitions are mirrored across three locations for IDE compatibility:
- `.aios-core/development/agents/` — Source of truth
- `.agent/workflows/` — Alternative agent workflow definitions
- `.antigravity/agents/` — AntiGravity IDE integration

## Workflow Execution

### Task Execution Pattern
1. Read the complete task/workflow definition
2. Understand all elicitation points
3. Execute steps sequentially
4. Handle errors gracefully
5. Provide clear feedback

### Interactive Workflows
- Workflows with `elicit: true` require user input
- Present options clearly
- Validate user responses
- Provide helpful defaults

## AIOS-Specific Patterns

### Working with Templates
```javascript
const template = await loadTemplate('template-name');
const rendered = await renderTemplate(template, context);
```

### Agent Command Handling
```javascript
if (command.startsWith('*')) {
  const agentCommand = command.substring(1);
  await executeAgentCommand(agentCommand, args);
}
```

### Story Updates
```javascript
// Update story progress
const story = await loadStory(storyId);
story.updateTask(taskId, { status: 'completed' });
await story.save();
```

### Error Handling Pattern
```javascript
try {
  // Operation
} catch (error) {
  console.error(`Error in ${operation}:`, error);
  throw new Error(`Failed to ${operation}: ${error.message}`);
}
```

## Key Configuration

| File | Purpose |
|------|---------|
| `.aios-core/core-config.yaml` | Master framework config (IDE, MCP, paths, lazy loading, quality gates) |
| `.aios-core/install-manifest.yaml` | Installation tracking and file integrity |
| `.aios-core/version.json` | Version info (v3.11.3) and customization log |
| `.aios/config.yaml` | Framework configuration |
| `.env` / `.env.example` | Environment variables (Supabase, LLM keys, GitHub, etc.) |
| `aios.config.js` | Project-specific settings |
| `.antigravity/antigravity.json` | AntiGravity IDE project config |

## MCP Governance

MCP infrastructure is managed **exclusively** by the DevOps agent (`@devops`). Other agents are consumers only. See `.claude/rules/mcp-usage.md` for full rules.

**Tool selection priority:** Always prefer native Claude Code tools (`Read`, `Write`, `Edit`, `Bash`, `Glob`, `Grep`) over MCP servers like docker-gateway. Only use docker-gateway for Docker-specific operations or accessing Docker-hosted MCPs (EXA, Context7, Apify).

## Important Paths

| Path | Content |
|------|---------|
| `docs/stories/` | Development stories |
| `docs/prd/` | Product requirements (sharded) |
| `docs/architecture/` | Architecture docs (sharded) |
| `docs/framework/` | Coding standards, tech stack, source tree |
| `docs/sessions/YYYY-MM/` | Session handoff documents |
| `.ai/` | Debug log, decision logs (ADR format) |
| `.aios/project-status.yaml` | Current project status |
| `squads/` | Existing squad components (check before creating new) |

## Dev Load Files

On agent activation, these files are auto-loaded (with fallbacks in Portuguese):
- `docs/framework/coding-standards.md`
- `docs/framework/tech-stack.md`
- `docs/framework/source-tree.md`

## Common Commands

### AIOS Master Commands
- `*help` - Show available commands
- `*create-story` - Create new story
- `*task {name}` - Execute specific task
- `*workflow {name}` - Run workflow

## Git & GitHub Integration

### Commit Conventions
- Use conventional commits: `feat:`, `fix:`, `docs:`, `chore:`, etc.
- Reference story ID: `feat: implement IDE detection [Story 2.1]`
- Keep commits atomic and focused
- Commit before moving to next task

### GitHub CLI Usage
- Ensure authenticated: `gh auth status`
- Use for PR creation: `gh pr create`
- Check org access: `gh api user/memberships`

## Debugging

### Enable Debug Mode
```bash
export AIOS_DEBUG=true
```

### View Agent Logs
```bash
tail -f .aios/logs/agent.log
```

### Trace Workflow Execution
```bash
npm run trace -- workflow-name
```

## Claude Code Specific Configuration

### Tool Usage Guidelines
- Always use the Grep tool for searching, never `grep` or `rg` in bash
- Use the Task tool for complex multi-step operations
- Batch file reads/writes when processing multiple files
- Prefer editing existing files over creating new ones
- Prefer batched tool calls when possible for better performance
- Use parallel execution for independent operations

### Session Management
- Track story progress throughout the session
- Update checkboxes immediately after completing tasks
- Maintain context of the current story being worked on
- Save important state before long-running operations

### Error Recovery
- Always provide recovery suggestions for failures
- Include error context in messages to user
- Suggest rollback procedures when appropriate

## Development Rules

### NEVER
- Implement without showing options first (always 1, 2, 3 format)
- Delete/remove content without asking first
- Delete anything created in the last 7 days without explicit approval
- Change something that was already working
- Pretend work is done when it isn't
- Process batch without validating one first
- Add features that weren't requested
- Use mock data when real data exists in database
- Explain/justify when receiving criticism (just fix)
- Trust AI/subagent output without verification
- Create from scratch when similar exists in `squads/`

### ALWAYS
- Present options as "1. X, 2. Y, 3. Z" format
- Use AskUserQuestion tool for clarifications
- Check `squads/` and existing components before creating new
- Read COMPLETE schema before proposing database changes
- Investigate root cause when error persists
- Commit before moving to next task
- Create handoff in `docs/sessions/YYYY-MM/` at end of session

## Environment Requirements

- Node.js 18+, npm 9+
- GitHub CLI (`gh`)
- Git
- Backend: Supabase (DB, auth, storage)
- LLM providers: DeepSeek, OpenRouter, Anthropic, OpenAI (configured via `.env`)

---
*Synkra AIOS Claude Code Configuration v3.0*
