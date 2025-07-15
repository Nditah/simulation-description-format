// Pure SDF schema definitions without VS Code dependencies

export interface SDFSchema {
    readonly requiredAttributes: {
        readonly [key: string]: readonly string[];
    };
    readonly validChildren: {
        readonly [key: string]: readonly string[];
    };
    readonly validJointTypes: readonly string[];
    readonly validSensorTypes: readonly string[];
    readonly sdfElements: readonly string[];
}

export class SDFSchemaProvider {
    // Common SDF schema definitions with proper types
    static readonly SDF_SCHEMA: SDFSchema = {
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

    // File extension constants
    static readonly SDF_FILE_EXTENSIONS = ['.sdf', '.world'];
    static readonly SDF_LANGUAGE_ID = 'sdf';

    // Utility methods for parsing SDF content (no VS Code dependencies)
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

    // Type-safe method to check if a tag requires specific attributes
    static getRequiredAttributes(tagName: string): readonly string[] {
        const schema = this.SDF_SCHEMA.requiredAttributes;
        return schema[tagName] || [];
    }

    // Type-safe method to check valid children for a tag
    static getValidChildren(tagName: string): readonly string[] {
        const schema = this.SDF_SCHEMA.validChildren;
        return schema[tagName] || [];
    }

    // Helper methods for file detection (pure logic)
    static isSDFFile(fileName: string): boolean {
        return this.SDF_FILE_EXTENSIONS.some(ext => fileName.endsWith(ext));
    }

    static isSDFLanguage(languageId: string): boolean {
        return languageId === this.SDF_LANGUAGE_ID;
    }
}