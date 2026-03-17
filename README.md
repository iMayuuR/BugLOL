# 🚨 BugLOL - 100K+ Error Sound Effects  for VS Code, Antigravity, Cursor & More

Turn your frustrating debugging sessions into instant comedy! **BugLOL** automatically plays a trending meme sound whenever your code hits an error.

<p align="center">
  <strong>Publisher:</strong> <a href="https://github.com/iMayuuR">iMayuuR</a> ·
  <strong>Namespace:</strong> <code>iMayuuR</code> ·
  <strong>Version:</strong> <code>1.3.7</code> ·
  <strong>License:</strong> MIT
</p>

<p align="center">
  <a href="https://marketplace.visualstudio.com/items?itemName=iMayuuR.error-sound-effect">🛒 VS Code Marketplace</a> ·
  <a href="https://open-vsx.org/extension/iMayuuR/error-sound-effect">📦 Open VSX</a> ·
  <a href="https://github.com/iMayuuR/BugLOL">⭐ GitHub</a> ·
  <a href="https://github.com/iMayuuR/BugLOL/issues">🐛 Report Bug</a>
</p>

---

## 🖥️ Compatible IDEs

BugLOL is available on **both** major extension registries:

| IDE | Registry | Install |
|---|---|---|
| **VS Code** | Microsoft Marketplace | [Install →](https://marketplace.visualstudio.com/items?itemName=iMayuuR.error-sound-effect) |
| **Cursor** | Microsoft Marketplace / `.vsix` | [Install →](https://marketplace.visualstudio.com/items?itemName=iMayuuR.error-sound-effect) |
| **Windsurf** (by Codeium) | Open VSX | [Install →](https://open-vsx.org/extension/iMayuuR/error-sound-effect) |
| **VSCodium** | Open VSX | [Install →](https://open-vsx.org/extension/iMayuuR/error-sound-effect) |
| **Gitpod** | Open VSX | Auto-available via Open VSX |
| **Eclipse Theia** | Open VSX | Auto-available via Open VSX |
| **code-server** (Coder) | Open VSX | Auto-available via Open VSX |
| **Code - OSS** | Open VSX | Auto-available via Open VSX |

> 💡 Any editor that supports the VS Code extension API and uses Open VSX or the Microsoft Marketplace can install BugLOL.

---

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

1. **Install** from the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=iMayuuR.error-sound-effect) or [Open VSX](https://open-vsx.org/extension/iMayuuR/error-sound-effect).
2. A **welcome notification** appears — click `🔍 Search Sounds` to pick your first sound.
3. Or click the **🔊 BugLOL** button in the bottom status bar anytime.
4. Or press **`Ctrl+Shift+M`** to open the sound search instantly.
5. Or open Command Palette (`Ctrl+Shift+P`) → type **`BugLOL: Search Sounds`**.
6. Write some buggy code and enjoy the show! 🎉

## 🎮 How It Works

BugLOL watches your editor's diagnostics in real-time. Every time a **new error** appears in your code, it plays your selected sound effect. The more bugs you write, the more fun you have!

## ⚙️ Settings

| Setting | Description | Default |
|---|---|---|
| `errorSoundEffect.selectedSoundName` | The currently selected sound name | `Fahhh` |
| `errorSoundEffect.selectedSoundFilename` | The downloaded MP3 filename | `fahhh_KcgAXfs.mp3` |

---

## 💻 Platform Support

| Platform | Audio Engine | Setup Required? |
|---|---|---|
| 🪟 **Windows** (XP / 7 / 10 / 11) | `wscript.exe` + Windows Media Player | ✅ None |
| 🍎 **macOS** (From ancient Leopard to latest Sequoia 15+) | `afplay` (built-in) | ✅ None |
| 🐧 **Linux** | `mpg123` / `ffplay` / `paplay` | ⚠️ See below |

### 🐧 Linux Audio Setup

BugLOL tries the following audio players in order. Install at least one:

**Option 1 — mpg123** (recommended, lightest):
```bash
# Ubuntu / Debian
sudo apt install mpg123

# Fedora / RHEL
sudo dnf install mpg123

# Arch Linux
sudo pacman -S mpg123
```

**Option 2 — ffplay** (if you already have ffmpeg):
```bash
# Ubuntu / Debian
sudo apt install ffmpeg

# Fedora
sudo dnf install ffmpeg

# Arch
sudo pacman -S ffmpeg
```

**Option 3 — paplay** (PulseAudio — usually pre-installed on Ubuntu/GNOME):
```bash
# Typically already available — check with:
which paplay
```

> 💡 **Tip:** After installing, reload your editor once (`Ctrl+Shift+P` → `Developer: Reload Window`).

---

## 🚫🔊 Troubleshooting — No Sound?

**1. No sound file selected yet**
- Click the **BugLOL** button (bottom status bar) → search and select a sound first.

**2. Sound file not downloaded**
- Select a sound again from the BugLOL panel — it will re-download automatically.

**3. Windows — Windows Media Player disabled**
- Open `Optional Features` in Windows Settings → enable **Windows Media Player**.

**4. Linux — no audio player installed**
- Run `sudo apt install mpg123` (or see Linux setup above).

**5. No errors in the Problems panel**
- BugLOL triggers on **diagnostics errors** (red underlines), not warnings. Make sure actual errors exist.

**6. Extension not activating**
- Open Command Palette → `Developer: Show Extension Host Log` → check for `[BugLOL]` entries.
- Try reloading: `Ctrl+Shift+P` → `Developer: Reload Window`.

---

## 📋 Changelog

### v1.3.5 — Cross-Platform & Stability
- 🪟 **Windows**: Removed PowerShell entirely — uses `wscript.exe` + VBScript. Works on all Windows versions with zero execution policy issues.
- 🍎 **macOS**: Full support via `afplay` (built-in, Leopard to Sequoia)
- 🐧 **Linux**: `mpg123` → `ffplay` → `paplay` fallback chain
- 🛡️ Crash-safe activation — one failing module no longer kills the whole extension
- ⏱️ Debounced diagnostics — prevents sound spam when multiple files error simultaneously

### v1.3.0 — Initial Public Release
- 🎵 100k+ sound search via myinstants.com
- 🔊 Status bar button + keyboard shortcut (`Ctrl+Shift+M`)
- 💀 Terminal error detection (VS Code 1.93+)
- 📦 Zero-bloat architecture — caches only your selected sound

---

## 🛠️ Development

To test the extension locally:

1. Open this repository in VS Code.
2. Press `F5` to open the Extension Development Host.
3. Write some intentionally broken code and watch the magic happen!

## 📄 License

MIT — see [LICENSE](LICENSE) for details.

## 🤖 Credits

- **🔊 Sound Effects** — All 100,000+ sound effects are sourced from **[Myinstants.com](https://www.myinstants.com/)**, the largest instant sound buttons website on the internet. BugLOL searches, streams, and caches sounds from their platform. Huge thanks to the Myinstants team and their community of creators for making this possible! 🙏
- **🤖 Built with [Antigravity](https://deepmind.google/) AI** — the agentic coding assistant by Google DeepMind that helped craft, debug, and ship every line of this extension. 💙

## ⚠️ Disclaimer

This extension does not host, distribute, or claim ownership of any audio files. All sounds are user-generated content fetched dynamically from [Myinstants.com](https://www.myinstants.com/). Copyrights for individual sound clips belong to their original creators/uploaders. Myinstants.com is an independent platform and is not affiliated with BugLOL.
