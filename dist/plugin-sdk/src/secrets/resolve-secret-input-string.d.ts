import type { WormAgentConfig } from "../config/config.js";
import { type SecretRef } from "../config/types.secrets.js";
type SecretDefaults = NonNullable<WormAgentConfig["secrets"]>["defaults"];
export declare function resolveSecretInputString(params: {
    config: WormAgentConfig;
    value: unknown;
    env: NodeJS.ProcessEnv;
    defaults?: SecretDefaults;
    normalize?: (value: unknown) => string | undefined;
    onResolveRefError?: (error: unknown, ref: SecretRef) => never;
}): Promise<string | undefined>;
export {};
