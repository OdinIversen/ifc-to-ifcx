# syntax=docker/dockerfile:1.4
#
# Neutral sandcastle agent image. Consumers extend this for project-specific
# deps (CUDA torch, ML libraries, system packages, etc.). The orchestration
# loop rebuilds this image when any triggerFile in .sandcastle/main.mts is
# newer than the image.

FROM node:22-bookworm

# System deps. python3 is included as a baseline so a consumer can `pip
# install` in onSandboxReady without modifying this file; drop it if your
# project is pure-Node.
RUN apt-get update && apt-get install -y \
  git \
  curl \
  jq \
  python3 \
  python3-pip \
  python3-venv \
  && rm -rf /var/lib/apt/lists/*

# GitHub CLI — agents use it for PR/issue operations.
RUN curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg \
  | dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg \
  && echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" \
  | tee /etc/apt/sources.list.d/github-cli.list > /dev/null \
  && apt-get update && apt-get install -y gh \
  && rm -rf /var/lib/apt/lists/*

# Rename node:22's default user (UID 1000) to "agent". Keeping UID 1000 means
# --userns=keep-id (Podman) and --user 1000:1000 (Docker) map worktree
# ownership correctly.
RUN usermod -d /home/agent -m -l agent node
USER agent

# Claude Code CLI — installs into /home/agent/.local/bin.
RUN curl -fsSL https://claude.ai/install.sh | bash

# /usr/local/cc-shim takes precedence so the kit's rate-limit shim wraps the
# real claude binary. The shim captures rate_limit_event records from
# stream-json stdout and writes them to /tmp/claude-rate-limit.json, which
# the host's UsagePoller reads via `docker exec cat`.
ENV PATH="/usr/local/cc-shim:/home/agent/.local/bin:$PATH"

USER root
COPY node_modules/claude-code-kit/src/cc-rate-limit-shim /usr/local/cc-shim/claude
RUN chmod +x /usr/local/cc-shim/claude
USER agent

WORKDIR /home/agent

# Sandcastle bind-mounts the git worktree at /home/agent/workspace and sets
# that as the working directory at container start.
ENTRYPOINT ["sleep", "infinity"]
