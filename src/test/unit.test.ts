import * as assert from 'assert';
import { SDFLanguageProvider } from '../languageProvider';
import { SDFSchemaProvider } from '../sdfSchema';

describe('SDF Language Provider Unit Tests', () => {
    
    it('should detect SDF documents by language ID', () => {
        const mockDoc = {
            languageId: 'sdf',
            fileName: 'test.sdf'
        } as any;
        
        assert.strictEqual(SDFLanguageProvider.isSDFDocument(mockDoc), true);
    });

    it('should detect SDF documents by file extension', () => {
        const mockDoc = {
            languageId: 'xml',
            fileName: 'robot.sdf'
        } as any;
        
        assert.strictEqual(SDFLanguageProvider.isSDFDocument(mockDoc), true);
    });

    it('should extract tag names correctly', () => {
        assert.strictEqual(SDFLanguageProvider.extractTagName('<model>'), 'model');
        assert.strictEqual(SDFLanguageProvider.extractTagName('</world>'), 'world');
        assert.strictEqual(SDFLanguageProvider.extractTagName('<link name="test">'), 'link');
        assert.strictEqual(SDFLanguageProvider.extractTagName('invalid'), null);
    });

    it('should detect tag types correctly', () => {
        assert.strictEqual(SDFLanguageProvider.isOpeningTag('<model>'), true);
        assert.strictEqual(SDFLanguageProvider.isOpeningTag('</model>'), false);
        assert.strictEqual(SDFLanguageProvider.isClosingTag('</model>'), true);
        assert.strictEqual(SDFLanguageProvider.isClosingTag('<model>'), false);
        assert.strictEqual(SDFLanguageProvider.isSelfClosingTag('<pose/>'), true);
        assert.strictEqual(SDFLanguageProvider.isSelfClosingTag('<pose>'), false);
    });

    it('should return required attributes', () => {
        const jointAttrs = SDFLanguageProvider.getRequiredAttributes('joint');
        assert.ok(jointAttrs.includes('name'));
        assert.ok(jointAttrs.includes('type'));

        const sdfAttrs = SDFLanguageProvider.getRequiredAttributes('sdf');
        assert.ok(sdfAttrs.includes('version'));

        const unknownAttrs = SDFLanguageProvider.getRequiredAttributes('unknown');
        assert.strictEqual(unknownAttrs.length, 0);
    });

    it('should validate joint types', () => {
        const validTypes = ['revolute', 'prismatic', 'ball', 'universal', 'fixed', 'continuous'];
        validTypes.forEach(type => {
            assert.ok(SDFLanguageProvider.SDF_SCHEMA.validJointTypes.includes(type as any));
        });
    });
});

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
});