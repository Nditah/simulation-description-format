import * as vscode from 'vscode';
export declare class SDFCompletionProvider implements vscode.CompletionItemProvider {
    private sdfElements;
    private attributeCompletions;
    provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext): vscode.CompletionItem[];
    private getElementCompletions;
    private getAttributeCompletions;
    private getJointTypeCompletions;
    private getSensorTypeCompletions;
    private getParentTag;
    private getElementDocumentation;
    private getAttributeDocumentation;
    private getJointTypeDocumentation;
    private getSensorTypeDocumentation;
}
//# sourceMappingURL=completionProvider.d.ts.map