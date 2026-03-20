---
name: telegram-media
description: Send images or media to Telegram via CLI when direct attachment fails. Use when you need to send an image from the workspace to a Telegram user or group.
---

# Telegram Media Sender

When direct attachment through chat sessions fails, use the OpenClaw CLI to send media files directly.

## Usage

Use the `openclaw message send` command with the `--media` flag:

```bash
openclaw message send --channel telegram --target <target-id> --media <path-to-file> --message "Optional caption"
```

### Parameters

- `--channel telegram`: Specifies Telegram as the delivery channel.
- `--target <target-id>`: The recipient (user ID or chat ID).
- `--media <path-to-file>`: The full absolute path to the file in the workspace (e.g., `/Users/boonkgim/.openclaw/workspace/cat.png`).
- `--message "..."`: (Optional) A caption for the image.

### Important Notes

- **File Path**: Use absolute paths for the media file to ensure the CLI can locate it regardless of the current working directory.
- **Target ID**: Use the recipient's numeric Telegram user ID or chat ID.
- **Troubleshooting**: If the command hangs, use `process poll` or `process log` to monitor the sending progress.
