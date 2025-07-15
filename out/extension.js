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
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const diagnosticProvider_1 = require("./diagnosticProvider");
const completionProvider_1 = require("./completionProvider");
const languageProvider_1 = require("./languageProvider");
function activate(context) {
    console.log('SDF Language Support extension is now active!');
    // Document selector for SDF files
    const sdfSelector = languageProvider_1.SDFLanguageProvider.getDocumentSelector();
    // Create diagnostic collection
    const diagnosticCollection = vscode.languages.createDiagnosticCollection('sdf');
    context.subscriptions.push(diagnosticCollection);
    // Create providers
    const diagnosticProvider = new diagnosticProvider_1.SDFDiagnosticProvider();
    const completionProvider = new completionProvider_1.SDFCompletionProvider();
    const hoverProvider = new SDFHoverProvider();
    const formattingProvider = new SDFFormattingProvider();
    // Register completion provider
    const completionDisposable = vscode.languages.registerCompletionItemProvider(sdfSelector, completionProvider, '<', ' ', '=', '"');
    // Register hover provider for documentation
    const hoverDisposable = vscode.languages.registerHoverProvider(sdfSelector, hoverProvider);
    // Register document formatting provider
    const formattingDisposable = vscode.languages.registerDocumentFormattingEditProvider(sdfSelector, formattingProvider);
    // Register diagnostic provider - on document change
    const diagnosticDisposable = vscode.workspace.onDidChangeTextDocument(e => {
        if (languageProvider_1.SDFLanguageProvider.isSDFDocument(e.document)) {
            diagnosticProvider.updateDiagnostics(e.document, diagnosticCollection);
        }
    });
    // Register diagnostic provider - on document open
    const openDisposable = vscode.workspace.onDidOpenTextDocument(document => {
        if (languageProvider_1.SDFLanguageProvider.isSDFDocument(document)) {
            diagnosticProvider.updateDiagnostics(document, diagnosticCollection);
        }
    });
    // Run initial diagnostics for already open documents
    vscode.workspace.textDocuments.forEach(document => {
        if (languageProvider_1.SDFLanguageProvider.isSDFDocument(document)) {
            diagnosticProvider.updateDiagnostics(document, diagnosticCollection);
        }
    });
    // Register commands
    const formatCommand = vscode.commands.registerCommand('sdf.format', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor && languageProvider_1.SDFLanguageProvider.isSDFDocument(editor.document)) {
            vscode.commands.executeCommand('editor.action.formatDocument');
        }
    });
    const validateCommand = vscode.commands.registerCommand('sdf.validate', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor && languageProvider_1.SDFLanguageProvider.isSDFDocument(editor.document)) {
            diagnosticProvider.updateDiagnostics(editor.document, diagnosticCollection);
            vscode.window.showInformationMessage('SDF validation complete! Check Problems panel for issues.');
        }
    });
    // Add all to context subscriptions
    context.subscriptions.push(completionDisposable, hoverDisposable, formattingDisposable, diagnosticDisposable, openDisposable, formatCommand, validateCommand);
    // Show activation message
    vscode.window.showInformationMessage('SDF Language Support is now active! 🤖');
}
// Hover provider for documentation
class SDFHoverProvider {
    provideHover(document, position, _token) {
        const range = document.getWordRangeAtPosition(position);
        if (!range)
            return undefined;
        const word = document.getText(range);
        const line = document.lineAt(position.line);
        // Check if we're hovering over an SDF element
        if (line.text.includes(`<${word}`) || line.text.includes(`</${word}`)) {
            const documentation = this.getElementDocumentation(word);
            if (documentation) {
                return new vscode.Hover(documentation, range);
            }
        }
        // Check if we're hovering over an attribute
        if (line.text.includes(`${word}=`)) {
            const tagMatch = line.text.match(/<(\w+)/);
            if (tagMatch) {
                const tagName = tagMatch[1];
                const attrDocumentation = this.getAttributeDocumentation(tagName, word);
                if (attrDocumentation) {
                    return new vscode.Hover(attrDocumentation, range);
                }
            }
        }
        return undefined;
    }
    getElementDocumentation(element) {
        const docs = {
            'sdf': '**SDF Root Element**\n\nThe root element of a Simulation Description Format file. Defines the SDF version and contains world or model definitions.\n\n**Required Attributes:** `version`\n\n**Example:**\n```xml\n<sdf version="1.9">\n  <world name="default">\n    <!-- world content -->\n  </world>\n</sdf>\n```',
            'world': '**World Element**\n\nDefines a simulation world containing models, lights, physics, and environment settings.\n\n**Required Attributes:** `name`\n\n**Valid Children:** model, include, light, physics, scene, state, population, plugin\n\n**Example:**\n```xml\n<world name="my_world">\n  <physics name="default_physics" type="ode"/>\n  <model name="robot">...</model>\n</world>\n```',
            'model': '**Model Element**\n\nDefines a robot or object model composed of links, joints, sensors, and plugins.\n\n**Required Attributes:** `name`\n\n**Valid Children:** link, joint, plugin, gripper, pose, static, self_collide\n\n**Example:**\n```xml\n<model name="mobile_robot">\n  <pose>0 0 0.1 0 0 0</pose>\n  <link name="base_link">...</link>\n</model>\n```',
            'link': '**Link Element**\n\nPhysical link in a model with inertial, visual, and collision properties.\n\n**Required Attributes:** `name`\n\n**Valid Children:** inertial, collision, visual, sensor, pose, kinematic, gravity\n\n**Example:**\n```xml\n<link name="base_link">\n  <inertial>...</inertial>\n  <visual name="visual">...</visual>\n  <collision name="collision">...</collision>\n</link>\n```',
            'joint': '**Joint Element**\n\nConnection between two links defining motion constraints and degrees of freedom.\n\n**Required Attributes:** `name`, `type`\n\n**Valid Types:** revolute, prismatic, ball, universal, fixed, continuous\n\n**Example:**\n```xml\n<joint name="wheel_joint" type="continuous">\n  <parent>base_link</parent>\n  <child>wheel_link</child>\n  <axis><xyz>0 1 0</xyz></axis>\n</joint>\n```',
            'visual': '**Visual Element**\n\nVisual representation of a link for rendering and display purposes.\n\n**Valid Children:** geometry, material, pose, cast_shadows, transparency\n\n**Example:**\n```xml\n<visual name="visual">\n  <geometry>\n    <box><size>1 1 1</size></box>\n  </geometry>\n  <material>\n    <ambient>0.8 0.8 0.8 1</ambient>\n  </material>\n</visual>\n```',
            'collision': '**Collision Element**\n\nCollision geometry for physics simulation and contact detection.\n\n**Valid Children:** geometry, surface, pose\n\n**Example:**\n```xml\n<collision name="collision">\n  <geometry>\n    <box><size>1 1 1</size></box>\n  </geometry>\n  <surface>...</surface>\n</collision>\n```',
            'sensor': '**Sensor Element**\n\nSensor attached to a link for data acquisition (camera, lidar, IMU, etc.).\n\n**Required Attributes:** `name`, `type`\n\n**Valid Types:** camera, ray, lidar, imu, gps, contact, force_torque, magnetometer\n\n**Example:**\n```xml\n<sensor name="lidar" type="ray">\n  <pose>0 0 0.1 0 0 0</pose>\n  <ray>...</ray>\n</sensor>\n```',
            'geometry': '**Geometry Element**\n\nDefines the geometric shape for visual or collision elements.\n\n**Valid Children:** box, sphere, cylinder, plane, mesh, polyline, capsule, ellipsoid\n\n**Example:**\n```xml\n<geometry>\n  <box><size>1 0.5 0.2</size></box>\n</geometry>\n```',
            'inertial': '**Inertial Element**\n\nMass and inertia properties of a link for physics simulation.\n\n**Valid Children:** mass, inertia, pose\n\n**Example:**\n```xml\n<inertial>\n  <mass>5.0</mass>\n  <inertia>\n    <ixx>0.1</ixx><iyy>0.1</iyy><izz>0.1</izz>\n    <ixy>0</ixy><ixz>0</ixz><iyz>0</iyz>\n  </inertia>\n</inertial>\n```',
            'pose': '**Pose Element**\n\nPosition and orientation (x y z roll pitch yaw) relative to parent frame.\n\n**Format:** `x y z roll pitch yaw`\n\n**Example:**\n```xml\n<pose>1.0 0.5 0.2 0 0 1.57</pose>\n```'
        };
        const doc = docs[element];
        if (doc) {
            return new vscode.MarkdownString(doc);
        }
        return undefined;
    }
    getAttributeDocumentation(tagName, attribute) {
        const attrDocs = {
            'sdf': {
                'version': '**SDF Version**\n\nSpecifies the SDF format version. Current recommended version is `1.9`.\n\n**Valid Values:** 1.0, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9'
            },
            'joint': {
                'name': '**Joint Name**\n\nUnique identifier for the joint within the model.',
                'type': '**Joint Type**\n\nDefines the motion constraints of the joint.\n\n**Valid Types:**\n- `revolute` - Rotational with limits\n- `prismatic` - Linear sliding with limits\n- `ball` - Ball and socket (3 rotational DOF)\n- `universal` - Universal joint (2 rotational DOF)\n- `fixed` - No movement\n- `continuous` - Continuous rotation'
            },
            'model': {
                'name': '**Model Name**\n\nUnique identifier for the model within the world.'
            },
            'link': {
                'name': '**Link Name**\n\nUnique identifier for the link within the model.'
            },
            'sensor': {
                'name': '**Sensor Name**\n\nUnique identifier for the sensor.',
                'type': '**Sensor Type**\n\nType of sensor for data acquisition.\n\n**Valid Types:**\n- `camera` - RGB camera\n- `ray` - Ray sensor for distance\n- `lidar` - LIDAR for 3D point clouds\n- `imu` - Inertial Measurement Unit\n- `gps` - Global Positioning System\n- `contact` - Contact/touch sensor\n- `force_torque` - Force and torque sensor'
            }
        };
        const doc = attrDocs[tagName]?.[attribute];
        if (doc) {
            return new vscode.MarkdownString(doc);
        }
        return undefined;
    }
}
// Document formatting provider
class SDFFormattingProvider {
    provideDocumentFormattingEdits(document, options, _token) {
        const edits = [];
        const text = document.getText();
        const formatted = this.formatSDF(text, options);
        if (formatted !== text) {
            const range = new vscode.Range(document.positionAt(0), document.positionAt(text.length));
            edits.push(vscode.TextEdit.replace(range, formatted));
        }
        return edits;
    }
    formatSDF(xml, options) {
        const indent = options.insertSpaces ? ' '.repeat(options.tabSize) : '\t';
        let formatted = '';
        let indentLevel = 0;
        const lines = xml.split('\n');
        for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.length === 0) {
                formatted += '\n';
                continue;
            }
            // Handle XML declaration and comments without indentation changes
            if (trimmed.startsWith('<?') || trimmed.startsWith('<!--')) {
                formatted += indent.repeat(Math.max(0, indentLevel)) + trimmed + '\n';
                continue;
            }
            // Decrease indent for closing tags
            if (trimmed.startsWith('</')) {
                indentLevel = Math.max(0, indentLevel - 1);
            }
            // Add formatted line
            formatted += indent.repeat(indentLevel) + trimmed + '\n';
            // Increase indent for opening tags (but not self-closing or closing tags)
            if (trimmed.startsWith('<') && !trimmed.startsWith('</') &&
                !trimmed.endsWith('/>') && !trimmed.startsWith('<?') &&
                !trimmed.startsWith('<!--')) {
                indentLevel++;
            }
        }
        return formatted.trim();
    }
}
function deactivate() {
    console.log('SDF Language Support extension is deactivated');
}
//# sourceMappingURL=extension.js.map