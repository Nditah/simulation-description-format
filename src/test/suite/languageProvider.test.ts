import * as assert from 'assert';
import { SDFLanguageProvider } from '../../languageProvider';

suite('Language Provider Unit Tests', () => {
    
    test('Schema definitions exist', () => {
        assert.ok(SDFLanguageProvider.SDF_SCHEMA);
        assert.ok(SDFLanguageProvider.SDF_SCHEMA.requiredAttributes);
        assert.ok(SDFLanguageProvider.SDF_SCHEMA.validChildren);
        assert.ok(SDFLanguageProvider.SDF_SCHEMA.validJointTypes);
        assert.ok(SDFLanguageProvider.SDF_SCHEMA.validSensorTypes);
    });

    test('Static utility methods work', () => {
        // Test tag name extraction
        assert.strictEqual(SDFLanguageProvider.extractTagName('<world>'), 'world');
        assert.strictEqual(SDFLanguageProvider.extractTagName('</model>'), 'model');
        assert.strictEqual(SDFLanguageProvider.extractTagName('invalid'), null);

        // Test tag type detection
        assert.strictEqual(SDFLanguageProvider.isOpeningTag('<test>'), true);
        assert.strictEqual(SDFLanguageProvider.isClosingTag('</test>'), true);
        assert.strictEqual(SDFLanguageProvider.isSelfClosingTag('<test/>'), true);
    });

    test('Required attributes lookup', () => {
        const jointAttrs = SDFLanguageProvider.getRequiredAttributes('joint');
        assert.ok(Array.isArray(jointAttrs));
        assert.ok(jointAttrs.length > 0);
        assert.ok(jointAttrs.includes('name'));
        assert.ok(jointAttrs.includes('type'));
    });

    test('Valid children lookup', () => {
        const sdfChildren = SDFLanguageProvider.getValidChildren('sdf');
        assert.ok(Array.isArray(sdfChildren));
        assert.ok(sdfChildren.includes('world'));
        assert.ok(sdfChildren.includes('model'));
    });
});