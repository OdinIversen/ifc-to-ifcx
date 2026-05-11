// Thin wrapper — orchestration logic lives in claude-code-kit. Keep this
// file small and project-specific: image name, extra trigger files, the
// gitignored input dirs to copy into the worktree, and any onSandboxReady
// hooks needed to bootstrap the project's editable install.

import { runOrchestration } from "claude-code-kit";

declare const process: { argv: string[] };

const config = {
  imageName: "sandcastle:ifc-step-to-json",
  dockerfilePath: ".sandcastle/Dockerfile",
  // Files whose mtime triggers an image rebuild when newer than the image.
  // Add pyproject.toml, package.json, etc. once the project has them and
  // their contents should be baked into the image.
  triggerFiles: [
    ".sandcastle/Dockerfile",
    "node_modules/claude-code-kit/src/cc-rate-limit-shim",
  ],
  // node_modules: avoid a fresh `npm install` in every sandbox.
  // Add gitignored runtime inputs (data/, models/) the agents need —
  // sandcastle bind-mounts only the worktree, so anything not copied here is
  // invisible inside the container.
  copyToWorktree: ["node_modules"],
};

// Gate on `import.meta.url === file://${argv[1]}` so importing this module
// (e.g. an agent doing a parse smoke-test) does NOT execute the loop.
// Without this guard, a stray import inside an agent container would spawn
// a recursive planner.
const isMain =
  typeof import.meta.url === "string" &&
  typeof process.argv[1] === "string" &&
  import.meta.url === new URL(`file://${process.argv[1]}`).href;

if (isMain) {
  await runOrchestration(config);
}
