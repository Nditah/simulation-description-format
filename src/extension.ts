import * as vscode from 'vscode';
import { SDFDiagnosticProvider } from './diagnosticProvider';
import { SDFCompletionProvider } from './completionProvider';
import { SDFHoverProvider } from './hoverProvider';

export function activate(context: vscode.ExtensionContext) {
    console.log('SDF Language Support extension is now active!');

    // Register language providers
    const sdfSelector: vscode.DocumentSelector = { scheme: 'file', language: 'sdf' };
    
    // Diagnostic provider for error detection
    const diagnosticProvider = new SDFDiagnosticProvider();
    const diagnosticCollection = vscode.languages.createDiagnosticCollection('sdf');
    context.subscriptions.push(diagnosticCollection);

    // Auto-completion provider
    const completionProvider = new SDFCompletionProvider();
    context.subscriptions.push(
        vscode.languages.registerCompletionItemProvider(
            sdfSelector,
            completionProvider,
            '<', ' ', '='
        )
    );

    // Hover provider for documentation
    const hoverProvider = new SDFHoverProvider();
    context.subscriptions.push(
        vscode.languages.registerHoverProvider(sdfSelector, hoverProvider)
    );

    // Document formatting provider
    context.subscriptions.push(
        vscode.languages.registerDocumentFormattingEditProvider(
            sdfSelector,
            new SDFFormattingProvider()
        )
    );

    // Listen for document changes to update diagnostics
    context.subscriptions.push(
        vscode.workspace.onDidChangeTextDocument(event => {
            if (event.document.languageId === 'sdf') {
                diagnosticProvider.updateDiagnostics(event.document, diagnosticCollection);
            }
        })
    );

    // Initial diagnostic check for open documents
    vscode.workspace.textDocuments.forEach(document => {
        if (document.languageId === 'sdf') {
            diagnosticProvider.updateDiagnostics(document, diagnosticCollection);
        }
    });
}

class SDFFormattingProvider implements vscode.DocumentFormattingEditProvider {
    provideDocumentFormattingEdits(
        document: vscode.TextDocument,
        options: vscode.FormattingOptions,
        _token: vscode.CancellationToken
    ): vscode.TextEdit[] {
        const edits: vscode.TextEdit[] = [];
        const text = document.getText();
        
        // Basic XML formatting logic
        const formatted = this.formatXml(text, options);
        
        if (formatted !== text) {
            const range = new vscode.Range(
                document.positionAt(0),
                document.positionAt(text.length)
            );
            edits.push(vscode.TextEdit.replace(range, formatted));
        }
        
        return edits;
    }

    private formatXml(xml: string, options: vscode.FormattingOptions): string {
        // Basic XML formatting implementation
        const indent = options.insertSpaces ? ' '.repeat(options.tabSize) : '\t';
        let formatted = '';
        let indentLevel = 0;
        const lines = xml.split('\n');

        for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.length === 0) continue;

            if (trimmed.startsWith('</')) {
                indentLevel--;
            }

            formatted += indent.repeat(Math.max(0, indentLevel)) + trimmed + '\n';

            if (trimmed.startsWith('<') && !trimmed.startsWith('</') && !trimmed.endsWith('/>') && !trimmed.startsWith('<?')) {
                indentLevel++;
            }
        }

        return formatted.trim();
    }
}

export function deactivate() {}