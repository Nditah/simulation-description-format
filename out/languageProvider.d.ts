import * as vscode from 'vscode';
import { SDFSchemaProvider } from './sdfSchema';
export declare class SDFLanguageProvider {
    static readonly SDF_SCHEMA: import("./sdfSchema").SDFSchema;
    static readonly SDF_LANGUAGE_ID = "sdf";
    static readonly SDF_FILE_EXTENSIONS: string[];
    static isSDFDocument(document: vscode.TextDocument): boolean;
    static getSDFDocuments(): vscode.TextDocument[];
    static getDocumentSelector(): vscode.DocumentSelector;
    static getParentTagContext(document: vscode.TextDocument, position: vscode.Position): string | null;
    static extractTagName: typeof SDFSchemaProvider.extractTagName;
    static isOpeningTag: typeof SDFSchemaProvider.isOpeningTag;
    static isClosingTag: typeof SDFSchemaProvider.isClosingTag;
    static isSelfClosingTag: typeof SDFSchemaProvider.isSelfClosingTag;
    static getRequiredAttributes: typeof SDFSchemaProvider.getRequiredAttributes;
    static getValidChildren: typeof SDFSchemaProvider.getValidChildren;
}
//# sourceMappingURL=languageProvider.d.ts.map