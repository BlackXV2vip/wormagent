import type { WormAgentConfig } from "../config/config.js";
export declare function getPath(root: unknown, segments: string[]): unknown;
export declare function setPathCreateStrict(root: WormAgentConfig, segments: string[], value: unknown): boolean;
export declare function setPathExistingStrict(root: WormAgentConfig, segments: string[], value: unknown): boolean;
export declare function deletePathStrict(root: WormAgentConfig, segments: string[]): boolean;
