---
name: paste-image
description: Save the user's current Windows clipboard image to a temp file, read it into context, then delete the temp file. Use when the user wants to share a screenshot or clipboard image in the terminal CLI (e.g. "here's a screenshot", "paste image", "look at my clipboard", "see what I copied"), since direct paste does not work in the Windows terminal.
---

# Paste Image

Pulls clipboard image → reads it → deletes the temp file.

## Steps

1. **Save** (Bash tool):
   ```bash
   powershell.exe -NoProfile -Command '$p=Join-Path $env:TEMP "cc-clip.png"; (Get-Clipboard -Format Image).Save($p); Write-Output $p'
   ```
   Stdout is the absolute path.

2. **Read** that path with the Read tool. Image is now in context.

3. **Delete** (Bash tool) — always run, even if Read failed:
   ```bash
   powershell.exe -NoProfile -Command 'Remove-Item (Join-Path $env:TEMP "cc-clip.png") -ErrorAction SilentlyContinue'
   ```

## Errors

- `You cannot call a method on a null-valued expression` → clipboard has no image. Tell the user, stop.
