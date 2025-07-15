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
exports.SDFHoverProvider = void 0;
const vscode = __importStar(require("vscode"));
class SDFHoverProvider {
    provideHover(document, position, token) {
        const range = document.getWordRangeAtPosition(position);
        if (!range)
            return;
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
    getElementHover(element) {
        const documentation = this.getElementDocumentation(element);
        const markdown = new vscode.MarkdownString();
        markdown.appendCodeblock(element, 'xml');
        markdown.appendMarkdown(documentation);
        return new vscode.Hover(markdown);
    }
    getAttributeHover(attribute) {
        const documentation = this.getAttributeDocumentation(attribute);
        const markdown = new vscode.MarkdownString();
        markdown.appendCodeblock(attribute, 'xml');
        markdown.appendMarkdown(documentation);
        return new vscode.Hover(markdown);
    }
    getElementDocumentation(element) {
        const docs = {
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
    getAttributeDocumentation(attribute) {
        const docs = {
            'name': '**Name Attribute**\n\nUnique identifier for the element.',
            'type': '**Type Attribute**\n\nSpecifies the type or variant of the element.',
            'version': '**Version Attribute**\n\nSDF format version (e.g., "1.9").',
            'filename': '**Filename Attribute**\n\nPath to a file resource.'
        };
        return docs[attribute] || `Attribute: **${attribute}**`;
    }
}
exports.SDFHoverProvider = SDFHoverProvider;
//# sourceMappingURL=hoverProvider.js.map