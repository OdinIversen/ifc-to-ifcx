---
name: init-repo
description: Bootstrap a brand-new GitHub repo using the claude-code-kit scaffold (Dockerfile, sandcastle wiring, GOALS.md, CONTEXT.md, ADR-0001), commit, and push to a new private GitHub repo via the gh CLI. Use when the user wants to start a new project, initialize a new repo, says things like "set up a new repo for X", "start a new project", "bootstrap a repo", "init a new repo with claude-code-kit", or invokes /init-repo. Works from any directory — does not need an existing repo.
---

# Init Repo

End-to-end bootstrap of a new agent-ready GitHub repo. From "I want a new repo" to "scaffolded, committed, pushed, ready to open in a new session" in one flow.

## Flow

1. **Gather info from the user**, in a single message (prefer AskUserQuestion for visibility; use plain free-text questions for name, parent dir, and goal):
   - **Project name** (kebab-case) — becomes both the local dir name and the GitHub repo name.
   - **Parent directory** — where to create the project locally. Default: `C:\dev`.
   - **Visibility** — default `private`. Ask if you should make it public instead.
   - **Goal paragraph** — one paragraph answering *"why does this repo exist?"* This gets injected into `GOALS.md`.

2. **Confirm.** Restate the plan in 2-3 lines and wait for the user to confirm before doing anything destructive.

3. **Pre-flight** (Bash):
   - `gh auth status` — if not authenticated, stop and tell the user to run `gh auth login`. Do NOT try to proceed.
   - Verify the target dir `<parent>/<name>` does not already exist. If it does, abort and ask the user for a different name.

4. **Create the local repo** (Bash, single call):
   ```
   mkdir -p <parent>/<name> && cd <parent>/<name> && git init -b main
   ```

5. **Scaffold** (Bash, inside the new dir):
   ```
   cd <parent>/<name> && npx --yes claude-code-kit init --project-name <name>
   ```
   This is the kit's own `init` — it writes the scaffold files, runs `npm install`, and installs the skills bundle into the new repo.

6. **Inject the Goal** with the Edit tool:
   - Open `<parent>/<name>/GOALS.md`.
   - Replace the single line `TODO` directly under `## Goal` with the user's paragraph. Use a unique-enough `old_string` (include the heading + the comment block) so the edit can't match the other `TODO`s under Non-goals / Success criteria.
   - Leave the Non-goals and Success criteria `TODO`s alone — those are for the user to fill in next.

7. **First commit** (Bash, in the new dir):
   ```
   cd <parent>/<name> && git add -A && git commit -m "Initial scaffold via claude-code-kit"
   ```

8. **Create the GitHub remote and push** (Bash):
   ```
   cd <parent>/<name> && gh repo create <name> --private --source=. --push
   ```
   Use `--public` if the user chose public.

9. **Report.** Get the URL with `gh repo view --json url -q .url`, then print:
   - The new repo URL.
   - Next steps for the user:
     - Open the new dir in a Claude Code session.
     - Fill in `GOALS.md` Non-goals and Success criteria.
     - Customize `.sandcastle/Dockerfile` if the project needs language-specific deps (CUDA, etc.).

## Errors

- **`gh` not authenticated** → stop, tell user to run `gh auth login`. Do not attempt the gh steps.
- **Target dir already exists** → ask for a different name; do not auto-overwrite.
- **`npx claude-code-kit init` fails** → forward the error to the user. Leave the partial scaffold in place — the kit's CLI prints a manual recovery command on failure.
- **GitHub repo name already taken** (`gh repo create` exits non-zero with "already exists") → ask for a different name and retry only step 8.

## Notes

- Personal-use bootstrap. Assumes the user is `OdinIversen` with `gh` auth already configured.
- This skill must be installed globally (under `~/.claude/skills/init-repo/`) so it's available before a repo exists.
- The scaffold content itself lives in `claude-code-kit` — bugs in scaffolded files get fixed there, not here.
