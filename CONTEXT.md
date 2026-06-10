# Context

<!--
Domain glossary and current-state explanation. This is what the
`grill-with-docs` and `improve-codebase-architecture` skills read to
anchor their analysis. Scope and decisions belong in docs/adr/, not here.

Keep terms short and unambiguous. If a term means different things in
different parts of the code, that itself is worth documenting here so
agents (and future-you) don't conflate them.
-->

Domain glossary for ifc-to-ifcx, a Windows desktop tool that converts legacy
IFC4 STEP files to IFC5/IFCX for a non-developer user (scope and decisions:
`docs/adr/`).

## Domain glossary

- **IFC (Industry Foundation Classes)** — open data model maintained by
  buildingSMART for describing building and infrastructure objects
  across BIM tools. Multiple schema generations exist: IFC2x3, IFC4,
  IFC4.3, and the in-development IFC5.
- **IFC4 / EXPRESS** — the current stable IFC generation, defined in
  the EXPRESS schema language. Stored as a single monolithic file
  with numbered entity records. This is what the **input** files use.
- **STEP physical file (`.ifc`)** — the classic EXPRESS-encoded
  ASCII serialisation of IFC4 (and earlier). Plain text, sequential,
  numbered entity records like `#42 = IFCWALL(...)`. Our input format.
- **IFC5** — the **next-generation** IFC data model under development
  by buildingSMART. Currently **alpha**. Fundamentally different from
  IFC4: schema defined in TypeSpec (not EXPRESS), component-based,
  layered (USD-influenced), JSON-native. Not a reserialisation of
  IFC4 — a new data model.
- **IFCX** — the file/serialisation format for IFC5. JSON-based.
  Extension `.ifcx`. Our **output** format.
- **TypeSpec** — the schema language IFC5 is defined in (generates
  JSON Schema). Replaces EXPRESS for IFC5.
- **IFC4 → IFC5 conversion** — in this project, a schema-level
  translation, not a reserialisation. Each IFC4 entity must be
  mapped to an IFC5 component / layer construct. The mapping is
  project-original work because no canonical mapping or converter
  exists upstream.
- **IfcOpenShell** — open-source Python library that parses IFC4
  STEP files. Used here **only as the IFC4 parser**; it does not
  emit IFC5/IFCX, so the serialisation side is entirely project code.
- **buildingSMART IFC5 viewer** — the reference viewer at
  https://ifc5.technical.buildingsmart.org/viewer/ . The success
  criterion is "our IFCX output loads in this viewer".

## Current architecture

The repo is freshly scaffolded with `claude-code-kit` infrastructure
(`.sandcastle/`, agent skills, kit dep in `package.json`). No
conversion code yet.

Runtime stack: **Python + PySide6 + PyInstaller** (see ADR-0002).
The Node tooling in `package.json` is for agent orchestration only
and is not part of the shipped artifact.

The conversion pipeline, once built, will be:

```
.ifc (STEP, IFC4) ──► IfcOpenShell parser ──► IFC4 entity graph
                                                    │
                                                    ▼
                      project-original IFC4 → IFC5 mapping
                                                    │
                                                    ▼
                          IFC5 component / layer model
                                                    │
                                                    ▼
                                  IFCX (JSON) serialiser
                                                    │
                                                    ▼
                                              .ifcx output
```

## Open questions

- **The IFC4 → IFC5 entity mapping itself.** Which IFC4 entities map
  to which IFC5 components? Where IFC5 has no equivalent yet, do we
  omit, warn, or carry as opaque metadata? This is the project's hard
  problem.
- **Which IFC5 alpha revision do we target?** The spec is moving; we
  must pin a snapshot and document it.
- **Validation strategy.** Without a spec-level validator, how do we
  decide an IFCX file is "correct" beyond "loads in the viewer"?
- **Verify on Windows + chosen Python version that IfcOpenShell 0.8.2
  bundles cleanly through PyInstaller.**
