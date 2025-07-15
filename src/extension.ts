import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    console.log('SDF Language Support extension is now active!');
    
    // Register any providers here (completion, hover, etc.)
    // Example: Language server or basic language features
}

export function deactivate() {
    // Cleanup when extension is deactivated
}