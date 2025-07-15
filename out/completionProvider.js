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
exports.SDFCompletionProvider = void 0;
const vscode = __importStar(require("vscode"));
class SDFCompletionProvider {
    constructor() {
        this.sdfElements = [
            'sdf', 'world', 'model', 'link', 'joint', 'visual', 'collision',
            'geometry', 'box', 'sphere', 'cylinder', 'pose', 'mass'
        ];
    }
    provideCompletionItems(document, position, _token, _context) {
        const line = document.lineAt(position);
        const lineText = line.text;
        const beforeCursor = lineText.substring(0, position.character);
        // Tag completion
        if (beforeCursor.endsWith('<')) {
            return this.sdfElements.map(element => {
                const item = new vscode.CompletionItem(element, vscode.CompletionItemKind.Class);
                item.insertText = `${element}>$0</${element}>`;
                return item;
            });
        }
        return [];
    }
}
exports.SDFCompletionProvider = SDFCompletionProvider;
//# sourceMappingURL=completionProvider.js.map