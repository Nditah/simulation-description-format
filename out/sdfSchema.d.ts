export interface SDFSchema {
    readonly requiredAttributes: {
        readonly [key: string]: readonly string[];
    };
    readonly validChildren: {
        readonly [key: string]: readonly string[];
    };
    readonly validJointTypes: readonly string[];
    readonly validSensorTypes: readonly string[];
    readonly sdfElements: readonly string[];
}
export declare class SDFSchemaProvider {
    static readonly SDF_SCHEMA: SDFSchema;
    static readonly SDF_FILE_EXTENSIONS: string[];
    static readonly SDF_LANGUAGE_ID = "sdf";
    static extractTagName(tagString: string): string | null;
    static isOpeningTag(tagString: string): boolean;
    static isClosingTag(tagString: string): boolean;
    static isSelfClosingTag(tagString: string): boolean;
    static getRequiredAttributes(tagName: string): readonly string[];
    static getValidChildren(tagName: string): readonly string[];
    static isSDFFile(fileName: string): boolean;
    static isSDFLanguage(languageId: string): boolean;
}
//# sourceMappingURL=sdfSchema.d.ts.map