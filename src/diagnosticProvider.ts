import * as vscode from 'vscode';
import { SDFLanguageProvider } from './languageProvider';

export class SDFDiagnosticProvider {
    // Use the shared schema from SDFLanguageProvider
    private sdfSchema = SDFLanguageProvider.SDF_SCHEMA;

    updateDiagnostics(document: vscode.TextDocument, collection: vscode.DiagnosticCollection): void {
        const diagnostics: vscode.Diagnostic[] = [];
        
        // Only process SDF documents
        if (!SDFLanguageProvider.isSDFDocument(document)) {
            return;
        }
        
        // Parse XML and check for errors
        this.checkXmlSyntax(document, diagnostics);
        this.checkSdfStructure(document, diagnostics);
        this.checkRequiredAttributes(document, diagnostics);
        this.checkValidValues(document, diagnostics);
        
        collection.set(document.uri, diagnostics);
    }

    private checkXmlSyntax(document: vscode.TextDocument, diagnostics: vscode.Diagnostic[]): void {
        const text = document.getText();
        const lines = text.split('\n');
        
        // Check for unclosed tags
        const tagStack: { name: string, line: number, col: number }[] = [];
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const tagMatches = line.matchAll(/<\/?(\w+)[^>]*>/g);
            
            for (const match of tagMatches) {
                const fullTag = match[0];
                const tagName = match[1];
                const col = match.index || 0;
                
                if (SDFLanguageProvider.isClosingTag(fullTag)) {
                    // Closing tag
                    const lastOpen = tagStack.pop();
                    if (!lastOpen) {
                        diagnostics.push({
                            range: new vscode.Range(i, col, i, col + fullTag.length),
                            message: `Unexpected closing tag '</${tagName}>'`,
                            severity: vscode.DiagnosticSeverity.Error,
                            code: 'xml-unexpected-closing-tag'
                        });
                    } else if (lastOpen.name !== tagName) {
                        diagnostics.push({
                            range: new vscode.Range(i, col, i, col + fullTag.length),
                            message: `Mismatched closing tag. Expected '</${lastOpen.name}>' but found '</${tagName}>'`,
                            severity: vscode.DiagnosticSeverity.Error,
                            code: 'xml-mismatched-tag'
                        });
                    }
                } else if (SDFLanguageProvider.isOpeningTag(fullTag) && !fullTag.startsWith('<?')) {
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

    private checkSdfStructure(document: vscode.TextDocument, diagnostics: vscode.Diagnostic[]): void {
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

    private checkRequiredAttributes(document: vscode.TextDocument, diagnostics: vscode.Diagnostic[]): void {
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
                const requiredAttrs = SDFLanguageProvider.getRequiredAttributes(tagName);
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

    private checkValidValues(document: vscode.TextDocument, diagnostics: vscode.Diagnostic[]): void {
        const text = document.getText();
        const lines = text.split('\n');
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            
            // Check joint types
            const jointTypeMatch = line.match(/<joint[^>]*type=["']([^"']+)["']/);
            if (jointTypeMatch) {
                const jointType = jointTypeMatch[1];
                if (!this.sdfSchema.validJointTypes.includes(jointType as any)) {
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
                if (!this.sdfSchema.validSensorTypes.includes(sensorType as any)) {
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