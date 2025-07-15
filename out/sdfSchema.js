"use strict";
// Pure SDF schema definitions without VS Code dependencies
Object.defineProperty(exports, "__esModule", { value: true });
exports.SDFSchemaProvider = void 0;
class SDFSchemaProvider {
    // Utility methods for parsing SDF content (no VS Code dependencies)
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
    // Helper methods for file detection (pure logic)
    static isSDFFile(fileName) {
        return this.SDF_FILE_EXTENSIONS.some(ext => fileName.endsWith(ext));
    }
    static isSDFLanguage(languageId) {
        return languageId === this.SDF_LANGUAGE_ID;
    }
}
exports.SDFSchemaProvider = SDFSchemaProvider;
// Common SDF schema definitions with proper types
SDFSchemaProvider.SDF_SCHEMA = {
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
// File extension constants
SDFSchemaProvider.SDF_FILE_EXTENSIONS = ['.sdf', '.world'];
SDFSchemaProvider.SDF_LANGUAGE_ID = 'sdf';
//# sourceMappingURL=sdfSchema.js.map