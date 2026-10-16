import type { WormAgentConfig } from "../../config/config.js";
import type { CompiledConfiguredBinding, ConfiguredBindingChannel } from "./binding-types.js";
export type CompiledConfiguredBindingRegistry = {
    rulesByChannel: Map<ConfiguredBindingChannel, CompiledConfiguredBinding[]>;
};
export declare function resolveCompiledBindingRegistry(cfg: WormAgentConfig): CompiledConfiguredBindingRegistry;
export declare function primeCompiledBindingRegistry(cfg: WormAgentConfig): CompiledConfiguredBindingRegistry;
export declare function countCompiledBindingRegistry(registry: CompiledConfiguredBindingRegistry): {
    bindingCount: number;
    channelCount: number;
};
