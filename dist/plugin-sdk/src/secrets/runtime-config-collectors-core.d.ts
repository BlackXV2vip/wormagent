import type { WormAgentConfig } from "../config/config.js";
import { type ResolverContext, type SecretDefaults } from "./runtime-shared.js";
export declare function collectCoreConfigAssignments(params: {
    config: WormAgentConfig;
    defaults: SecretDefaults | undefined;
    context: ResolverContext;
}): void;
