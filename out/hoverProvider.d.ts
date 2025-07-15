import * as vscode from 'vscode';
export declare class SDFHoverProvider implements vscode.HoverProvider {
    provideHover(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): vscode.Hover | undefined;
    private getElementHover;
    private getAttributeHover;
    private getElementDocumentation;
    private getAttributeDocumentation;
}
//# sourceMappingURL=hoverProvider.d.ts.map