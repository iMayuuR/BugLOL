/**
 * @param {import('vscode').ExtensionContext} context
 */
function activate(context) {
    console.log('Congratulations, your extension "error-sound-effect" is now active!');

    const soundManager = require('./soundManager.js');
    soundManager.registerSelectSoundCommand(context);
    soundManager.checkInitialSoundState(context);

    require('./errorSound.js').activate(context);
}

function deactivate() { }

module.exports = {
    activate,
    deactivate
};
