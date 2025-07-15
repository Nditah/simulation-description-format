import * as vscode from 'vscode';

export class SDFHoverProvider implements vscode.HoverProvider {
    provideHover(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken
    ): vscode.Hover | undefined {
        const range = document.getWordRangeAtPosition(position);
        if (!range) return;

        const word = document.getText(range);
        const line = document.lineAt(position);
        
        // Check if we're hovering over a tag
        if (line.text.includes(`<${word}`) || line.text.includes(`</${word}`)) {
            return this.getElementHover(word);
        }
        
        // Check if we're hovering over an attribute
        const attrMatch = line.text.match(new RegExp(`\\b${word}\\s*=`));
        if (attrMatch) {
            return this.getAttributeHover(word);
        }

        return undefined;
    }

    private getElementHover(element: string): vscode.Hover {
        const documentation = this.getElementDocumentation(element);
        const markdown = new vscode.MarkdownString();
        markdown.appendCodeblock(element, 'xml');
        markdown.appendMarkdown(documentation);
        
        return new vscode.Hover(markdown);
    }

    private getAttributeHover(attribute: string): vscode.Hover {
        const documentation = this.getAttributeDocumentation(attribute);
        const markdown = new vscode.MarkdownString();
        markdown.appendCodeblock(attribute, 'xml');
        markdown.appendMarkdown(documentation);
        
        return new vscode.Hover(markdown);
    }

    private getElementDocumentation(element: string): string {
        const docs: { [key: string]: string } = {
            'sdf': '**SDF Root Element**\n\nThe root element of all SDF documents. Must contain a version attribute.',
            'world': '**World Element**\n\nDefines a simulation world containing models, lights, physics settings, and other world-level properties.',
            'model': '**Model Element**\n\nDefines a model composed of links connected by joints. Models can be static or dynamic.',
            'link': '**Link Element**\n\nA physical link in a model with inertial, visual, and collision properties.',
            'joint': '**Joint Element**\n\nConnects two links with kinematic and dynamic constraints.',
            'visual': '**Visual Element**\n\nDefines the visual appearance of a link.',
            'collision': '**Collision Element**\n\nDefines collision properties for physics simulation.',
            'geometry': '**Geometry Element**\n\nDefines geometric shapes like box, sphere, cylinder, mesh, etc.',
            'pose': '**Pose Element**\n\nDefines position and orientation as: x y z roll pitch yaw',
            'inertial': '**Inertial Element**\n\nDefines mass and inertia properties of a link.',
            'sensor': '**Sensor Element**\n\nDefines sensors like cameras, LIDAR, IMU, GPS, etc.',
            'plugin': '**Plugin Element**\n\nDefines plugin configuration for extending SDF functionality.'
        };
        
        return docs[element] || `SDF element: **${element}**`;
    }

    private getAttributeDocumentation(attribute: string): string {
        const docs: { [key: string]: string } = {
            'name': '**Name Attribute**\n\nUnique identifier for the element.',
            'type': '**Type Attribute**\n\nSpecifies the type or variant of the element.',
            'version': '**Version Attribute**\n\nSDF format version (e.g., "1.9").',
            'filename': '**Filename Attribute**\n\nPath to a file resource.'
        };
        
        return docs[attribute] || `Attribute: **${attribute}**`;
    }
}