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
exports.SDFDiagnosticProvider = void 0;
const vscode = __importStar(require("vscode"));
const languageProvider_1 = require("./languageProvider");
class SDFDiagnosticProvider {
    constructor() {
        // Use the shared schema from SDFLanguageProvider
        this.sdfSchema = languageProvider_1.SDFLanguageProvider.SDF_SCHEMA;
    }
    updateDiagnostics(document, collection) {
        const diagnostics = [];
        // Only process SDF documents
        if (!languageProvider_1.SDFLanguageProvider.isSDFDocument(document)) {
            return;
        }
        // Parse XML and check for errors
        this.checkXmlSyntax(document, diagnostics);
        this.checkSdfStructure(document, diagnostics);
        this.checkRequiredAttributes(document, diagnostics);
        this.checkValidValues(document, diagnostics);
        collection.set(document.uri, diagnostics);
    }
    checkXmlSyntax(document, diagnostics) {
        const text = document.getText();
        const lines = text.split('\n');
        // Check for unclosed tags
        const tagStack = [];
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const tagMatches = line.matchAll(/<\/?(\w+)[^>]*>/g);
            for (const match of tagMatches) {
                const fullTag = match[0];
                const tagName = match[1];
                const col = match.index || 0;
                if (languageProvider_1.SDFLanguageProvider.isClosingTag(fullTag)) {
                    // Closing tag
                    const lastOpen = tagStack.pop();
                    if (!lastOpen) {
                        diagnostics.push({
                            range: new vscode.Range(i, col, i, col + fullTag.length),
                            message: `Unexpected closing tag '</${tagName}>'`,
                            severity: vscode.DiagnosticSeverity.Error,
                            code: 'xml-unexpected-closing-tag'
                        });
                    }
                    else if (lastOpen.name !== tagName) {
                        diagnostics.push({
                            range: new vscode.Range(i, col, i, col + fullTag.length),
                            message: `Mismatched closing tag. Expected '</${lastOpen.name}>' but found '</${tagName}>'`,
                            severity: vscode.DiagnosticSeverity.Error,
                            code: 'xml-mismatched-tag'
                        });
                    }
                }
                else if (languageProvider_1.SDFLanguageProvider.isOpeningTag(fullTag) && !fullTag.startsWith('<?')) {
                    // Opening tag
                    tagStack.push({ name: tagName, line: i, col });
                }
            }
        }
        // Check for unclosed tags
        for (const unclosed of tagStack) {
            diagnostics.push({
                range: new vscode.Range(unclosed.line, unclosed.col, unclosed.line, unclosed.col + unclosed.name.length + 1),
                message: `Unclosed tag '<${unclosed.name}>'`,
                severity: vscode.DiagnosticSeverity.Error,
                code: 'xml-unclosed-tag'
            });
        }
    }
    checkSdfStructure(document, diagnostics) {
        const text = document.getText();
        // Check if document starts with <?xml declaration
        if (!text.trim().startsWith('<?xml')) {
            diagnostics.push({
                range: new vscode.Range(0, 0, 0, 5),
                message: 'SDF files should start with XML declaration',
                severity: vscode.DiagnosticSeverity.Warning,
                code: 'sdf-missing-xml-declaration'
            });
        }
        // Check for root SDF element
        const sdfMatch = text.match(/<sdf[^>]*>/);
        if (!sdfMatch) {
            diagnostics.push({
                range: new vscode.Range(0, 0, 0, 10),
                message: 'SDF files must have a root <sdf> element',
                severity: vscode.DiagnosticSeverity.Error,
                code: 'sdf-missing-root'
            });
        }
    }
    checkRequiredAttributes(document, diagnostics) {
        const text = document.getText();
        const lines = text.split('\n');
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const tagMatches = line.matchAll(/<(\w+)([^>]*)>/g);
            for (const match of tagMatches) {
                const tagName = match[1];
                const attributes = match[2];
                const col = match.index || 0;
                // Use the helper method to get required attributes
                const requiredAttrs = languageProvider_1.SDFLanguageProvider.getRequiredAttributes(tagName);
                if (requiredAttrs.length > 0) {
                    for (const requiredAttr of requiredAttrs) {
                        if (!attributes.includes(`${requiredAttr}=`)) {
                            diagnostics.push({
                                range: new vscode.Range(i, col, i, col + match[0].length),
                                message: `Missing required attribute '${requiredAttr}' for element '${tagName}'`,
                                severity: vscode.DiagnosticSeverity.Error,
                                code: 'sdf-missing-required-attribute'
                            });
                        }
                    }
                }
            }
        }
    }
    checkValidValues(document, diagnostics) {
        const text = document.getText();
        const lines = text.split('\n');
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            // Check joint types
            const jointTypeMatch = line.match(/<joint[^>]*type=["']([^"']+)["']/);
            if (jointTypeMatch) {
                const jointType = jointTypeMatch[1];
                if (!this.sdfSchema.validJointTypes.includes(jointType)) {
                    const col = line.indexOf(jointType);
                    diagnostics.push({
                        range: new vscode.Range(i, col, i, col + jointType.length),
                        message: `Invalid joint type '${jointType}'. Valid types: ${this.sdfSchema.validJointTypes.join(', ')}`,
                        severity: vscode.DiagnosticSeverity.Error,
                        code: 'sdf-invalid-joint-type'
                    });
                }
            }
            // Check sensor types
            const sensorTypeMatch = line.match(/<sensor[^>]*type=["']([^"']+)["']/);
            if (sensorTypeMatch) {
                const sensorType = sensorTypeMatch[1];
                if (!this.sdfSchema.validSensorTypes.includes(sensorType)) {
                    const col = line.indexOf(sensorType);
                    diagnostics.push({
                        range: new vscode.Range(i, col, i, col + sensorType.length),
                        message: `Invalid sensor type '${sensorType}'. Valid types: ${this.sdfSchema.validSensorTypes.join(', ')}`,
                        severity: vscode.DiagnosticSeverity.Error,
                        code: 'sdf-invalid-sensor-type'
                    });
                }
            }
        }
    }
}
exports.SDFDiagnosticProvider = SDFDiagnosticProvider;
//# sourceMappingURL=diagnosticProvider.js.map