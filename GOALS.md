# Goals

<!--
North-star design doc. Fill this in BEFORE writing any code.

Read it at the start of every session. When deciding what to work on,
check whether the candidate task moves you toward the Goal — or merely
toward something. Update this file as your understanding sharpens, but
never let it drift to match what the code happens to do.
-->

## Goal

A Windows desktop tool that lets a non-developer convert legacy IFC4
STEP files (`.ifc`) into **IFC5 / IFCX** files (the new JSON-based,
component-based, USD-influenced encoding under development by
buildingSMART). The first user is an academic with a folder of IFC4
STEP files who wants IFCX output that loads in the buildingSMART IFC5
viewer at https://ifc5.technical.buildingsmart.org/viewer/.

The conversion is **schema-level**, not just a reserialisation: IFC4
and IFC5 are different data models (IFC4 = EXPRESS, monolithic; IFC5 =
TypeSpec, layered/composed). At the time of writing, no IFC4 → IFC5
converter exists anywhere — this project is building the first one.

## Non-goals

- **Not cross-platform in v1.** Windows only. macOS / Linux later if
  there is demand.
- **Not a library, CLI, or server.** Desktop GUI only.
- **Not ifcJSON-4 / ifcJSON-5a output.** Those are JSON serialisations
  of IFC4 and are a different format than IFC5/IFCX. They will not
  load in the IFC5 viewer.
- **Not bidirectional.** IFCX → IFC4 STEP is out of scope.
- **Not a viewer, editor, or validator.** Conversion only. We surface
  parse and mapping errors; we do not implement IFC semantic checks.
- **Not waiting for vendor or community converters.** None exist; we
  are building this from scratch.

## Success criteria

- The professor can install the tool from a single downloaded artifact
  (no terminal, no Python install, no admin rights ideally) and convert
  his existing IFC4 STEP files to IFCX by dragging them into the window.
- A converted IFCX file **loads in the buildingSMART IFC5 viewer**
  at https://ifc5.technical.buildingsmart.org/viewer/ against the
  schema version current at the time of release.
- The tool accepts a **batch** of `.ifc` files. Conversion is per-file;
  a failure on one file does not stop the rest — the failed file is
  marked with the error in the result list and the remaining files
  still convert.
- Conversion runs on a worker thread; the UI does not freeze, and
  per-file progress is visible.
- TODO: define throughput / file-size targets once we benchmark on a
  representative IFC4 file.

## Caveats the professor must understand

- **IFC5 is alpha.** The schema, the IFCX format, and the viewer are
  all under active development and will change. A file that converts
  and loads today may need re-conversion in a few months when the
  spec moves.
- **The IFC4 → IFC5 entity mapping is project-original work.** Some
  IFC4 constructs will not have a clean IFC5 equivalent at first;
  these will degrade gracefully (logged as warnings) or be omitted.
- **No precedent to validate against.** Output correctness is judged
  by "loads in the viewer + visually matches the source" until a
  spec-level validator exists.
