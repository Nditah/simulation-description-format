import * as assert from 'assert';
import { SDFLanguageProvider } from '../../languageProvider';

// Mock VS Code document for testing
interface MockTextDocument {
    languageId: string;
    fileName: string;
}

suite('SDF Extension Test Suite', () => {
    console.log('Starting SDF Extension Tests');

    test('SDF document detection by language ID', () => {
        const mockDoc = {
            languageId: 'sdf',
            fileName: 'test.sdf'
        } as MockTextDocument;
        
        // Type assertion to match VS Code TextDocument interface
        assert.strictEqual(SDFLanguageProvider.isSDFDocument(mockDoc as any), true);
    });

    test('SDF document detection by file extension', () => {
        const mockDoc = {
            languageId: 'xml',
            fileName: 'robot.sdf'
        } as MockTextDocument;
        
        assert.strictEqual(SDFLanguageProvider.isSDFDocument(mockDoc as any), true);
    });

    test('World file detection', () => {
        const mockDoc = {
            languageId: 'xml',
            fileName: 'simulation.world'
        } as MockTextDocument;
        
        assert.strictEqual(SDFLanguageProvider.isSDFDocument(mockDoc as any), true);
    });

    test('Non-SDF file rejection', () => {
        const mockDoc = {
            languageId: 'javascript',
            fileName: 'script.js'
        } as MockTextDocument;
        
        assert.strictEqual(SDFLanguageProvider.isSDFDocument(mockDoc as any), false);
    });

    test('Tag name extraction', () => {
        assert.strictEqual(SDFLanguageProvider.extractTagName('<model>'), 'model');
        assert.strictEqual(SDFLanguageProvider.extractTagName('</world>'), 'world');
        assert.strictEqual(SDFLanguageProvider.extractTagName('<link name="test">'), 'link');
        assert.strictEqual(SDFLanguageProvider.extractTagName('invalid'), null);
    });

    test('Tag type detection', () => {
        assert.strictEqual(SDFLanguageProvider.isOpeningTag('<model>'), true);
        assert.strictEqual(SDFLanguageProvider.isOpeningTag('</model>'), false);
        assert.strictEqual(SDFLanguageProvider.isClosingTag('</model>'), true);
        assert.strictEqual(SDFLanguageProvider.isClosingTag('<model>'), false);
        assert.strictEqual(SDFLanguageProvider.isSelfClosingTag('<pose/>'), true);
        assert.strictEqual(SDFLanguageProvider.isSelfClosingTag('<pose>'), false);
    });

    test('Required attributes validation', () => {
        const jointAttrs = SDFLanguageProvider.getRequiredAttributes('joint');
        assert.ok(jointAttrs.includes('name'));
        assert.ok(jointAttrs.includes('type'));

        const sdfAttrs = SDFLanguageProvider.getRequiredAttributes('sdf');
        assert.ok(sdfAttrs.includes('version'));

        const unknownAttrs = SDFLanguageProvider.getRequiredAttributes('unknown');
        assert.strictEqual(unknownAttrs.length, 0);
    });

    test('Valid children validation', () => {
        const sdfChildren = SDFLanguageProvider.getValidChildren('sdf');
        assert.ok(sdfChildren.includes('world'));
        assert.ok(sdfChildren.includes('model'));

        const worldChildren = SDFLanguageProvider.getValidChildren('world');
        assert.ok(worldChildren.includes('model'));
        assert.ok(worldChildren.includes('light'));
        assert.ok(worldChildren.includes('physics'));
    });

    test('Joint types validation', () => {
        const validTypes = ['revolute', 'prismatic', 'ball', 'universal', 'fixed', 'continuous'];
        validTypes.forEach(type => {
            assert.ok(SDFLanguageProvider.SDF_SCHEMA.validJointTypes.includes(type as any));
        });
    });

    test('Sensor types validation', () => {
        const validTypes = ['camera', 'ray', 'lidar', 'imu', 'gps', 'contact'];
        validTypes.forEach(type => {
            assert.ok(SDFLanguageProvider.SDF_SCHEMA.validSensorTypes.includes(type as any));
        });
    });
});