import * as vscode from 'vscode';
export declare class SDFCompletionProvider implements vscode.CompletionItemProvider {
    private sdfElements;
    provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, _token: vscode.CancellationToken, _context: vscode.CompletionContext): vscode.CompletionItem[];
}
//# sourceMappingURL=completionProvider.d.ts.map