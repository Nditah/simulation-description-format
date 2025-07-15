import * as vscode from 'vscode';

export class SDFHoverProvider implements vscode.HoverProvider {
    provideHover(
        document: vscode.TextDocument,
        position: vscode.Position,
        _token: vscode.CancellationToken
    ): vscode.Hover | undefined {
        const range = document.getWordRangeAtPosition(position);
        if (!range) return;

        const word = document.getText(range);
        const line = document.lineAt(position);
        
        // Check if we're hovering over a tag
        if (line.text.includes(`<${word}`) || line.text.includes(`</${word}`)) {
            const markdown = new vscode.MarkdownString();
            markdown.appendCodeblock(word, 'xml');
            markdown.appendMarkdown(this.getElementDocumentation(word));
            return new vscode.Hover(markdown);
        }

        return undefined;
    }

    private getElementDocumentation(element: string): string {
        const docs: { [key: string]: string } = {
            'sdf': 'Root element of an SDF file',
            'world': 'Defines a simulation world',
            'model': 'Defines a model with links and joints',
            'link': 'Physical link in a model',
            'joint': 'Connection between two links',
            'visual': 'Visual representation',
            'collision': 'Collision properties'
        };
        return docs[element] || `SDF element: ${element}`;
    }
}