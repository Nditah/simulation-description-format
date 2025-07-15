import * as assert from 'assert';
import * as vscode from 'vscode';
import { SDFLanguageProvider } from '../../languageProvider';

suite('SDF Extension Test Suite', () => {
    vscode.window.showInformationMessage('Start all tests.');

    test('SDF document detection', () => {
        const mockDoc = {
            languageId: 'sdf',
            fileName: 'test.sdf'
        } as vscode.TextDocument;
        
        assert.strictEqual(SDFLanguageProvider.isSDFDocument(mockDoc), true);
    });

    test('Tag name extraction', () => {
        assert.strictEqual(SDFLanguageProvider.extractTagName('<model>'), 'model');
        assert.strictEqual(SDFLanguageProvider.extractTagName('</world>'), 'world');
    });

    test('Required attributes validation', () => {
        const attrs = SDFLanguageProvider.getRequiredAttributes('joint');
        assert.ok(attrs.includes('name'));
        assert.ok(attrs.includes('type'));
    });
});