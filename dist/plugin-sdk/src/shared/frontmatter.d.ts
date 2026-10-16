export declare function normalizeStringList(input: unknown): string[];
export declare function getFrontmatterString(frontmatter: Record<string, unknown>, key: string): string | undefined;
export declare function parseFrontmatterBool(value: string | undefined, fallback: boolean): boolean;
export declare function resolveWormAgentManifestBlock(params: {
    frontmatter: Record<string, unknown>;
    key?: string;
}): Record<string, unknown> | undefined;
export type WormAgentManifestRequires = {
    bins: string[];
    anyBins: string[];
    env: string[];
    config: string[];
};
export declare function resolveWormAgentManifestRequires(metadataObj: Record<string, unknown>): WormAgentManifestRequires | undefined;
export declare function resolveWormAgentManifestInstall<T>(metadataObj: Record<string, unknown>, parseInstallSpec: (input: unknown) => T | undefined): T[];
export declare function resolveWormAgentManifestOs(metadataObj: Record<string, unknown>): string[];
export type ParsedWormAgentManifestInstallBase = {
    raw: Record<string, unknown>;
    kind: string;
    id?: string;
    label?: string;
    bins?: string[];
};
export declare function parseWormAgentManifestInstallBase(input: unknown, allowedKinds: readonly string[]): ParsedWormAgentManifestInstallBase | undefined;
export declare function applyWormAgentManifestInstallCommonFields<T extends {
    id?: string;
    label?: string;
    bins?: string[];
}>(spec: T, parsed: Pick<ParsedWormAgentManifestInstallBase, "id" | "label" | "bins">): T;
