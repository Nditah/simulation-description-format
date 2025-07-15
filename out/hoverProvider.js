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
exports.SDFHoverProvider = void 0;
const vscode = __importStar(require("vscode"));
class SDFHoverProvider {
    provideHover(document, position, _token) {
        const range = document.getWordRangeAtPosition(position);
        if (!range)
            return;
        const word = document.getText(range);
        const line = document.lineAt(position);
        // Check if we're hovering over a tag
        if (line.text.includes(`<${word}`) || line.text.includes(`</${word}`)) {
            const markdown = new vscode.MarkdownString();
            markdown.appendCodeblock(word, 'xml');
            markdown.appendMarkdown(this.getElementDocumentation(word));
            return new vscode.Hover(markdown);
        }
        return undefined;
    }
    getElementDocumentation(element) {
        const docs = {
            'sdf': 'Root element of an SDF file',
            'world': 'Defines a simulation world',
            'model': 'Defines a model with links and joints',
            'link': 'Physical link in a model',
            'joint': 'Connection between two links',
            'visual': 'Visual representation',
            'collision': 'Collision properties'
        };
        return docs[element] || `SDF element: ${element}`;
    }
}
exports.SDFHoverProvider = SDFHoverProvider;
//# sourceMappingURL=hoverProvider.js.map