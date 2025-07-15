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
exports.SDFCompletionProvider = void 0;
const vscode = __importStar(require("vscode"));
const sdfSchema_1 = require("./sdfSchema");
class SDFCompletionProvider {
    provideCompletionItems(document, position, _token, context) {
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
    getTagCompletions(parentTag) {
        const items = [];
        if (parentTag) {
            // Context-aware completions based on parent
            const validChildren = sdfSchema_1.SDFSchemaProvider.getValidChildren(parentTag);
            validChildren.forEach(child => {
                const item = new vscode.CompletionItem(child, vscode.CompletionItemKind.Class);
                item.insertText = new vscode.SnippetString(`${child}>\n\t$0\n</${child}>`);
                item.documentation = this.getElementDocumentation(child);
                item.detail = `Valid child of <${parentTag}>`;
                items.push(item);
            });
        }
        else {
            // Root level completions
            ['sdf', 'world', 'model'].forEach(element => {
                const item = new vscode.CompletionItem(element, vscode.CompletionItemKind.Class);
                if (element === 'sdf') {
                    item.insertText = new vscode.SnippetString(`sdf version="1.9">\n\t$0\n</sdf>`);
                }
                else {
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
    getAttributeCompletions(tagName) {
        const items = [];
        const requiredAttrs = sdfSchema_1.SDFSchemaProvider.getRequiredAttributes(tagName);
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
    getValueCompletions(beforeCursor) {
        const items = [];
        // Joint type completions
        if (beforeCursor.includes('type="') && beforeCursor.includes('<joint')) {
            sdfSchema_1.SDFSchemaProvider.SDF_SCHEMA.validJointTypes.forEach(type => {
                const item = new vscode.CompletionItem(type, vscode.CompletionItemKind.Enum);
                item.documentation = this.getJointTypeDocumentation(type);
                items.push(item);
            });
        }
        // Sensor type completions
        if (beforeCursor.includes('type="') && beforeCursor.includes('<sensor')) {
            sdfSchema_1.SDFSchemaProvider.SDF_SCHEMA.validSensorTypes.forEach(type => {
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
    getRoboticsSnippets(parentTag) {
        const snippets = [];
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
    getParentTag(document, position) {
        const text = document.getText(new vscode.Range(0, 0, position.line, position.character));
        const tagMatches = Array.from(text.matchAll(/<\/?(\w+)[^>]*>/g));
        const stack = [];
        for (const match of tagMatches) {
            const fullTag = match[0];
            const tagName = match[1];
            if (fullTag.startsWith('</')) {
                stack.pop();
            }
            else if (!fullTag.endsWith('/>')) {
                stack.push(tagName);
            }
        }
        return stack.length > 0 ? stack[stack.length - 1] : null;
    }
    isInOpeningTag(text) {
        const lastLt = text.lastIndexOf('<');
        const lastGt = text.lastIndexOf('>');
        return lastLt > lastGt && !text.substring(lastLt).includes('</');
    }
    getCurrentTagName(text) {
        const match = text.match(/<(\w+)[^>]*$/);
        return match ? match[1] : '';
    }
    isAttributeValue(text) {
        return text.includes('="') && !text.endsWith('"');
    }
    getElementDocumentation(element) {
        const docs = {
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
    getAttributeDocumentation(tag, attr) {
        const attrDocs = {
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
    getJointTypeDocumentation(type) {
        const jointDocs = {
            'revolute': 'Rotational joint with angle limits',
            'prismatic': 'Linear sliding joint with position limits',
            'ball': 'Ball and socket joint with 3 rotational DOF',
            'universal': 'Universal joint with 2 rotational DOF',
            'fixed': 'Fixed connection with no movement',
            'continuous': 'Continuous rotational joint with no limits'
        };
        return new vscode.MarkdownString(jointDocs[type] || `Joint type: ${type}`);
    }
    getSensorTypeDocumentation(type) {
        const sensorDocs = {
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
exports.SDFCompletionProvider = SDFCompletionProvider;
//# sourceMappingURL=completionProvider.js.map