import * as vscode from 'vscode';
export declare class SDFLanguageProvider {
    static readonly SDF_LANGUAGE_ID = "sdf";
    static readonly SDF_FILE_EXTENSIONS: string[];
    static isSDFDocument(document: vscode.TextDocument): boolean;
    static getSDFDocuments(): vscode.TextDocument[];
    static getDocumentSelector(): vscode.DocumentSelector;
    static readonly SDF_SCHEMA: {
        requiredAttributes: {
            readonly sdf: readonly ["version"];
            readonly world: readonly ["name"];
            readonly model: readonly ["name"];
            readonly link: readonly ["name"];
            readonly joint: readonly ["name", "type"];
            readonly sensor: readonly ["name", "type"];
            readonly plugin: readonly ["name", "filename"];
        };
        validChildren: {
            readonly sdf: readonly ["world", "model"];
            readonly world: readonly ["include", "model", "light", "physics", "scene", "state", "population", "plugin"];
            readonly model: readonly ["link", "joint", "plugin", "gripper", "pose", "static", "self_collide"];
            readonly link: readonly ["inertial", "collision", "visual", "sensor", "pose", "kinematic", "gravity", "enable_wind"];
            readonly visual: readonly ["geometry", "material", "pose", "cast_shadows", "transparency"];
            readonly collision: readonly ["geometry", "surface", "pose"];
            readonly geometry: readonly ["box", "sphere", "cylinder", "plane", "mesh", "polyline", "capsule", "ellipsoid"];
            readonly inertial: readonly ["mass", "inertia", "pose"];
            readonly inertia: readonly ["ixx", "ixy", "ixz", "iyy", "iyz", "izz"];
        };
        validJointTypes: readonly ["revolute", "prismatic", "ball", "universal", "fixed", "continuous"];
        validSensorTypes: readonly ["camera", "ray", "lidar", "imu", "gps", "contact", "force_torque", "magnetometer", "altimeter"];
        sdfElements: readonly ["sdf", "world", "model", "link", "joint", "visual", "collision", "inertial", "geometry", "box", "sphere", "cylinder", "plane", "mesh", "material", "pose", "mass", "inertia", "sensor", "camera", "ray", "plugin", "include", "uri", "physics", "light", "scene", "state"];
    };
    static extractTagName(tagString: string): string | null;
    static isOpeningTag(tagString: string): boolean;
    static isClosingTag(tagString: string): boolean;
    static isSelfClosingTag(tagString: string): boolean;
    static getParentTagContext(document: vscode.TextDocument, position: vscode.Position): string | null;
    static getRequiredAttributes(tagName: string): readonly string[];
    static getValidChildren(tagName: string): readonly string[];
    static getRequiredAttributesCopy(tagName: string): string[];
    static getValidChildrenCopy(tagName: string): string[];
}
//# sourceMappingURL=languageProvider.d.ts.map