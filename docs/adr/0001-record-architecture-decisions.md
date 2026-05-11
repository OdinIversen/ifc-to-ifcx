# 1. Record architecture decisions

Date: 2026-05-11

## Status

Accepted

## Context

We need to record the architectural decisions made on this project so that
future contributors — humans and agents — can understand the reasoning
behind the current design, not just its shape.

## Decision

We will use Architecture Decision Records, as described by Michael Nygard
in [his original article](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions).

Each ADR lives in `docs/adr/` as a numbered Markdown file (`NNNN-slug.md`).
The format is:

- **Status** — Accepted / Superseded / Deprecated
- **Context** — what is the issue we're addressing
- **Decision** — what we decided to do
- **Consequences** — what becomes easier and harder as a result

ADRs are immutable once accepted. A later decision that overrides an
earlier ADR should reference it by number and mark the earlier one as
Superseded.

## Consequences

- Future readers can understand why the code is shaped the way it is,
  not only what it does.
- Adding an architectural decision becomes a deliberate step instead of
  an implicit one buried in commit messages.
- The `grill-with-docs` and `improve-codebase-architecture` skills have a
  stable place to look for prior decisions.
