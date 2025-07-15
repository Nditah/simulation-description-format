import * as assert from 'assert';
import { SDFSchemaProvider } from '../sdfSchema';

describe('SDF Schema Provider Unit Tests', () => {
    
    it('should have valid schema definitions', () => {
        assert.ok(SDFSchemaProvider.SDF_SCHEMA);
        assert.ok(SDFSchemaProvider.SDF_SCHEMA.requiredAttributes);
        assert.ok(SDFSchemaProvider.SDF_SCHEMA.validChildren);
        assert.ok(SDFSchemaProvider.SDF_SCHEMA.validJointTypes);
        assert.ok(SDFSchemaProvider.SDF_SCHEMA.validSensorTypes);
    });

    it('should detect SDF files by extension', () => {
        assert.strictEqual(SDFSchemaProvider.isSDFFile('test.sdf'), true);
        assert.strictEqual(SDFSchemaProvider.isSDFFile('world.world'), true);
        assert.strictEqual(SDFSchemaProvider.isSDFFile('script.js'), false);
        assert.strictEqual(SDFSchemaProvider.isSDFFile('document.xml'), false);
    });

    it('should detect SDF language ID', () => {
        assert.strictEqual(SDFSchemaProvider.isSDFLanguage('sdf'), true);
        assert.strictEqual(SDFSchemaProvider.isSDFLanguage('xml'), false);
        assert.strictEqual(SDFSchemaProvider.isSDFLanguage('javascript'), false);
    });

    it('should extract tag names correctly', () => {
        assert.strictEqual(SDFSchemaProvider.extractTagName('<model>'), 'model');
        assert.strictEqual(SDFSchemaProvider.extractTagName('</world>'), 'world');
        assert.strictEqual(SDFSchemaProvider.extractTagName('<link name="test">'), 'link');
        assert.strictEqual(SDFSchemaProvider.extractTagName('invalid'), null);
    });

    it('should detect tag types correctly', () => {
        assert.strictEqual(SDFSchemaProvider.isOpeningTag('<model>'), true);
        assert.strictEqual(SDFSchemaProvider.isOpeningTag('</model>'), false);
        assert.strictEqual(SDFSchemaProvider.isClosingTag('</model>'), true);
        assert.strictEqual(SDFSchemaProvider.isClosingTag('<model>'), false);
        assert.strictEqual(SDFSchemaProvider.isSelfClosingTag('<pose/>'), true);
        assert.strictEqual(SDFSchemaProvider.isSelfClosingTag('<pose>'), false);
    });

    it('should return required attributes', () => {
        const jointAttrs = SDFSchemaProvider.getRequiredAttributes('joint');
        assert.ok(jointAttrs.includes('name'));
        assert.ok(jointAttrs.includes('type'));

        const sdfAttrs = SDFSchemaProvider.getRequiredAttributes('sdf');
        assert.ok(sdfAttrs.includes('version'));

        const unknownAttrs = SDFSchemaProvider.getRequiredAttributes('unknown');
        assert.strictEqual(unknownAttrs.length, 0);
    });

    it('should return valid children', () => {
        const sdfChildren = SDFSchemaProvider.getValidChildren('sdf');
        assert.ok(sdfChildren.includes('world'));
        assert.ok(sdfChildren.includes('model'));

        const worldChildren = SDFSchemaProvider.getValidChildren('world');
        assert.ok(worldChildren.includes('model'));
        assert.ok(worldChildren.includes('light'));
        assert.ok(worldChildren.includes('physics'));
    });

    it('should validate joint types', () => {
        const validTypes = ['revolute', 'prismatic', 'ball', 'universal', 'fixed', 'continuous'];
        validTypes.forEach(type => {
            assert.ok(SDFSchemaProvider.SDF_SCHEMA.validJointTypes.includes(type as any));
        });
    });

    it('should validate sensor types', () => {
        const validTypes = ['camera', 'ray', 'lidar', 'imu', 'gps', 'contact'];
        validTypes.forEach(type => {
            assert.ok(SDFSchemaProvider.SDF_SCHEMA.validSensorTypes.includes(type as any));
        });
    });

    it('should have consistent schema data', () => {
        // Test that all required attributes exist for known elements
        assert.ok(SDFSchemaProvider.SDF_SCHEMA.requiredAttributes['sdf']);
        assert.ok(SDFSchemaProvider.SDF_SCHEMA.requiredAttributes['world']);
        assert.ok(SDFSchemaProvider.SDF_SCHEMA.requiredAttributes['model']);
        assert.ok(SDFSchemaProvider.SDF_SCHEMA.requiredAttributes['link']);
        assert.ok(SDFSchemaProvider.SDF_SCHEMA.requiredAttributes['joint']);

        // Test that SDF elements include core elements
        const elements = SDFSchemaProvider.SDF_SCHEMA.sdfElements;
        assert.ok(elements.includes('sdf'));
        assert.ok(elements.includes('world'));
        assert.ok(elements.includes('model'));
        assert.ok(elements.includes('link'));
        assert.ok(elements.includes('joint'));
    });

    it('should handle edge cases in tag parsing', () => {
        // Test empty and malformed inputs
        assert.strictEqual(SDFSchemaProvider.extractTagName(''), null);
        assert.strictEqual(SDFSchemaProvider.extractTagName('not a tag'), null);
        assert.strictEqual(SDFSchemaProvider.extractTagName('< >'), null);
        
        // Test complex tag structures
        assert.strictEqual(SDFSchemaProvider.extractTagName('<joint type="revolute" name="test">'), 'joint');
        assert.strictEqual(SDFSchemaProvider.extractTagName('</joint>'), 'joint');
    });

    it('should correctly identify self-closing tags', () => {
        assert.strictEqual(SDFSchemaProvider.isSelfClosingTag('<pose/>'), true);
        assert.strictEqual(SDFSchemaProvider.isSelfClosingTag('<mass value="1.0"/>'), true);
        assert.strictEqual(SDFSchemaProvider.isSelfClosingTag('<pose>'), false);
        assert.strictEqual(SDFSchemaProvider.isSelfClosingTag('</pose>'), false);
    });

    it('should provide comprehensive joint type validation', () => {
        const allJointTypes = SDFSchemaProvider.SDF_SCHEMA.validJointTypes;
        assert.ok(allJointTypes.length > 0);
        
        // Test each joint type is a non-empty string
        allJointTypes.forEach(type => {
            assert.ok(typeof type === 'string');
            assert.ok(type.length > 0);
        });
    });

    it('should provide comprehensive sensor type validation', () => {
        const allSensorTypes = SDFSchemaProvider.SDF_SCHEMA.validSensorTypes;
        assert.ok(allSensorTypes.length > 0);
        
        // Test each sensor type is a non-empty string
        allSensorTypes.forEach(type => {
            assert.ok(typeof type === 'string');
            assert.ok(type.length > 0);
        });
    });
});