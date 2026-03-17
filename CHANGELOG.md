# Changelog

All notable changes to BugLOL will be documented in this file.

## [1.3.7] - 2026-03-18

### ✨ Updates
- **Brand Update**: Renamed extension to **BugLOL - 100K+ Error Sound Effects** for improved clarity and SEO.
- **Credits**: Added proper attribution to [Myinstants.com](https://www.myinstants.com/) as the source of all 100K+ sound effects.

## [1.3.0] - 2026-03-04

### 💀 New Feature
- **Terminal Error Detection** — Sound plays when a terminal command fails (non-zero exit code). Wrong command = instant meme sound!
- Requires VS Code 1.93+ (uses Shell Integration API).

## [1.2.0] - 2026-03-03

### ⚡ Performance
- **Near-instant sound playback** — Persistent background audio process eliminates ~400-800ms delay. Sound now plays within ~30-50ms of error detection.
- Pre-spawned PowerShell process with .NET MediaPlayer loaded once on activation.
- Auto-respawn if background process dies unexpectedly.

## [1.1.0] - 2026-03-03

### ✨ New Features
- **🔊 Status Bar Button** — Persistent "BugLOL" button in the status bar for one-click sound search.
- **🎉 Welcome Notification** — First-install welcome toast with "Search Sounds" action.
- **⌨️ Keyboard Shortcut** — `Ctrl+Shift+M` / `Cmd+Shift+M` to instantly open sound search.
- Updated command title to "BugLOL: Search Sounds 🎵".

## [1.0.0] - 2026-03-03

### 🚀 Initial Release
- Plays a meme sound effect when your code hits an error.
- Search through 100k+ sounds from a massive online database.
- Trending sounds shown by default.
- Live search with debounced API calls.
- Downloads and caches only the selected sound.
- Full-length audio playback — no cut-offs.
