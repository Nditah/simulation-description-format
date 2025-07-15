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
const sdfSchema_1 = require("./sdfSchema");
class SDFDiagnosticProvider {
    constructor() {
        this.diagnosticCollection = vscode.languages.createDiagnosticCollection('sdf');
    }
    updateDiagnostics(document, collection) {
        if (!sdfSchema_1.SDFSchemaProvider.isSDFFile(document.fileName) && !sdfSchema_1.SDFSchemaProvider.isSDFLanguage(document.languageId)) {
            return;
        }
        const diagnostics = [];
        const text = document.getText();
        const lines = text.split('\n');
        // Validate XML structure
        this.validateXMLStructure(lines, diagnostics);
        // Validate SDF schema
        this.validateSDFSchema(text, lines, diagnostics);
        // Validate required attributes
        this.validateRequiredAttributes(lines, diagnostics);
        // Validate joint types
        this.validateJointTypes(lines, diagnostics);
        // Validate nesting rules
        this.validateNestingRules(text, lines, diagnostics);
        collection.set(document.uri, diagnostics);
    }
    validateXMLStructure(lines, diagnostics) {
        const tagStack = [];
        lines.forEach((line, lineIndex) => {
            const trimmed = line.trim();
            // Find all tags in the line
            const tagMatches = Array.from(line.matchAll(/<\/?(\w+)[^>]*\/?>/g));
            tagMatches.forEach((match) => {
                const fullTag = match[0];
                const tagName = match[1];
                const tagStart = match.index || 0;
                if (fullTag.endsWith('/>')) {
                    // Self-closing tag - no validation needed
                    return;
                }
                if (fullTag.startsWith('</')) {
                    // Closing tag
                    const lastOpen = tagStack.pop();
                    if (!lastOpen) {
                        diagnostics.push(new vscode.Diagnostic(new vscode.Range(lineIndex, tagStart, lineIndex, tagStart + fullTag.length), `Unexpected closing tag '${tagName}' - no matching opening tag found`, vscode.DiagnosticSeverity.Error));
                    }
                    else if (lastOpen.name !== tagName) {
                        diagnostics.push(new vscode.Diagnostic(new vscode.Range(lineIndex, tagStart, lineIndex, tagStart + fullTag.length), `Mismatched closing tag '${tagName}' - expected '${lastOpen.name}' (opened on line ${lastOpen.line + 1})`, vscode.DiagnosticSeverity.Error));
                    }
                }
                else {
                    // Opening tag
                    tagStack.push({ name: tagName, line: lineIndex });
                }
            });
        });
        // Check for unclosed tags
        tagStack.forEach((unclosed) => {
            diagnostics.push(new vscode.Diagnostic(new vscode.Range(unclosed.line, 0, unclosed.line, lines[unclosed.line].length), `Unclosed tag '${unclosed.name}' - missing closing tag`, vscode.DiagnosticSeverity.Error));
        });
    }
    validateSDFSchema(text, lines, diagnostics) {
        // Check for SDF root element
        if (!text.includes('<sdf')) {
            diagnostics.push(new vscode.Diagnostic(new vscode.Range(0, 0, 0, 0), 'SDF file must contain a root <sdf> element', vscode.DiagnosticSeverity.Error));
        }
        // Validate SDF version
        const sdfVersionMatch = text.match(/<sdf\s+version="([^"]+)"/);
        if (sdfVersionMatch) {
            const version = sdfVersionMatch[1];
            const validVersions = ['1.0', '1.2', '1.3', '1.4', '1.5', '1.6', '1.7', '1.8', '1.9'];
            if (!validVersions.includes(version)) {
                const lineIndex = lines.findIndex(line => line.includes(sdfVersionMatch[0]));
                diagnostics.push(new vscode.Diagnostic(new vscode.Range(lineIndex, 0, lineIndex, lines[lineIndex].length), `Invalid SDF version '${version}'. Valid versions: ${validVersions.join(', ')}`, vscode.DiagnosticSeverity.Warning));
            }
        }
    }
    validateRequiredAttributes(lines, diagnostics) {
        lines.forEach((line, lineIndex) => {
            // Check for elements that require specific attributes
            const jointMatch = line.match(/<joint\s+([^>]*)>/);
            if (jointMatch) {
                const attributes = jointMatch[1];
                if (!attributes.includes('name=')) {
                    diagnostics.push(new vscode.Diagnostic(new vscode.Range(lineIndex, 0, lineIndex, line.length), 'Joint element requires a "name" attribute', vscode.DiagnosticSeverity.Error));
                }
                if (!attributes.includes('type=')) {
                    diagnostics.push(new vscode.Diagnostic(new vscode.Range(lineIndex, 0, lineIndex, line.length), 'Joint element requires a "type" attribute', vscode.DiagnosticSeverity.Error));
                }
            }
            const modelMatch = line.match(/<model\s+([^>]*)>/);
            if (modelMatch && !modelMatch[1].includes('name=')) {
                diagnostics.push(new vscode.Diagnostic(new vscode.Range(lineIndex, 0, lineIndex, line.length), 'Model element requires a "name" attribute', vscode.DiagnosticSeverity.Error));
            }
            const linkMatch = line.match(/<link\s+([^>]*)>/);
            if (linkMatch && !linkMatch[1].includes('name=')) {
                diagnostics.push(new vscode.Diagnostic(new vscode.Range(lineIndex, 0, lineIndex, line.length), 'Link element requires a "name" attribute', vscode.DiagnosticSeverity.Error));
            }
        });
    }
    validateJointTypes(lines, diagnostics) {
        const validJointTypes = sdfSchema_1.SDFSchemaProvider.SDF_SCHEMA.validJointTypes;
        lines.forEach((line, lineIndex) => {
            const jointTypeMatch = line.match(/type="([^"]+)"/);
            if (jointTypeMatch && line.includes('<joint')) {
                const jointType = jointTypeMatch[1];
                if (!validJointTypes.includes(jointType)) {
                    const typeStart = line.indexOf(jointTypeMatch[0]);
                    diagnostics.push(new vscode.Diagnostic(new vscode.Range(lineIndex, typeStart, lineIndex, typeStart + jointTypeMatch[0].length), `Invalid joint type '${jointType}'. Valid types: ${validJointTypes.join(', ')}`, vscode.DiagnosticSeverity.Error));
                }
            }
        });
    }
    validateNestingRules(text, lines, diagnostics) {
        // Validate that certain elements appear in correct contexts
        const worldPattern = /<world[^>]*>/;
        const modelPattern = /<model[^>]*>/;
        if (worldPattern.test(text) && modelPattern.test(text)) {
            // Check if models are properly nested within world or at root level
            const worldIndex = text.search(worldPattern);
            const modelIndex = text.search(modelPattern);
            if (worldIndex > -1 && modelIndex > -1 && modelIndex < worldIndex) {
                const lineIndex = lines.findIndex(line => line.includes('<model'));
                diagnostics.push(new vscode.Diagnostic(new vscode.Range(lineIndex, 0, lineIndex, lines[lineIndex].length), 'Model should be defined within a world element or at root level after world', vscode.DiagnosticSeverity.Warning));
            }
        }
    }
    dispose() {
        this.diagnosticCollection.dispose();
    }
}
exports.SDFDiagnosticProvider = SDFDiagnosticProvider;
//# sourceMappingURL=diagnosticProvider.js.map