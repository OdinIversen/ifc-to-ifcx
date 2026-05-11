# 2. Python + PySide6 + PyInstaller for the Windows desktop app

Date: 2026-05-11

## Status

Accepted

## Context

The goal (see `GOALS.md`) is a Windows-only desktop tool that converts
IFC4 STEP files to IFC5/IFCX, with a drag-and-drop GUI, runnable by a
non-developer with no terminal use.

Two stack-relevant facts:

- **IFC4 parsing is a solved Python problem.** IfcOpenShell is the
  canonical open-source IFC4 STEP parser and ships as a Python library.
  Rewriting the parser ourselves would be wasted work.
- **IFC5/IFCX serialisation is plain JSON.** It is easy to emit from
  any language; there is no library to wrap on the output side
  (because none exists yet — see ADR-0003).

So the constraints reduce to: pick a language that has IfcOpenShell
bindings, and a GUI framework that gives us native drag-and-drop on
Windows, threaded background work, and a clean packaging story for
non-developer distribution.

Alternatives considered:

- **Python + customtkinter + PyInstaller.** Same packaging story.
  Lighter, but the UI is noticeably less native on Windows and drag-
  and-drop support is awkward.
- **Tauri or Electron frontend + Python subprocess.** Introduces a
  second language, subprocess lifecycle management, and cross-process
  error/progress marshalling. Overkill for the scope. (Note: the
  IFC5 ecosystem itself leans TypeScript — `ifcx-cli` and the viewer
  are TS — but emitting IFCX is JSON construction, which Python does
  fine, so the ecosystem alignment is not a strong pull.)
- **.NET (WinUI / WPF) + Python subprocess.** Best native Windows feel,
  but the most code to write and an additional toolchain. Overkill.
- **TypeScript + web-ifc.** Single-language stack matching the IFC5
  ecosystem. Rejected because `web-ifc` is less mature than IfcOpenShell
  for IFC4 parsing — and IFC4 parsing is the input-side foundation of
  this project. Re-evaluate if the IFC5 mapping work grows large enough
  to dominate the codebase.

## Decision

Build the desktop app in **Python with PySide6** as the GUI toolkit,
packaged for distribution with **PyInstaller**.

- One language end-to-end. IfcOpenShell parses IFC4 in-process; the
  IFC4 → IFC5 mapping runs in the same Python module; the IFCX
  serialiser writes JSON. No cross-process bridge.
- PySide6 (Qt) provides native-feeling drag-and-drop, file dialogs,
  threading primitives, and acceptable out-of-the-box look on Windows.
- PyInstaller bundles the interpreter, IfcOpenShell, and the GUI into
  a single `.exe` (or one-folder distribution). Well-trodden path for
  academic Python tools.

## Consequences

- Contributors need Python, not Node, for runtime work.
- Bundle size will be large (estimated 100–300 MB) because the Python
  interpreter, PySide6, and IfcOpenShell are all bundled. Acceptable
  for an offline desktop tool.
- We must verify early that IfcOpenShell's Windows wheel bundles
  cleanly through PyInstaller. If it does not, we revisit bundling
  strategy (e.g. include a separate Python runtime).
- Without a code-signing certificate, the distributed `.exe` will
  trigger a Windows SmartScreen warning on first run. Acceptable for
  the first user; signing becomes a real cost if distribution widens.
- Cross-platform is not free: porting to macOS / Linux later would
  still use the same stack, but each platform brings its own
  packaging and signing concerns.
- If the IFC4 → IFC5 mapping work later proves dominant and we want
  to align with the IFC5 community's TypeScript tooling (`ifcx-cli`,
  the viewer), we may revisit this decision.
