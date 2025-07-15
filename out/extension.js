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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const languageProvider_1 = require("./languageProvider");
const diagnosticProvider_1 = require("./diagnosticProvider");
const completionProvider_1 = require("./completionProvider");
const hoverProvider_1 = require("./hoverProvider");
function activate(context) {
    console.log('SDF Language Support extension is now active!');
    // Use the centralized document selector
    const sdfSelector = languageProvider_1.SDFLanguageProvider.getDocumentSelector();
    // Diagnostic provider for error detection
    const diagnosticProvider = new diagnosticProvider_1.SDFDiagnosticProvider();
    const diagnosticCollection = vscode.languages.createDiagnosticCollection('sdf');
    context.subscriptions.push(diagnosticCollection);
    // Auto-completion provider
    const completionProvider = new completionProvider_1.SDFCompletionProvider();
    context.subscriptions.push(vscode.languages.registerCompletionItemProvider(sdfSelector, completionProvider, '<', ' ', '='));
    // Hover provider for documentation
    const hoverProvider = new hoverProvider_1.SDFHoverProvider();
    context.subscriptions.push(vscode.languages.registerHoverProvider(sdfSelector, hoverProvider));
    // Document formatting provider
    context.subscriptions.push(vscode.languages.registerDocumentFormattingEditProvider(sdfSelector, new SDFFormattingProvider()));
    // Listen for document changes to update diagnostics
    context.subscriptions.push(vscode.workspace.onDidChangeTextDocument(event => {
        if (languageProvider_1.SDFLanguageProvider.isSDFDocument(event.document)) {
            diagnosticProvider.updateDiagnostics(event.document, diagnosticCollection);
        }
    }));
    // Initial diagnostic check for open documents
    languageProvider_1.SDFLanguageProvider.getSDFDocuments().forEach(document => {
        diagnosticProvider.updateDiagnostics(document, diagnosticCollection);
    });
    // Register command for SDF validation
    context.subscriptions.push(vscode.commands.registerCommand('sdf.validateDocument', () => {
        const activeEditor = vscode.window.activeTextEditor;
        if (activeEditor && languageProvider_1.SDFLanguageProvider.isSDFDocument(activeEditor.document)) {
            diagnosticProvider.updateDiagnostics(activeEditor.document, diagnosticCollection);
            vscode.window.showInformationMessage('SDF document validated');
        }
        else {
            vscode.window.showWarningMessage('No active SDF document to validate');
        }
    }));
}
class SDFFormattingProvider {
    provideDocumentFormattingEdits(document, options, token) {
        const edits = [];
        const text = document.getText();
        // Basic XML formatting logic
        const formatted = this.formatXml(text, options);
        if (formatted !== text) {
            const range = new vscode.Range(document.positionAt(0), document.positionAt(text.length));
            edits.push(vscode.TextEdit.replace(range, formatted));
        }
        return edits;
    }
    formatXml(xml, options) {
        // Basic XML formatting implementation
        const indent = options.insertSpaces ? ' '.repeat(options.tabSize) : '\t';
        let formatted = '';
        let indentLevel = 0;
        const lines = xml.split('\n');
        for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.length === 0)
                continue;
            if (trimmed.startsWith('</')) {
                indentLevel--;
            }
            formatted += indent.repeat(Math.max(0, indentLevel)) + trimmed + '\n';
            if (languageProvider_1.SDFLanguageProvider.isOpeningTag(trimmed) && !trimmed.startsWith('<?')) {
                indentLevel++;
            }
        }
        return formatted.trim();
    }
}
function deactivate() { }
//# sourceMappingURL=extension.js.map