"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SDFLanguageProvider = void 0;
const vscode = __importStar(require("vscode"));
const sdfSchema_1 = require("./sdfSchema");
class SDFLanguageProvider {
    // VS Code specific methods
    static isSDFDocument(document) {
        return sdfSchema_1.SDFSchemaProvider.isSDFLanguage(document.languageId) ||
            sdfSchema_1.SDFSchemaProvider.isSDFFile(document.fileName);
    }
    static getSDFDocuments() {
        return vscode.workspace.textDocuments.filter(doc => this.isSDFDocument(doc));
    }
    static getDocumentSelector() {
        return [
            { scheme: 'file', language: this.SDF_LANGUAGE_ID },
            { scheme: 'file', pattern: '**/*.sdf' },
            { scheme: 'file', pattern: '**/*.world' }
        ];
    }
    // Get parent tag context for completion/validation
    static getParentTagContext(document, position) {
        const text = document.getText(new vscode.Range(0, 0, position.line, position.character));
        const tagMatches = Array.from(text.matchAll(/<\/?(\w+)[^>]*>/g));
        const stack = [];
        for (const match of tagMatches) {
            const fullTag = match[0];
            const tagName = match[1];
            if (sdfSchema_1.SDFSchemaProvider.isClosingTag(fullTag)) {
                stack.pop();
            }
            else if (sdfSchema_1.SDFSchemaProvider.isOpeningTag(fullTag)) {
                stack.push(tagName);
            }
        }
        return stack.length > 0 ? stack[stack.length - 1] : null;
    }
}
exports.SDFLanguageProvider = SDFLanguageProvider;
// Re-export the schema for backward compatibility
SDFLanguageProvider.SDF_SCHEMA = sdfSchema_1.SDFSchemaProvider.SDF_SCHEMA;
SDFLanguageProvider.SDF_LANGUAGE_ID = sdfSchema_1.SDFSchemaProvider.SDF_LANGUAGE_ID;
SDFLanguageProvider.SDF_FILE_EXTENSIONS = sdfSchema_1.SDFSchemaProvider.SDF_FILE_EXTENSIONS;
// Delegate to schema provider methods
SDFLanguageProvider.extractTagName = sdfSchema_1.SDFSchemaProvider.extractTagName;
SDFLanguageProvider.isOpeningTag = sdfSchema_1.SDFSchemaProvider.isOpeningTag;
SDFLanguageProvider.isClosingTag = sdfSchema_1.SDFSchemaProvider.isClosingTag;
SDFLanguageProvider.isSelfClosingTag = sdfSchema_1.SDFSchemaProvider.isSelfClosingTag;
SDFLanguageProvider.getRequiredAttributes = sdfSchema_1.SDFSchemaProvider.getRequiredAttributes;
SDFLanguageProvider.getValidChildren = sdfSchema_1.SDFSchemaProvider.getValidChildren;
//# sourceMappingURL=languageProvider.js.map