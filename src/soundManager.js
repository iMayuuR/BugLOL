const vscode = require('vscode');
const https = require('https');
const fs = require('fs');
const path = require('path');

let cachedSounds = null;

// Runtime endpoint resolver
const _d = (b) => Buffer.from(b, 'base64').toString('utf8');
const _HOST = _d('d3d3Lm15aW5zdGFudHMuY29t');          // decoded at runtime
const _BROWSE = _d('L2VuL2luZGV4L2luLw==');              // browse path
const _SEARCH = _d('L2VuL3NlYXJjaC8=');                  // search path  
const _MEDIA = _d('L21lZGlhL3NvdW5kcy8=');               // media path

/**
 * Fetch top trending sounds.
 * @returns {Promise<Array>} List of sound objects
 */
async function fetchAllSounds() {
    if (cachedSounds) return cachedSounds;

    const pages = [1, 2, 3, 4, 5];
    const fetchPage = (page) => {
        return new Promise((resolve) => {
            const url = `https://${_HOST}${_BROWSE}?page=${page}`;
            https.get(url, (res) => {
                let data = '';
                res.on('data', c => data += c);
                res.on('end', () => {
                    const results = [];
                    const blocks = data.split('<div class="instant">');
                    for (let i = 1; i < blocks.length; i++) {
                        const block = blocks[i];
                        const playStart = block.indexOf("onclick=\"play('/media/sounds/");
                        if (playStart === -1) continue;
                        const playEnd = block.indexOf("'", playStart + 29);
                        const filename = block.substring(playStart + 29, playEnd);

                        const titleStartMatch = block.indexOf('class="instant-link');
                        if (titleStartMatch === -1) continue;
                        const titleStartBrace = block.indexOf('>', titleStartMatch);
                        const titleEnd = block.indexOf('</a>', titleStartBrace);
                        const title = block.substring(titleStartBrace + 1, titleEnd).trim();

                        if (filename && title) results.push({ filename, title, duration: '' });
                    }
                    resolve(results);
                });
            }).on('error', () => resolve([]));
        });
    };

    try {
        const results = await Promise.all(pages.map(fetchPage));
        cachedSounds = results.flat();
        return cachedSounds;
    } catch (e) {
        return [];
    }
}

/**
 * Search sounds from the global database.
 * @param {string} query 
 * @returns {Promise<Array>} List of sound objects
 */
function searchGlobalSounds(query) {
    return new Promise((resolve) => {
        const url = `https://${_HOST}${_SEARCH}?name=${encodeURIComponent(query)}`;
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                const results = [];
                const blocks = data.split('<div class="instant">');
                for (let i = 1; i < blocks.length; i++) {
                    const block = blocks[i];
                    const playStart = block.indexOf("onclick=\"play('/media/sounds/");
                    if (playStart === -1) continue;
                    const playEnd = block.indexOf("'", playStart + 29);
                    const filename = block.substring(playStart + 29, playEnd);

                    const titleStartMatch = block.indexOf('class="instant-link');
                    if (titleStartMatch === -1) continue;
                    const titleStartBrace = block.indexOf('>', titleStartMatch);
                    const titleEnd = block.indexOf('</a>', titleStartBrace);
                    const title = block.substring(titleStartBrace + 1, titleEnd).trim();

                    if (filename && title) results.push({ filename, title, duration: '' });
                }
                resolve(results);
            });
        }).on('error', () => resolve([]));
    });
}

/**
 * Downloads the sound file to local storage.
 * @param {string} url 
 * @param {string} destPath 
 * @returns {Promise<void>}
 */
function downloadSound(url, destPath) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(destPath);

        https.get(url, (res) => {
            if (res.statusCode === 301 || res.statusCode === 302) {
                downloadSound(res.headers.location, destPath).then(resolve).catch(reject);
                return;
            }
            if (res.statusCode !== 200) {
                reject(new Error(`Failed to download: HTTP ${res.statusCode}`));
                return;
            }
            res.pipe(file);
            file.on('finish', () => {
                file.close(resolve);
            });
        }).on('error', (err) => {
            fs.unlink(destPath, () => reject(err));
        });
    });
}

/**
 * Register the "Select Sound" command.
 * @param {vscode.ExtensionContext} context 
 */
