# 3. Target IFC5 / IFCX as the output format, despite alpha status

Date: 2026-05-11

## Status

Accepted

## Context

The first user (an academic) has IFC4 STEP files and wants output that
loads in the buildingSMART IFC5 viewer at
https://ifc5.technical.buildingsmart.org/viewer/ . That viewer accepts
only **IFC5 / IFCX** files.

Facts established at the time of this decision (May 2026):

- **IFC5 is alpha.** The buildingSMART IFC5-development repo
  describes its examples as "preliminary alpha" and "not suitable for
  production use without further refinement". The schema, defined in
  TypeSpec, will continue to evolve; the viewer is labelled BETA.
- **No IFC4 → IFC5 converter exists.** Verified against the
  buildingSMART/IFC5-development repo (source, issues, CLI), the
  IfcOpenShell project (including discussion #7042, "ifc5 and its
  impact", Aug 2025, where the maintainer described an "early
  conceptual planning" roadmap and recruited contributors), IfcPatch
  (which only handles IFC2x3 ↔ IFC4), and major commercial tools.
  None emit IFC5/IFCX from IFC4 input.
- **IFC4 → IFC5 is a schema-level translation, not a reserialisation.**
  IFC4 is an EXPRESS-defined entity tree; IFC5 is a TypeSpec-defined
  layered/component model influenced by USD. Producing the mapping is
  project-original work.

Earlier-generation JSON serialisations of IFC4 (ifcJSON-4, ifcJSON-5a)
are **not** the IFC5/IFCX format and do not load in the IFC5 viewer;
they are not viable alternatives for this project's goal.

## Decision

The project's output format is **IFC5 / IFCX**, against the schema
snapshot current at the time of each release. We accept that:

- The IFC4 → IFC5 entity mapping is original project work.
- Output validity is moving-target: pinned to a specific IFC5 alpha
  revision per release.
- "Loads in the IFC5 viewer" is the primary observable success
  criterion until a spec-level validator exists.

## Consequences

- **Scope is research-grade.** The IFC4 → IFC5 mapping is the
  project's core work; we are not wrapping an existing converter.
- **Output stability is bounded by the IFC5 spec.** A converted file
  that loads today may need re-conversion when the spec moves. The
  pinned IFC5 revision is documented in each release.
- **Mapping coverage will be incomplete.** IFC4 constructs without an
  IFC5 equivalent at conversion time degrade gracefully (logged
  warnings, or omitted) rather than blocking the whole conversion.
- **We follow upstream actively.** Changes to the IFC5 TypeSpec
  schema and the buildingSMART viewer are direct inputs to this work;
  we cannot freeze our understanding of the target.
- **We contribute to a buildingSMART roadmap gap.** Engaging upstream
  (IfcOpenShell discussion #7042 in particular) reduces the risk of
  diverging from where the official converter eventually lands.
