import * as vscode from 'vscode';
export declare class SDFDiagnosticProvider {
    private diagnosticCollection;
    constructor();
    updateDiagnostics(document: vscode.TextDocument, collection: vscode.DiagnosticCollection): void;
    private validateXMLStructure;
    private validateSDFSchema;
    private validateRequiredAttributes;
    private validateJointTypes;
    private validateNestingRules;
    dispose(): void;
}
//# sourceMappingURL=diagnosticProvider.d.ts.map