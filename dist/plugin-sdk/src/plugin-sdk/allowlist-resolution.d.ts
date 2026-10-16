export type BasicAllowlistResolutionEntry = {
    input: string;
    resolved: boolean;
    id?: string;
    name?: string;
    note?: string;
};
/** Clone allowlist resolution entries into a plain serializable shape for UI and docs output. */
export declare function mapBasicAllowlistResolutionEntries(entries: BasicAllowlistResolutionEntry[]): BasicAllowlistResolutionEntry[];
/** Map allowlist inputs sequentially so resolver side effects stay ordered and predictable. */
export declare function mapAllowlistResolutionInputs<T>(params: {
    inputs: string[];
    mapInput: (input: string) => Promise<T> | T;
}): Promise<T[]>;