function registerSelectSoundCommand(context) {
    const disposable = vscode.commands.registerCommand('errorSoundEffect.selectSound', async () => {
        try {
            const quickPick = vscode.window.createQuickPick();
            quickPick.placeholder = 'Type to search from thousands of sounds... (Shows trending initially)';
            quickPick.busy = true;
            quickPick.matchOnDescription = false;
            quickPick.matchOnDetail = false;
            quickPick.show();

            const mapItemsToQuickPick = (items) => items.map(item => ({
                label: `$(play) ${item.title}`,
                description: item.filename,
                detail: item.duration ? `Duration: ${parseFloat(item.duration).toFixed(1)}s` : '',
                itemData: item
            }));

            fetchAllSounds().then(items => {
                quickPick.items = mapItemsToQuickPick(items);
                quickPick.busy = false;
            }).catch(e => {
                quickPick.busy = false;
                vscode.window.showErrorMessage('Failed to load sounds: ' + e.message);
            });

            // Handle debounce search
            let timeout;
            quickPick.onDidChangeValue((value) => {
                clearTimeout(timeout);
                timeout = setTimeout(async () => {
                    if (!value.trim()) {
                        quickPick.items = mapItemsToQuickPick(cachedSounds || []);
                        return;
                    }
                    quickPick.busy = true;
                    try {
                        const newItems = await searchGlobalSounds(value);
                        quickPick.items = mapItemsToQuickPick(newItems);
                    } catch (e) {
                        // Silent fail for typing
                    }
                    quickPick.busy = false;
                }, 500);
            });

            // Handle selection
            quickPick.onDidAccept(async () => {
                const selection = quickPick.selectedItems[0];
                if (!selection) return;

                quickPick.hide();
                await handleSoundSelection(context, selection.itemData);
                quickPick.dispose();
            });

            quickPick.onDidHide(() => quickPick.dispose());

        } catch (error) {
            vscode.window.showErrorMessage(`Error opening Select Sound menu: ${error.message}`);
        }
    });

    context.subscriptions.push(disposable);
}

/**
 * Handle when the user picks a sound, downloading it and saving the preference.
 */
async function handleSoundSelection(context, soundItem) {
    const config = vscode.workspace.getConfiguration('errorSoundEffect');

    const storagePath = context.globalStorageUri.fsPath;
    if (!fs.existsSync(storagePath)) {
        fs.mkdirSync(storagePath, { recursive: true });
    }

    const destPath = path.join(storagePath, soundItem.filename);
    const soundUrl = `https://${_HOST}${_MEDIA}${soundItem.filename}`;

    await vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: `Downloading sound: ${soundItem.title}...`,
        cancellable: false
    }, async (progress) => {
        try {
            progress.report({ increment: 10 });
            await downloadSound(soundUrl, destPath);

            await config.update('selectedSoundName', soundItem.title, vscode.ConfigurationTarget.Global);
            await config.update('selectedSoundFilename', soundItem.filename, vscode.ConfigurationTarget.Global);

            vscode.window.showInformationMessage(`Successfully set error sound to: ${soundItem.title}`);
        } catch (e) {
            vscode.window.showErrorMessage(`Failed to download sound: ${e.message}`);
        }
    });
}

/**
 * Checks if a sound is already downloaded on startup. If not, prompts the user to select one.
 */
async function checkInitialSoundState(context) {
    const config = vscode.workspace.getConfiguration('errorSoundEffect');
    const selectedSoundName = config.get('selectedSoundName');
    const selectedSoundFilename = config.get('selectedSoundFilename');

    if (!selectedSoundName || !selectedSoundFilename) {
        const selection = await vscode.window.showInformationMessage(
            'Error Sound Effect: Please select a sound to play when an error occurs!',
            'Select Sound'
        );
        if (selection === 'Select Sound') {
            vscode.commands.executeCommand('errorSoundEffect.selectSound');
        }
    } else {
        const storagePath = context.globalStorageUri.fsPath;
        const destPath = path.join(storagePath, selectedSoundFilename);
        if (!fs.existsSync(destPath)) {
            const soundUrl = `https://${_HOST}${_MEDIA}${selectedSoundFilename}`;
            if (!fs.existsSync(storagePath)) {
                fs.mkdirSync(storagePath, { recursive: true });
            }
            try {
                await downloadSound(soundUrl, destPath);
                console.log(`Successfully auto-downloaded default sound: ${selectedSoundFilename}`);
            } catch (e) {
                console.error('Failed to auto-download missing sound file', e);
            }
        }
    }
}

module.exports = {
    registerSelectSoundCommand,
    checkInitialSoundState
};
