# telegram-media

An [OpenClaw](https://github.com/boonkgim/openclaw-installer) skill that sends images or media to Telegram via CLI when direct attachment fails.

## Step 1 — Find the Target ID

The target ID is the numeric Telegram user ID or group chat ID. Read it from `~/.openclaw/openclaw.json`:

- **For DMs**: Look at `channels.telegram.allowFrom` — it contains an array of allowed user IDs (e.g., `[1284487761]`).
- **For groups**: Look at `channels.telegram.groups` — the keys are group chat IDs (e.g., `"-1001234567890"`).

```bash
cat ~/.openclaw/openclaw.json
# Find channels.telegram.allowFrom or channels.telegram.groups
```

## Step 2 — Send the Media

```bash
openclaw message send --channel telegram --target <target-id> --media <path-to-file> --message "Optional caption"
```

### Parameters

| Flag | Description |
|------|-------------|
| `--channel telegram` | Specifies Telegram as the delivery channel |
| `--target <target-id>` | Numeric ID from Step 1 (e.g., `1284487761` for DM, `-1001234567890` for group) |
| `--media <path-to-file>` | Absolute path to the media file |
| `--message "..."` | *(Optional)* Caption for the image |

### Complete Example

```bash
# 1. Read config to find target ID
cat ~/.openclaw/openclaw.json
# → channels.telegram.allowFrom: [1284487761]

# 2. Send the image using that ID
openclaw message send --channel telegram --target 1284487761 --media /Users/me/.openclaw/workspace/cat.png --message "Here's your image!"
```

### Notes

- Use absolute paths for the media file to ensure the CLI can locate it.
- Always read the target ID from `~/.openclaw/openclaw.json` — do not guess or hardcode.
- If the command hangs, use `process poll` or `process log` to monitor progress.

## License

MIT
