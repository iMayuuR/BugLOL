# 🚨 BugLOL — Error Sound Effect Extension for VS Code

Turn your frustrating debugging sessions into instant comedy! **BugLOL** automatically plays a trending meme sound whenever your code hits an error.

## ✨ Features

- **🎵 100k+ Sound Library** — Search through over 100,000 meme sounds and sound effects from a massive online database.
- **💀 Terminal Error Detection** — Wrong command in the terminal? Sound plays instantly! Works with any failed shell command.
- **🔊 One-Click Status Bar** — A persistent `BugLOL` button sits in your status bar. Click it anytime to search and change your error sound.
- **🎉 Instant Setup** — On first install, a welcome notification guides you to pick your sound immediately. No digging through menus.
- **⌨️ Keyboard Shortcut** — Press `Ctrl+Shift+M` (`Cmd+Shift+M` on Mac) to instantly open the sound search.
- **🔥 Trending Sounds** — Opens with the hottest trending regional memes by default.
- **🔍 Live Search** — Type to instantly search and discover new sounds from the global database.
- **🎧 Full Playback** — Plays the complete audio — no cut-offs!
- **📦 Zero Bloat** — Downloads and caches only the sound you select. No heavy audio files bundled.

## 🚀 Quick Start

1. **Install** the extension from the VS Code Marketplace.
2. A **welcome notification** appears — click `🔍 Search Sounds` to pick your first sound.
3. Or click the **🔊 BugLOL** button in the bottom status bar anytime.
4. Or press **`Ctrl+Shift+M`** to open the sound search instantly.
5. Or open Command Palette (`Ctrl+Shift+P`) → type **`BugLOL: Search Sounds`**.
6. Write some buggy code and enjoy the show! 🎉

## 🎮 How It Works

BugLOL watches your VS Code diagnostics in real-time. Every time a **new error** appears in your code, it plays your selected sound effect. The more bugs you write, the more fun you have!

## ⚙️ Settings

| Setting | Description | Default |
|---|---|---|
| `errorSoundEffect.selectedSoundName` | The currently selected sound name | `Fahhh` |
| `errorSoundEffect.selectedSoundFilename` | The downloaded MP3 filename | `fahhh_KcgAXfs.mp3` |

## 🛠️ Development

To test the extension locally:

1. Open this repository in VS Code.
2. Press `F5` to open the Extension Development Host.
3. Write some intentionally broken code and watch the magic happen!

## 📄 License

MIT — see [LICENSE](LICENSE) for details.

## ⚠️ Disclaimer

This extension does not host, distribute, or claim ownership of any audio files. All sounds are user-generated content fetched dynamically from public sources. Copyrights belong to their original creators/owners.
