const vscode = require('vscode');
const path = require('path');
const { exec } = require('child_process');

function activate(context) {
    let lastErrorCount = 0;

    // Listen to changes in diagnostics (problems panel)
    const diagnosticsDisposable = vscode.languages.onDidChangeDiagnostics((e) => {
        let currentErrorCount = 0;

        // Iterate through all URIs with diagnostics
        vscode.languages.getDiagnostics().forEach(([uri, diagnostics]) => {
            // Count diagnostics that have Error severity
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
}

function playSound(context) {
    const config = vscode.workspace.getConfiguration('errorSoundEffect');
    const selectedSoundFile = config.get('selectedSoundFilename', '');

    if (!selectedSoundFile) return;

    // Make sure we have the correct path to the requested sound
    const soundPath = path.join(context.globalStorageUri.fsPath, selectedSoundFile);

    const fs = require('fs');
    if (!fs.existsSync(soundPath)) {
        console.warn(`Sound file not found: ${soundPath}. Please wait for download or run 'Select Sound'.`);
        return;
    }

    // Play sound depending on OS. The user is on Windows.
    if (process.platform === 'win32') {
        const psScriptPath = path.join(context.extensionPath, 'playAudio.ps1');
        const command = `powershell -ExecutionPolicy Bypass -File "${psScriptPath}" "${soundPath}"`;
        exec(command, (error) => {
            if (error) {
                console.error(`Error playing sound: ${error.message}`);
            }
        });
    } else {
        // Fallbacks for other OSes although user is on Windows
        if (process.platform === 'darwin') {
            exec(`afplay "${soundPath}"`);
        } else if (process.platform === 'linux') {
            exec(`paplay "${soundPath}" || aplay "${soundPath}"`);
        }
    }
}

module.exports = { activate };
