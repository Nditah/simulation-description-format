import * as vscode from 'vscode';
export declare class SDFCompletionProvider implements vscode.CompletionItemProvider {
    provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, _token: vscode.CancellationToken, context: vscode.CompletionContext): vscode.CompletionItem[];
    private getTagCompletions;
    private getAttributeCompletions;
    private getValueCompletions;
    private getRoboticsSnippets;
    private getParentTag;
    private isInOpeningTag;
    private getCurrentTagName;
    private isAttributeValue;
    private getElementDocumentation;
    private getAttributeDocumentation;
    private getJointTypeDocumentation;
    private getSensorTypeDocumentation;
}
//# sourceMappingURL=completionProvider.d.ts.map