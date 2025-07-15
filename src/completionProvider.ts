import * as vscode from 'vscode';
import { SDFSchemaProvider } from './sdfSchema';

export class SDFCompletionProvider implements vscode.CompletionItemProvider {
    
    provideCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position,
        _token: vscode.CancellationToken,
        context: vscode.CompletionContext
    ): vscode.CompletionItem[] {
        const line = document.lineAt(position);
        const lineText = line.text;
        const beforeCursor = lineText.substring(0, position.character);
        
        // Get parent context for smart completions
        const parentTag = this.getParentTag(document, position);
        
        // Tag completion
        if (beforeCursor.endsWith('<')) {
            return this.getTagCompletions(parentTag);
        }
        
        // Attribute completion
        if (this.isInOpeningTag(beforeCursor)) {
            const tagName = this.getCurrentTagName(beforeCursor);
            return this.getAttributeCompletions(tagName);
        }
        
        // Value completion for specific attributes
        if (this.isAttributeValue(beforeCursor)) {
            return this.getValueCompletions(beforeCursor);
        }

        return [];
    }

    private getTagCompletions(parentTag: string | null): vscode.CompletionItem[] {
        const items: vscode.CompletionItem[] = [];
        
        if (parentTag) {
            // Context-aware completions based on parent
            const validChildren = SDFSchemaProvider.getValidChildren(parentTag);
            validChildren.forEach(child => {
                const item = new vscode.CompletionItem(child, vscode.CompletionItemKind.Class);
                item.insertText = new vscode.SnippetString(`${child}>\n\t$0\n</${child}>`);
                item.documentation = this.getElementDocumentation(child);
                item.detail = `Valid child of <${parentTag}>`;
                items.push(item);
            });
        } else {
            // Root level completions
            ['sdf', 'world', 'model'].forEach(element => {
                const item = new vscode.CompletionItem(element, vscode.CompletionItemKind.Class);
                if (element === 'sdf') {
                    item.insertText = new vscode.SnippetString(`sdf version="1.9">\n\t$0\n</sdf>`);
                } else {
                    item.insertText = new vscode.SnippetString(`${element} name="$1">\n\t$0\n</${element}>`);
                }
                item.documentation = this.getElementDocumentation(element);
                items.push(item);
            });
        }

        // Add common robotics snippets
        items.push(...this.getRoboticsSnippets(parentTag));
        
        return items;
    }

    private getAttributeCompletions(tagName: string): vscode.CompletionItem[] {
        const items: vscode.CompletionItem[] = [];
        const requiredAttrs = SDFSchemaProvider.getRequiredAttributes(tagName);
        
        // Required attributes
        requiredAttrs.forEach(attr => {
            const item = new vscode.CompletionItem(attr, vscode.CompletionItemKind.Property);
            item.insertText = new vscode.SnippetString(`${attr}="$1"`);
            item.detail = `Required attribute for <${tagName}>`;
            item.documentation = this.getAttributeDocumentation(tagName, attr);
            items.push(item);
        });

        // Common optional attributes
        const commonAttrs = ['name', 'type', 'value', 'filename', 'uri'];
        commonAttrs.forEach(attr => {
            if (!requiredAttrs.includes(attr)) {
                const item = new vscode.CompletionItem(attr, vscode.CompletionItemKind.Property);
                item.insertText = new vscode.SnippetString(`${attr}="$1"`);
                item.detail = `Optional attribute`;
                items.push(item);
            }
        });

        return items;
    }

    private getValueCompletions(beforeCursor: string): vscode.CompletionItem[] {
        const items: vscode.CompletionItem[] = [];
        
        // Joint type completions
        if (beforeCursor.includes('type="') && beforeCursor.includes('<joint')) {
            SDFSchemaProvider.SDF_SCHEMA.validJointTypes.forEach(type => {
                const item = new vscode.CompletionItem(type, vscode.CompletionItemKind.Enum);
                item.documentation = this.getJointTypeDocumentation(type);
                items.push(item);
            });
        }
        
        // Sensor type completions
        if (beforeCursor.includes('type="') && beforeCursor.includes('<sensor')) {
            SDFSchemaProvider.SDF_SCHEMA.validSensorTypes.forEach(type => {
                const item = new vscode.CompletionItem(type, vscode.CompletionItemKind.Enum);
                item.documentation = this.getSensorTypeDocumentation(type);
                items.push(item);
            });
        }

        // Common values
        if (beforeCursor.includes('version="')) {
            ['1.9', '1.8', '1.7', '1.6'].forEach(version => {
                const item = new vscode.CompletionItem(version, vscode.CompletionItemKind.Value);
                item.detail = `SDF version ${version}`;
                items.push(item);
            });
        }

        return items;
    }

    private getRoboticsSnippets(parentTag: string | null): vscode.CompletionItem[] {
        const snippets: vscode.CompletionItem[] = [];

        if (parentTag === 'link') {
            // Complete inertial properties
            const inertialSnippet = new vscode.CompletionItem('inertial (complete)', vscode.CompletionItemKind.Snippet);
            inertialSnippet.insertText = new vscode.SnippetString([
                'inertial>',
                '\t<mass>$1</mass>',
                '\t<inertia>',
                '\t\t<ixx>$2</ixx>',
                '\t\t<ixy>0.0</ixy>',
                '\t\t<ixz>0.0</ixz>',
                '\t\t<iyy>$3</iyy>',
                '\t\t<iyz>0.0</iyz>',
                '\t\t<izz>$4</izz>',
                '\t</inertia>',
                '</inertial>'
            ].join('\n'));
            inertialSnippet.documentation = 'Complete inertial properties for a link';
            snippets.push(inertialSnippet);

            // Visual with box geometry
            const visualSnippet = new vscode.CompletionItem('visual (box)', vscode.CompletionItemKind.Snippet);
            visualSnippet.insertText = new vscode.SnippetString([
                'visual name="$1">',
                '\t<geometry>',
                '\t\t<box>',
                '\t\t\t<size>$2 $3 $4</size>',
                '\t\t</box>',
                '\t</geometry>',
                '</visual>'
            ].join('\n'));
            snippets.push(visualSnippet);
        }

        if (parentTag === 'world') {
            // Common world elements
            const physicsSnippet = new vscode.CompletionItem('physics (ODE)', vscode.CompletionItemKind.Snippet);
            physicsSnippet.insertText = new vscode.SnippetString([
                'physics name="default_physics" default="0" type="ode">',
                '\t<gravity>0 0 -9.8066</gravity>',
                '\t<ode>',
                '\t\t<solver>',
                '\t\t\t<type>quick</type>',
                '\t\t\t<iters>150</iters>',
                '\t\t</solver>',
                '\t</ode>',
                '</physics>'
            ].join('\n'));
            snippets.push(physicsSnippet);
        }

        return snippets;
    }

    private getParentTag(document: vscode.TextDocument, position: vscode.Position): string | null {
        const text = document.getText(new vscode.Range(0, 0, position.line, position.character));
        const tagMatches = Array.from(text.matchAll(/<\/?(\w+)[^>]*>/g));
        
        const stack: string[] = [];
        for (const match of tagMatches) {
            const fullTag = match[0];
            const tagName = match[1];
            
            if (fullTag.startsWith('</')) {
                stack.pop();
            } else if (!fullTag.endsWith('/>')) {
                stack.push(tagName);
            }
        }
        
        return stack.length > 0 ? stack[stack.length - 1] : null;
    }

    private isInOpeningTag(text: string): boolean {
        const lastLt = text.lastIndexOf('<');
        const lastGt = text.lastIndexOf('>');
        return lastLt > lastGt && !text.substring(lastLt).includes('</');
    }

    private getCurrentTagName(text: string): string {
        const match = text.match(/<(\w+)[^>]*$/);
        return match ? match[1] : '';
    }

    private isAttributeValue(text: string): boolean {
        return text.includes('="') && !text.endsWith('"');
    }

    private getElementDocumentation(element: string): vscode.MarkdownString {
        const docs: { [key: string]: string } = {
            'sdf': 'Root element of an SDF file. Defines simulation description format version.',
            'world': 'Defines a simulation world containing models, lights, and physics.',
            'model': 'Defines a robot or object model with links, joints, and sensors.',
            'link': 'Physical link in a model with inertial, visual, and collision properties.',
            'joint': 'Connection between two links defining motion constraints.',
            'visual': 'Visual representation of a link for rendering.',
            'collision': 'Collision geometry for physics simulation.',
            'sensor': 'Sensor attached to a link (camera, lidar, IMU, etc.).',
            'inertial': 'Mass and inertia properties of a link.',
            'geometry': 'Geometric shape definition (box, sphere, cylinder, mesh).'
        };
        return new vscode.MarkdownString(docs[element] || `SDF element: ${element}`);
    }

    private getAttributeDocumentation(tag: string, attr: string): vscode.MarkdownString {
        const attrDocs: { [key: string]: { [key: string]: string } } = {
            'joint': {
                'name': 'Unique name for the joint',
                'type': 'Type of joint (revolute, prismatic, ball, universal, fixed, continuous)'
            },
            'model': {
                'name': 'Unique name for the model'
            },
            'sdf': {
                'version': 'SDF format version (1.9 recommended)'
            }
        };
        
        const doc = attrDocs[tag]?.[attr] || `${attr} attribute for ${tag} element`;
        return new vscode.MarkdownString(doc);
    }

    private getJointTypeDocumentation(type: string): vscode.MarkdownString {
        const jointDocs: { [key: string]: string } = {
            'revolute': 'Rotational joint with angle limits',
            'prismatic': 'Linear sliding joint with position limits',
            'ball': 'Ball and socket joint with 3 rotational DOF',
            'universal': 'Universal joint with 2 rotational DOF',
            'fixed': 'Fixed connection with no movement',
            'continuous': 'Continuous rotational joint with no limits'
        };
        return new vscode.MarkdownString(jointDocs[type] || `Joint type: ${type}`);
    }

    private getSensorTypeDocumentation(type: string): vscode.MarkdownString {
        const sensorDocs: { [key: string]: string } = {
            'camera': 'RGB camera sensor for visual data',
            'ray': 'Ray sensor for distance measurements',
            'lidar': 'LIDAR sensor for 3D point cloud data',
            'imu': 'Inertial Measurement Unit for orientation and acceleration',
            'gps': 'GPS sensor for global positioning',
            'contact': 'Contact sensor for collision detection'
        };
        return new vscode.MarkdownString(sensorDocs[type] || `Sensor type: ${type}`);
    }
}