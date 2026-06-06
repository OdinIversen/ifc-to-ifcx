## Claude Code Kit

This repo uses [`claude-code-kit`](https://github.com/OdinIversen/claude-code-kit) for agent infrastructure: the autonomous orchestration loop, default prompts, standard skills, notify, and usage tracking.

- **Source of truth lives in the kit, not here.** If you need to change orchestration, default prompts, the usage poller, or any standard skill, edit the kit at `C:\dev\claude-code-kit`, not files in this repo. Editing kit-owned files locally is a smell — the change won't propagate to other consumers and will be lost on the next kit upgrade.
- **Read access via `node_modules/claude-code-kit/`.** That's the safe place to read kit code from inside this repo (and from inside Docker sandboxes, since `node_modules/` is part of the worktree). Treat it as read-only — edits get overwritten on the next install.
- **What this repo owns:** prompt overrides, repo-specific skills, domain code, `GOALS.md` (north star — read first), `CONTEXT.md` (domain glossary), ADRs, `.env`.
- **Bumping the kit:** the kit dep is unpinned (tracks `main`), so `npm update claude-code-kit` pulls the latest. For the skill bundle, re-run `npx skills@latest add OdinIversen/claude-code-kit`. Scaffolding templates (Dockerfile, GOALS.md, etc.) are intentionally NOT auto-synced — they're seeds you customised after init.
