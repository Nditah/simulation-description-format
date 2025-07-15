import * as vscode from 'vscode';
import { SDFSchemaProvider } from './sdfSchema';

export class SDFLanguageProvider {
    // Re-export the schema for backward compatibility
    static readonly SDF_SCHEMA = SDFSchemaProvider.SDF_SCHEMA;
    static readonly SDF_LANGUAGE_ID = SDFSchemaProvider.SDF_LANGUAGE_ID;
    static readonly SDF_FILE_EXTENSIONS = SDFSchemaProvider.SDF_FILE_EXTENSIONS;

    // VS Code specific methods
    static isSDFDocument(document: vscode.TextDocument): boolean {
        return SDFSchemaProvider.isSDFLanguage(document.languageId) || 
               SDFSchemaProvider.isSDFFile(document.fileName);
    }
    
    static getSDFDocuments(): vscode.TextDocument[] {
        return vscode.workspace.textDocuments.filter(doc => this.isSDFDocument(doc));
    }

    static getDocumentSelector(): vscode.DocumentSelector {
        return [
            { scheme: 'file', language: this.SDF_LANGUAGE_ID },
            { scheme: 'file', pattern: '**/*.sdf' },
            { scheme: 'file', pattern: '**/*.world' }
        ];
    }

    // Get parent tag context for completion/validation
    static getParentTagContext(document: vscode.TextDocument, position: vscode.Position): string | null {
        const text = document.getText(new vscode.Range(0, 0, position.line, position.character));
        const tagMatches = Array.from(text.matchAll(/<\/?(\w+)[^>]*>/g));
        
        const stack: string[] = [];
        for (const match of tagMatches) {
            const fullTag = match[0];
            const tagName = match[1];
            
            if (SDFSchemaProvider.isClosingTag(fullTag)) {
                stack.pop();
            } else if (SDFSchemaProvider.isOpeningTag(fullTag)) {
                stack.push(tagName);
            }
        }
        
        return stack.length > 0 ? stack[stack.length - 1] : null;
    }

    // Delegate to schema provider methods
    static extractTagName = SDFSchemaProvider.extractTagName;
    static isOpeningTag = SDFSchemaProvider.isOpeningTag;
    static isClosingTag = SDFSchemaProvider.isClosingTag;
    static isSelfClosingTag = SDFSchemaProvider.isSelfClosingTag;
    static getRequiredAttributes = SDFSchemaProvider.getRequiredAttributes;
    static getValidChildren = SDFSchemaProvider.getValidChildren;
}