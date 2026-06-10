# 4. Product scope and done criteria

Date: 2026-06-10

## Status

Accepted. Complements ADR-0002 (Python/PySide6/PyInstaller for Windows
desktop) and ADR-0003 (target IFC5/IFCX despite alpha status).

## Context

The project's scope contract and success bar lived in `GOALS.md`, which is
retired across the author's repos in favour of `CONTEXT.md` as a pure domain
glossary plus dated ADRs as decisions of record. ADR-0002 and ADR-0003 already
record the platform choice, the output-format decision, the alpha-status
caveats, and the "loads in the IFC5 viewer" validation stance. The remaining
scope decisions had no home; they are recorded here. `GOALS.md` was removed on
2026-06-10 and remains available in git history; older references to it
resolve to the content now recorded here and in ADR-0002/0003.

## Decision

The tool is a **conversion-only Windows desktop GUI** for a non-developer
(first user: an academic with a folder of IFC4 STEP files). Explicitly out of
scope:

- **Not a library, CLI, or server.** Desktop GUI only.
- **Not cross-platform in v1.** Windows only; macOS/Linux only if demand
  appears.
- **Not bidirectional.** IFCX to IFC4 STEP is out of scope.
- **Not a viewer, editor, or validator.** Conversion only. Parse and mapping
  errors are surfaced; IFC semantic checks are not implemented.

The done criteria, beyond "a converted file loads in the IFC5 viewer"
(ADR-0003):

- **Single-artifact install.** The user installs from one downloaded artifact:
  no terminal, no Python install, ideally no admin rights (the ADR-0002 stack
  exists to make this possible).
- **Batch with per-file failure isolation.** A batch of `.ifc` files converts
  per-file; one failure marks that file with its error in the result list and
  the remaining files still convert.
- **Responsive UI.** Conversion runs on a worker thread; the UI never freezes
  and per-file progress is visible.
- **Open:** throughput / file-size targets are deliberately undefined until a
  representative IFC4 file is benchmarked.

## Consequences

- Scope creep toward viewer/validator/CLI features has a recorded decision to
  argue against; reversing any of these requires amending this ADR.
- The batch and responsiveness criteria constrain the converter's architecture
  (worker-thread execution, per-file error containment) independently of the
  mapping work.
