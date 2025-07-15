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
exports.SDFLanguageProvider = void 0;
const vscode = __importStar(require("vscode"));
class SDFLanguageProvider {
    static isSDFDocument(document) {
        return document.languageId === this.SDF_LANGUAGE_ID ||
            this.SDF_FILE_EXTENSIONS.some(ext => document.fileName.endsWith(ext));
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
    // Utility methods for parsing SDF content
    static extractTagName(tagString) {
        const match = tagString.match(/<\/?(\w+)/);
        return match ? match[1] : null;
    }
    static isOpeningTag(tagString) {
        return tagString.startsWith('<') && !tagString.startsWith('</') && !tagString.endsWith('/>');
    }
    static isClosingTag(tagString) {
        return tagString.startsWith('</');
    }
    static isSelfClosingTag(tagString) {
        return tagString.endsWith('/>');
    }
    // Get parent tag context for completion/validation
    static getParentTagContext(document, position) {
        const text = document.getText(new vscode.Range(0, 0, position.line, position.character));
        const tagMatches = Array.from(text.matchAll(/<\/?(\w+)[^>]*>/g));
        const stack = [];
        for (const match of tagMatches) {
            const fullTag = match[0];
            const tagName = match[1];
            if (this.isClosingTag(fullTag)) {
                stack.pop();
            }
            else if (this.isOpeningTag(fullTag)) {
                stack.push(tagName);
            }
        }
        return stack.length > 0 ? stack[stack.length - 1] : null;
    }
    // Type-safe method to check if a tag requires specific attributes
    static getRequiredAttributes(tagName) {
        const schema = this.SDF_SCHEMA.requiredAttributes;
        return schema[tagName] || [];
    }
    // Type-safe method to check valid children for a tag
    static getValidChildren(tagName) {
        const schema = this.SDF_SCHEMA.validChildren;
        return schema[tagName] || [];
    }
    // Helper method to get mutable copy if needed
    static getRequiredAttributesCopy(tagName) {
        const schema = this.SDF_SCHEMA.requiredAttributes;
        const attrs = schema[tagName];
        return attrs ? [...attrs] : [];
    }
    // Helper method to get mutable copy if needed
    static getValidChildrenCopy(tagName) {
        const schema = this.SDF_SCHEMA.validChildren;
        const children = schema[tagName];
        return children ? [...children] : [];
    }
}
exports.SDFLanguageProvider = SDFLanguageProvider;
// Base class for common language provider functionality
SDFLanguageProvider.SDF_LANGUAGE_ID = 'sdf';
SDFLanguageProvider.SDF_FILE_EXTENSIONS = ['.sdf', '.world'];
// Common SDF schema definitions with proper types
SDFLanguageProvider.SDF_SCHEMA = {
    requiredAttributes: {
        'sdf': ['version'],
        'world': ['name'],
        'model': ['name'],
        'link': ['name'],
        'joint': ['name', 'type'],
        'sensor': ['name', 'type'],
        'plugin': ['name', 'filename']
    },
    validChildren: {
        'sdf': ['world', 'model'],
        'world': ['include', 'model', 'light', 'physics', 'scene', 'state', 'population', 'plugin'],
        'model': ['link', 'joint', 'plugin', 'gripper', 'pose', 'static', 'self_collide'],
        'link': ['inertial', 'collision', 'visual', 'sensor', 'pose', 'kinematic', 'gravity', 'enable_wind'],
        'visual': ['geometry', 'material', 'pose', 'cast_shadows', 'transparency'],
        'collision': ['geometry', 'surface', 'pose'],
        'geometry': ['box', 'sphere', 'cylinder', 'plane', 'mesh', 'polyline', 'capsule', 'ellipsoid'],
        'inertial': ['mass', 'inertia', 'pose'],
        'inertia': ['ixx', 'ixy', 'ixz', 'iyy', 'iyz', 'izz']
    },
    validJointTypes: ['revolute', 'prismatic', 'ball', 'universal', 'fixed', 'continuous'],
    validSensorTypes: ['camera', 'ray', 'lidar', 'imu', 'gps', 'contact', 'force_torque', 'magnetometer', 'altimeter'],
    sdfElements: [
        'sdf', 'world', 'model', 'link', 'joint', 'visual', 'collision', 'inertial',
        'geometry', 'box', 'sphere', 'cylinder', 'plane', 'mesh', 'material',
        'pose', 'mass', 'inertia', 'sensor', 'camera', 'ray', 'plugin',
        'include', 'uri', 'physics', 'light', 'scene', 'state'
    ]
};
//# sourceMappingURL=languageProvider.js.map