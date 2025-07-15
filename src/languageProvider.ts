import * as vscode from 'vscode';

export class SDFLanguageProvider {
    // Base class for common language provider functionality
    static readonly SDF_LANGUAGE_ID = 'sdf';
    static readonly SDF_FILE_EXTENSIONS = ['.sdf', '.world'];
    
    static isSDFDocument(document: vscode.TextDocument): boolean {
        return document.languageId === this.SDF_LANGUAGE_ID || 
               this.SDF_FILE_EXTENSIONS.some(ext => document.fileName.endsWith(ext));
    }
    
    static getSDFDocuments(): vscode.TextDocument[] {
        return vscode.workspace.textDocuments.filter(doc => this.isSDFDocument(doc));
    }

    static getDocumentSelector(): vscode.DocumentSelector {
        return [
            { scheme: 'file', language: this.SDF_LANGUAGE_ID },
            { scheme: 'file', pattern: '**/*.sdf' },
            { scheme: 'file', pattern: '**/*.world' }
        ];
    }

    // Common SDF schema definitions with proper types
    static readonly SDF_SCHEMA = {
        requiredAttributes: {
            'sdf': ['version'],
            'world': ['name'],
            'model': ['name'],
            'link': ['name'],
            'joint': ['name', 'type'],
            'sensor': ['name', 'type'],
            'plugin': ['name', 'filename']
        } as const,
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
        } as const,
        validJointTypes: ['revolute', 'prismatic', 'ball', 'universal', 'fixed', 'continuous'] as const,
        validSensorTypes: ['camera', 'ray', 'lidar', 'imu', 'gps', 'contact', 'force_torque', 'magnetometer', 'altimeter'] as const,
        sdfElements: [
            'sdf', 'world', 'model', 'link', 'joint', 'visual', 'collision', 'inertial',
            'geometry', 'box', 'sphere', 'cylinder', 'plane', 'mesh', 'material',
            'pose', 'mass', 'inertia', 'sensor', 'camera', 'ray', 'plugin',
            'include', 'uri', 'physics', 'light', 'scene', 'state'
        ] as const
    };

    // Utility methods for parsing SDF content
    static extractTagName(tagString: string): string | null {
        const match = tagString.match(/<\/?(\w+)/);
        return match ? match[1] : null;
    }

    static isOpeningTag(tagString: string): boolean {
        return tagString.startsWith('<') && !tagString.startsWith('</') && !tagString.endsWith('/>');
    }

    static isClosingTag(tagString: string): boolean {
        return tagString.startsWith('</');
    }

    static isSelfClosingTag(tagString: string): boolean {
        return tagString.endsWith('/>');
    }

    // Get parent tag context for completion/validation
    static getParentTagContext(document: vscode.TextDocument, position: vscode.Position): string | null {
        const text = document.getText(new vscode.Range(0, 0, position.line, position.character));
        const tagMatches = Array.from(text.matchAll(/<\/?(\w+)[^>]*>/g));
        
        const stack: string[] = [];
        for (const match of tagMatches) {
            const fullTag = match[0];
            const tagName = match[1];
            
            if (this.isClosingTag(fullTag)) {
                stack.pop();
            } else if (this.isOpeningTag(fullTag)) {
                stack.push(tagName);
            }
        }
        
        return stack.length > 0 ? stack[stack.length - 1] : null;
    }

    // Type-safe method to check if a tag requires specific attributes
    static getRequiredAttributes(tagName: string): readonly string[] {
        const schema = this.SDF_SCHEMA.requiredAttributes;
        return schema[tagName as keyof typeof schema] || [];
    }

    // Type-safe method to check valid children for a tag
    static getValidChildren(tagName: string): readonly string[] {
        const schema = this.SDF_SCHEMA.validChildren;
        return schema[tagName as keyof typeof schema] || [];
    }

    // Helper method to get mutable copy if needed
    static getRequiredAttributesCopy(tagName: string): string[] {
        const schema = this.SDF_SCHEMA.requiredAttributes;
        const attrs = schema[tagName as keyof typeof schema];
        return attrs ? [...attrs] : [];
    }

    // Helper method to get mutable copy if needed
    static getValidChildrenCopy(tagName: string): string[] {
        const schema = this.SDF_SCHEMA.validChildren;
        const children = schema[tagName as keyof typeof schema];
        return children ? [...children] : [];
    }
}