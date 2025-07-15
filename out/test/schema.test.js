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
const assert = __importStar(require("assert"));
const sdfSchema_1 = require("../sdfSchema");
describe('SDF Schema Provider Unit Tests', () => {
    it('should have valid schema definitions', () => {
        assert.ok(sdfSchema_1.SDFSchemaProvider.SDF_SCHEMA);
        assert.ok(sdfSchema_1.SDFSchemaProvider.SDF_SCHEMA.requiredAttributes);
        assert.ok(sdfSchema_1.SDFSchemaProvider.SDF_SCHEMA.validChildren);
        assert.ok(sdfSchema_1.SDFSchemaProvider.SDF_SCHEMA.validJointTypes);
        assert.ok(sdfSchema_1.SDFSchemaProvider.SDF_SCHEMA.validSensorTypes);
    });
    it('should detect SDF files by extension', () => {
        assert.strictEqual(sdfSchema_1.SDFSchemaProvider.isSDFFile('test.sdf'), true);
        assert.strictEqual(sdfSchema_1.SDFSchemaProvider.isSDFFile('world.world'), true);
        assert.strictEqual(sdfSchema_1.SDFSchemaProvider.isSDFFile('script.js'), false);
        assert.strictEqual(sdfSchema_1.SDFSchemaProvider.isSDFFile('document.xml'), false);
    });
    it('should detect SDF language ID', () => {
        assert.strictEqual(sdfSchema_1.SDFSchemaProvider.isSDFLanguage('sdf'), true);
        assert.strictEqual(sdfSchema_1.SDFSchemaProvider.isSDFLanguage('xml'), false);
        assert.strictEqual(sdfSchema_1.SDFSchemaProvider.isSDFLanguage('javascript'), false);
    });
    it('should extract tag names correctly', () => {
        assert.strictEqual(sdfSchema_1.SDFSchemaProvider.extractTagName('<model>'), 'model');
        assert.strictEqual(sdfSchema_1.SDFSchemaProvider.extractTagName('</world>'), 'world');
        assert.strictEqual(sdfSchema_1.SDFSchemaProvider.extractTagName('<link name="test">'), 'link');
        assert.strictEqual(sdfSchema_1.SDFSchemaProvider.extractTagName('invalid'), null);
    });
    it('should detect tag types correctly', () => {
        assert.strictEqual(sdfSchema_1.SDFSchemaProvider.isOpeningTag('<model>'), true);
        assert.strictEqual(sdfSchema_1.SDFSchemaProvider.isOpeningTag('</model>'), false);
        assert.strictEqual(sdfSchema_1.SDFSchemaProvider.isClosingTag('</model>'), true);
        assert.strictEqual(sdfSchema_1.SDFSchemaProvider.isClosingTag('<model>'), false);
        assert.strictEqual(sdfSchema_1.SDFSchemaProvider.isSelfClosingTag('<pose/>'), true);
        assert.strictEqual(sdfSchema_1.SDFSchemaProvider.isSelfClosingTag('<pose>'), false);
    });
    it('should return required attributes', () => {
        const jointAttrs = sdfSchema_1.SDFSchemaProvider.getRequiredAttributes('joint');
        assert.ok(jointAttrs.includes('name'));
        assert.ok(jointAttrs.includes('type'));
        const sdfAttrs = sdfSchema_1.SDFSchemaProvider.getRequiredAttributes('sdf');
        assert.ok(sdfAttrs.includes('version'));
        const unknownAttrs = sdfSchema_1.SDFSchemaProvider.getRequiredAttributes('unknown');
        assert.strictEqual(unknownAttrs.length, 0);
    });
    it('should return valid children', () => {
        const sdfChildren = sdfSchema_1.SDFSchemaProvider.getValidChildren('sdf');
        assert.ok(sdfChildren.includes('world'));
        assert.ok(sdfChildren.includes('model'));
        const worldChildren = sdfSchema_1.SDFSchemaProvider.getValidChildren('world');
        assert.ok(worldChildren.includes('model'));
        assert.ok(worldChildren.includes('light'));
        assert.ok(worldChildren.includes('physics'));
    });
    it('should validate joint types', () => {
        const validTypes = ['revolute', 'prismatic', 'ball', 'universal', 'fixed', 'continuous'];
        validTypes.forEach(type => {
            assert.ok(sdfSchema_1.SDFSchemaProvider.SDF_SCHEMA.validJointTypes.includes(type));
        });
    });
    it('should validate sensor types', () => {
        const validTypes = ['camera', 'ray', 'lidar', 'imu', 'gps', 'contact'];
        validTypes.forEach(type => {
            assert.ok(sdfSchema_1.SDFSchemaProvider.SDF_SCHEMA.validSensorTypes.includes(type));
        });
    });
    it('should have consistent schema data', () => {
        // Test that all required attributes exist for known elements
        assert.ok(sdfSchema_1.SDFSchemaProvider.SDF_SCHEMA.requiredAttributes['sdf']);
        assert.ok(sdfSchema_1.SDFSchemaProvider.SDF_SCHEMA.requiredAttributes['world']);
        assert.ok(sdfSchema_1.SDFSchemaProvider.SDF_SCHEMA.requiredAttributes['model']);
        assert.ok(sdfSchema_1.SDFSchemaProvider.SDF_SCHEMA.requiredAttributes['link']);
        assert.ok(sdfSchema_1.SDFSchemaProvider.SDF_SCHEMA.requiredAttributes['joint']);
        // Test that SDF elements include core elements
        const elements = sdfSchema_1.SDFSchemaProvider.SDF_SCHEMA.sdfElements;
        assert.ok(elements.includes('sdf'));
        assert.ok(elements.includes('world'));
        assert.ok(elements.includes('model'));
        assert.ok(elements.includes('link'));
        assert.ok(elements.includes('joint'));
    });
    it('should handle edge cases in tag parsing', () => {
        // Test empty and malformed inputs
        assert.strictEqual(sdfSchema_1.SDFSchemaProvider.extractTagName(''), null);
        assert.strictEqual(sdfSchema_1.SDFSchemaProvider.extractTagName('not a tag'), null);
        assert.strictEqual(sdfSchema_1.SDFSchemaProvider.extractTagName('< >'), null);
        // Test complex tag structures
        assert.strictEqual(sdfSchema_1.SDFSchemaProvider.extractTagName('<joint type="revolute" name="test">'), 'joint');
        assert.strictEqual(sdfSchema_1.SDFSchemaProvider.extractTagName('</joint>'), 'joint');
    });
    it('should correctly identify self-closing tags', () => {
        assert.strictEqual(sdfSchema_1.SDFSchemaProvider.isSelfClosingTag('<pose/>'), true);
        assert.strictEqual(sdfSchema_1.SDFSchemaProvider.isSelfClosingTag('<mass value="1.0"/>'), true);
        assert.strictEqual(sdfSchema_1.SDFSchemaProvider.isSelfClosingTag('<pose>'), false);
        assert.strictEqual(sdfSchema_1.SDFSchemaProvider.isSelfClosingTag('</pose>'), false);
    });
    it('should provide comprehensive joint type validation', () => {
        const allJointTypes = sdfSchema_1.SDFSchemaProvider.SDF_SCHEMA.validJointTypes;
        assert.ok(allJointTypes.length > 0);
        // Test each joint type is a non-empty string
        allJointTypes.forEach(type => {
            assert.ok(typeof type === 'string');
            assert.ok(type.length > 0);
        });
    });
    it('should provide comprehensive sensor type validation', () => {
        const allSensorTypes = sdfSchema_1.SDFSchemaProvider.SDF_SCHEMA.validSensorTypes;
        assert.ok(allSensorTypes.length > 0);
        // Test each sensor type is a non-empty string
        allSensorTypes.forEach(type => {
            assert.ok(typeof type === 'string');
            assert.ok(type.length > 0);
        });
    });
});
//# sourceMappingURL=schema.test.js.map