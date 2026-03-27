---
name: telegram-media
description: Send images or media to Telegram via CLI when direct attachment fails. Use when you need to send an image from the workspace to a Telegram user or group.
---

# Telegram Media Sender

When direct attachment through chat sessions fails, use the OpenClaw CLI to send media files directly.

## Step 1 — Find the Target ID

The target ID is the numeric Telegram user ID or group chat ID. You MUST find it before sending.

**How to find it:** Read the file `~/.openclaw/openclaw.json` and look under `channels.telegram`:

- **For DMs**: The user IDs are listed in `channels.telegram.allowFrom` (e.g., `[1284487761]`). Use the numeric ID from this array.
- **For groups**: The group chat IDs are the keys under `channels.telegram.groups` (e.g., `"-1001234567890"`). Use the negative numeric ID.

Example — read the config to get the target ID:
```bash
cat ~/.openclaw/openclaw.json
```
Then look for `channels.telegram.allowFrom` (for DMs) or `channels.telegram.groups` (for groups) and extract the numeric ID.

## Step 2 — Send the Media

Use the `openclaw message send` command with the `--media` flag:

```bash
openclaw message send --channel telegram --target <target-id> --media <path-to-file> --message "Optional caption"
```

### Parameters

- `--channel telegram`: Specifies Telegram as the delivery channel.
- `--target <target-id>`: The numeric ID from Step 1 (e.g., `1284487761` for a DM, or `-1001234567890` for a group).
- `--media <path-to-file>`: The full absolute path to the file in the workspace (e.g., `/Users/boonkgim/.openclaw/workspace/cat.png`).
- `--message "..."`: (Optional) A caption for the image.

### Complete Example

```bash
# 1. Find the target ID from config
cat ~/.openclaw/openclaw.json
# Look at channels.telegram.allowFrom → e.g., [1284487761]

# 2. Send the image
openclaw message send --channel telegram --target 1284487761 --media /Users/boonkgim/.openclaw/workspace/cat.png --message "Here is your image!"
```

### Important Notes

- **File Path**: Use absolute paths for the media file to ensure the CLI can locate it regardless of the current working directory.
- **Target ID**: Always read it from `~/.openclaw/openclaw.json` — do not guess or hardcode.
- **Troubleshooting**: If the command hangs, use `process poll` or `process log` to monitor the sending progress.
