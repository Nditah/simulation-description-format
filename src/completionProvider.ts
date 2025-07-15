import * as vscode from 'vscode';

export class SDFCompletionProvider implements vscode.CompletionItemProvider {
    private sdfElements = [
        'sdf', 'world', 'model', 'link', 'joint', 'visual', 'collision', 
        'geometry', 'box', 'sphere', 'cylinder', 'pose', 'mass'
    ];

    provideCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position,
        _token: vscode.CancellationToken,
        _context: vscode.CompletionContext
    ): vscode.CompletionItem[] {
        const line = document.lineAt(position);
        const lineText = line.text;
        const beforeCursor = lineText.substring(0, position.character);

        // Tag completion
        if (beforeCursor.endsWith('<')) {
            return this.sdfElements.map(element => {
                const item = new vscode.CompletionItem(element, vscode.CompletionItemKind.Class);
                item.insertText = `${element}>$0</${element}>`;
                return item;
            });
        }

        return [];
    }
}