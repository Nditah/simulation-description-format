import * as vscode from 'vscode';
export declare class SDFDiagnosticProvider {
    private sdfSchema;
    updateDiagnostics(document: vscode.TextDocument, collection: vscode.DiagnosticCollection): void;
    private checkXmlSyntax;
    private checkSdfStructure;
    private checkRequiredAttributes;
    private checkValidValues;
}
//# sourceMappingURL=diagnosticProvider.d.ts.map