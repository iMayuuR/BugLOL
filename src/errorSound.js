const vscode = require('vscode');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

/** @type {import('child_process').ChildProcess | null} */
let audioProcess = null;
let isReady = false;
let pendingPlay = null;

/**
 * Spawns the persistent background PowerShell audio player.
 * The .NET MediaPlayer is loaded ONCE — subsequent plays are near-instant.
 * @param {vscode.ExtensionContext} context
 */
function spawnAudioProcess(context) {
    if (audioProcess && !audioProcess.killed) return;

    const psScriptPath = path.join(context.extensionPath, 'playAudio.ps1');
    isReady = false;

    audioProcess = spawn('powershell', [
        '-ExecutionPolicy', 'Bypass',
        '-NoProfile',
        '-File', psScriptPath
    ], {
        stdio: ['pipe', 'pipe', 'pipe'],
        windowsHide: true
    });

    audioProcess.stdout.on('data', (data) => {
        const msg = data.toString().trim();
        if (msg === 'READY') {
            isReady = true;
            console.log('[BugLOL] Audio player ready (background process)');
            // If a sound was requested before ready, play it now
            if (pendingPlay) {
                sendPlayCommand(pendingPlay);
                pendingPlay = null;
            }
        }
    });

    audioProcess.stderr.on('data', (data) => {
        console.error(`[BugLOL] Audio error: ${data.toString().trim()}`);
    });

    audioProcess.on('close', (code) => {
        console.log(`[BugLOL] Audio process exited with code ${code}`);
        audioProcess = null;
        isReady = false;
    });

    audioProcess.on('error', (err) => {
        console.error(`[BugLOL] Failed to spawn audio process: ${err.message}`);
        audioProcess = null;
        isReady = false;
    });
}

/**
 * Sends a file path to the persistent audio process for playback.
 * @param {string} soundPath
 */
function sendPlayCommand(soundPath) {
    if (!audioProcess || audioProcess.killed || !audioProcess.stdin.writable) {
        console.warn('[BugLOL] Audio process not available');
        return;
    }
    audioProcess.stdin.write(soundPath + '\n');
}

/**
 * Plays the selected error sound with minimal latency.
 * @param {vscode.ExtensionContext} context
 */
function playSound(context) {
    const config = vscode.workspace.getConfiguration('errorSoundEffect');
    const selectedSoundFile = config.get('selectedSoundFilename', '');

    if (!selectedSoundFile) return;

    const soundPath = path.join(context.globalStorageUri.fsPath, selectedSoundFile);

    if (!fs.existsSync(soundPath)) {
        console.warn(`[BugLOL] Sound file not found: ${soundPath}`);
        return;
    }

    // Respawn if process died
    if (!audioProcess || audioProcess.killed) {
        spawnAudioProcess(context);
    }

    if (isReady) {
        sendPlayCommand(soundPath);
    } else {
        // Queue it — will play as soon as process is ready
        pendingPlay = soundPath;
    }
}

/**
 * Activates error sound monitoring.
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    let lastErrorCount = 0;

    // Pre-spawn the audio process on activation for instant readiness
    if (process.platform === 'win32') {
        spawnAudioProcess(context);
    }

    // Listen to changes in diagnostics (problems panel)
    const diagnosticsDisposable = vscode.languages.onDidChangeDiagnostics((e) => {
        let currentErrorCount = 0;

        vscode.languages.getDiagnostics().forEach(([uri, diagnostics]) => {
            const errorDiagnostics = diagnostics.filter(
                (d) => d.severity === vscode.DiagnosticSeverity.Error
            );
            currentErrorCount += errorDiagnostics.length;
        });

        // If the number of errors increased, play the sound
        if (currentErrorCount > lastErrorCount) {
            playSound(context);
        }

        lastErrorCount = currentErrorCount;
    });

    context.subscriptions.push(diagnosticsDisposable);

    // Cleanup on deactivation
    context.subscriptions.push({
        dispose: () => {
            if (audioProcess && !audioProcess.killed) {
                try {
                    audioProcess.stdin.write('EXIT\n');
                    audioProcess.kill();
                } catch (e) {
                    // ignore
                }
            }
        }
    });
}

module.exports = { activate };
