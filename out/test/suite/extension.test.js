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
const languageProvider_1 = require("../../languageProvider");
suite('SDF Extension Test Suite', () => {
    console.log('Starting SDF Extension Tests');
    test('SDF document detection by language ID', () => {
        const mockDoc = {
            languageId: 'sdf',
            fileName: 'test.sdf'
        };
        // Type assertion to match VS Code TextDocument interface
        assert.strictEqual(languageProvider_1.SDFLanguageProvider.isSDFDocument(mockDoc), true);
    });
    test('SDF document detection by file extension', () => {
        const mockDoc = {
            languageId: 'xml',
            fileName: 'robot.sdf'
        };
        assert.strictEqual(languageProvider_1.SDFLanguageProvider.isSDFDocument(mockDoc), true);
    });
    test('World file detection', () => {
        const mockDoc = {
            languageId: 'xml',
            fileName: 'simulation.world'
        };
        assert.strictEqual(languageProvider_1.SDFLanguageProvider.isSDFDocument(mockDoc), true);
    });
    test('Non-SDF file rejection', () => {
        const mockDoc = {
            languageId: 'javascript',
            fileName: 'script.js'
        };
        assert.strictEqual(languageProvider_1.SDFLanguageProvider.isSDFDocument(mockDoc), false);
    });
    test('Tag name extraction', () => {
        assert.strictEqual(languageProvider_1.SDFLanguageProvider.extractTagName('<model>'), 'model');
        assert.strictEqual(languageProvider_1.SDFLanguageProvider.extractTagName('</world>'), 'world');
        assert.strictEqual(languageProvider_1.SDFLanguageProvider.extractTagName('<link name="test">'), 'link');
        assert.strictEqual(languageProvider_1.SDFLanguageProvider.extractTagName('invalid'), null);
    });
    test('Tag type detection', () => {
        assert.strictEqual(languageProvider_1.SDFLanguageProvider.isOpeningTag('<model>'), true);
        assert.strictEqual(languageProvider_1.SDFLanguageProvider.isOpeningTag('</model>'), false);
        assert.strictEqual(languageProvider_1.SDFLanguageProvider.isClosingTag('</model>'), true);
        assert.strictEqual(languageProvider_1.SDFLanguageProvider.isClosingTag('<model>'), false);
        assert.strictEqual(languageProvider_1.SDFLanguageProvider.isSelfClosingTag('<pose/>'), true);
        assert.strictEqual(languageProvider_1.SDFLanguageProvider.isSelfClosingTag('<pose>'), false);
    });
    test('Required attributes validation', () => {
        const jointAttrs = languageProvider_1.SDFLanguageProvider.getRequiredAttributes('joint');
        assert.ok(jointAttrs.includes('name'));
        assert.ok(jointAttrs.includes('type'));
        const sdfAttrs = languageProvider_1.SDFLanguageProvider.getRequiredAttributes('sdf');
        assert.ok(sdfAttrs.includes('version'));
        const unknownAttrs = languageProvider_1.SDFLanguageProvider.getRequiredAttributes('unknown');
        assert.strictEqual(unknownAttrs.length, 0);
    });
    test('Valid children validation', () => {
        const sdfChildren = languageProvider_1.SDFLanguageProvider.getValidChildren('sdf');
        assert.ok(sdfChildren.includes('world'));
        assert.ok(sdfChildren.includes('model'));
        const worldChildren = languageProvider_1.SDFLanguageProvider.getValidChildren('world');
        assert.ok(worldChildren.includes('model'));
        assert.ok(worldChildren.includes('light'));
        assert.ok(worldChildren.includes('physics'));
    });
    test('Joint types validation', () => {
        const validTypes = ['revolute', 'prismatic', 'ball', 'universal', 'fixed', 'continuous'];
        validTypes.forEach(type => {
            assert.ok(languageProvider_1.SDFLanguageProvider.SDF_SCHEMA.validJointTypes.includes(type));
        });
    });
    test('Sensor types validation', () => {
        const validTypes = ['camera', 'ray', 'lidar', 'imu', 'gps', 'contact'];
        validTypes.forEach(type => {
            assert.ok(languageProvider_1.SDFLanguageProvider.SDF_SCHEMA.validSensorTypes.includes(type));
        });
    });
});
//# sourceMappingURL=extension.test.js.map