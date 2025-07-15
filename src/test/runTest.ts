import * as path from 'path';
import { runTests } from '@vscode/test-electron';
import * as assert from 'assert';
import * as vscode from 'vscode';
import { SDFLanguageProvider } from './../languageProvider';
import { SDFDiagnosticProvider } from './../diagnosticProvider';

async function main() {
    try {
        // The folder containing the Extension Manifest package.json
        // Passed to `--extensionDevelopmentPath`
        const extensionDevelopmentPath = path.resolve(__dirname, '../../');

        // The path to test runner
        // Passed to --extensionTestsPath
        const extensionTestsPath = path.resolve(__dirname, './suite/index');

        // Download VS Code, unzip it and run the integration test
        await runTests({ extensionDevelopmentPath, extensionTestsPath });
    } catch (err) {
        console.error('Failed to run tests', err);
        process.exit(1);
    }
}

main();

suite('SDF Extension Test Suite', () => {
    vscode.window.showInformationMessage('Start all tests.');

    suite('SDFLanguageProvider Tests', () => {
        test('SDF document detection by language ID', () => {
            const mockDoc = {
                languageId: 'sdf',
                fileName: 'test.sdf'
            } as vscode.TextDocument;
            
            assert.strictEqual(SDFLanguageProvider.isSDFDocument(mockDoc), true);
        });

        test('SDF document detection by file extension', () => {
            const mockDoc = {
                languageId: 'xml',
                fileName: 'robot.sdf'
            } as vscode.TextDocument;
            
            assert.strictEqual(SDFLanguageProvider.isSDFDocument(mockDoc), true);
        });

        test('World file detection', () => {
            const mockDoc = {
                languageId: 'xml',
                fileName: 'simulation.world'
            } as vscode.TextDocument;
            
            assert.strictEqual(SDFLanguageProvider.isSDFDocument(mockDoc), true);
        });

        test('Non-SDF file rejection', () => {
            const mockDoc = {
                languageId: 'javascript',
                fileName: 'script.js'
            } as vscode.TextDocument;
            
            assert.strictEqual(SDFLanguageProvider.isSDFDocument(mockDoc), false);
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
    });

    suite('Schema Validation Tests', () => {
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

        test('SDF elements coverage', () => {
            const elements = SDFLanguageProvider.SDF_SCHEMA.sdfElements;
            assert.ok(elements.includes('sdf'));
            assert.ok(elements.includes('world'));
            assert.ok(elements.includes('model'));
            assert.ok(elements.includes('link'));
            assert.ok(elements.includes('joint'));
            assert.ok(elements.includes('sensor'));
        });
    });

    suite('Diagnostic Provider Tests', () => {
        test('Diagnostic provider instantiation', () => {
            const provider = new SDFDiagnosticProvider();
            assert.ok(provider);
        });

        // Note: More comprehensive diagnostic tests would require mock documents
        // and VS Code diagnostic collection setup
    });
});