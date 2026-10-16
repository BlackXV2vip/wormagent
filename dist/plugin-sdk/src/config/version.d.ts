export type WormAgentVersion = {
    major: number;
    minor: number;
    patch: number;
    revision: number;
};
export declare function parseWormAgentVersion(raw: string | null | undefined): WormAgentVersion | null;
export declare function compareWormAgentVersions(a: string | null | undefined, b: string | null | undefined): number | null;
