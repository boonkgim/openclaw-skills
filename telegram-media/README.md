# telegram-media

An [OpenClaw](https://github.com/boonkgim/openclaw-installer) skill that sends images or media to Telegram via CLI when direct attachment fails.

## Usage

Use the `openclaw message send` command with the `--media` flag:

```bash
openclaw message send --channel telegram --target <target-id> --media <path-to-file> --message "Optional caption"
```

### Parameters

| Flag | Description |
|------|-------------|
| `--channel telegram` | Specifies Telegram as the delivery channel |
| `--target <target-id>` | Recipient's numeric Telegram user ID or chat ID |
| `--media <path-to-file>` | Absolute path to the media file |
| `--message "..."` | *(Optional)* Caption for the image |

### Example

```bash
openclaw message send --channel telegram --target 123456789 --media /Users/me/.openclaw/workspace/cat.png --message "Here's your image!"
```

### Notes

- Use absolute paths for the media file to ensure the CLI can locate it.
- Use the recipient's numeric Telegram user ID or chat ID as the target.
- If the command hangs, use `process poll` or `process log` to monitor progress.

## License

MIT
