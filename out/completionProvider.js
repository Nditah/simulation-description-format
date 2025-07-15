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
exports.SDFCompletionProvider = void 0;
const vscode = __importStar(require("vscode"));
class SDFCompletionProvider {
    constructor() {
        this.sdfElements = [
            'sdf', 'world', 'model', 'link', 'joint', 'visual', 'collision', 'inertial',
            'geometry', 'box', 'sphere', 'cylinder', 'plane', 'mesh', 'material',
            'pose', 'mass', 'inertia', 'sensor', 'camera', 'ray', 'plugin',
            'include', 'uri', 'physics', 'light', 'scene', 'state'
        ];
        this.attributeCompletions = {
            'sdf': ['version'],
            'world': ['name'],
            'model': ['name'],
            'link': ['name'],
            'joint': ['name', 'type'],
            'sensor': ['name', 'type'],
            'plugin': ['name', 'filename'],
            'visual': ['name'],
            'collision': ['name']
        };
    }
    provideCompletionItems(document, position, token, context) {
        const line = document.lineAt(position);
        const lineText = line.text;
        const beforeCursor = lineText.substring(0, position.character);
        // Tag completion
        if (beforeCursor.endsWith('<')) {
            return this.getElementCompletions();
        }
        // Attribute completion
        const tagMatch = beforeCursor.match(/<(\w+)([^>]*)$/);
        if (tagMatch) {
            const tagName = tagMatch[1];
            return this.getAttributeCompletions(tagName);
        }
        // Value completion for specific attributes
        if (beforeCursor.includes('type="') || beforeCursor.includes("type='")) {
            const parentTag = this.getParentTag(document, position);
            if (parentTag === 'joint') {
                return this.getJointTypeCompletions();
            }
            else if (parentTag === 'sensor') {
                return this.getSensorTypeCompletions();
            }
        }
        return [];
    }
    getElementCompletions() {
        return this.sdfElements.map(element => {
            const item = new vscode.CompletionItem(element, vscode.CompletionItemKind.Class);
            item.insertText = new vscode.SnippetString(`${element}$1>$0</${element}>`);
            item.documentation = this.getElementDocumentation(element);
            return item;
        });
    }
    getAttributeCompletions(tagName) {
        const attributes = this.attributeCompletions[tagName] || [];
        return attributes.map(attr => {
            const item = new vscode.CompletionItem(attr, vscode.CompletionItemKind.Property);
            item.insertText = new vscode.SnippetString(`${attr}="$1"`);
            item.documentation = this.getAttributeDocumentation(tagName, attr);
            return item;
        });
    }
    getJointTypeCompletions() {
        const jointTypes = ['revolute', 'prismatic', 'ball', 'universal', 'fixed', 'continuous'];
        return jointTypes.map(type => {
            const item = new vscode.CompletionItem(type, vscode.CompletionItemKind.Enum);
            item.documentation = this.getJointTypeDocumentation(type);
            return item;
        });
    }
    getSensorTypeCompletions() {
        const sensorTypes = ['camera', 'ray', 'lidar', 'imu', 'gps', 'contact', 'force_torque'];
        return sensorTypes.map(type => {
            const item = new vscode.CompletionItem(type, vscode.CompletionItemKind.Enum);
            item.documentation = this.getSensorTypeDocumentation(type);
            return item;
        });
    }
    getParentTag(document, position) {
        const text = document.getText(new vscode.Range(0, 0, position.line, position.character));
        const tagMatches = Array.from(text.matchAll(/<(\/?)\w+/g));
        const stack = [];
        for (const match of tagMatches) {
            const isClosing = match[1] === '/';
            const tagName = match[0].substring(isClosing ? 2 : 1);
            if (isClosing) {
                stack.pop();
            }
            else {
                stack.push(tagName);
            }
        }
        return stack.length > 0 ? stack[stack.length - 1] : null;
    }
    getElementDocumentation(element) {
        const docs = {
            'sdf': 'Root element of an SDF file. Contains the version attribute.',
            'world': 'Defines a world with models, lights, and physics properties.',
            'model': 'Defines a model composed of links and joints.',
            'link': 'A physical link in a model with mass, collision, and visual properties.',
            'joint': 'Connects two links together with kinematic and dynamic properties.',
            'visual': 'Visual representation of a link.',
            'collision': 'Collision properties of a link.',
            'geometry': 'Geometric shape (box, sphere, cylinder, etc.).',
            'sensor': 'Sensor attached to a link.',
            'plugin': 'Plugin configuration for extending functionality.'
        };
        return docs[element] || `SDF element: ${element}`;
    }
    getAttributeDocumentation(tagName, attr) {
        const docs = {
            'sdf': { 'version': 'SDF format version (e.g., "1.9")' },
            'world': { 'name': 'Unique name for the world' },
            'model': { 'name': 'Unique name for the model' },
            'joint': {
                'name': 'Unique name for the joint',
                'type': 'Type of joint (revolute, prismatic, fixed, etc.)'
            }
        };
        return docs[tagName]?.[attr] || `Attribute: ${attr}`;
    }
    getJointTypeDocumentation(type) {
        const docs = {
            'revolute': 'A hinge joint that rotates around a single axis',
            'prismatic': 'A sliding joint that moves along a single axis',
            'ball': 'A ball and socket joint with 3 degrees of freedom',
            'universal': 'A universal joint with 2 degrees of freedom',
            'fixed': 'A fixed joint with no degrees of freedom',
            'continuous': 'A continuous revolute joint with unlimited rotation'
        };
        return docs[type] || `Joint type: ${type}`;
    }
    getSensorTypeDocumentation(type) {
        const docs = {
            'camera': 'Camera sensor for capturing images',
            'ray': 'Ray sensor for distance measurements',
            'lidar': 'LIDAR sensor for 3D scanning',
            'imu': 'Inertial Measurement Unit for orientation and acceleration',
            'gps': 'GPS sensor for position information',
            'contact': 'Contact sensor for collision detection',
            'force_torque': 'Force/torque sensor for measuring applied forces'
        };
        return docs[type] || `Sensor type: ${type}`;
    }
}
exports.SDFCompletionProvider = SDFCompletionProvider;
//# sourceMappingURL=completionProvider.js.map