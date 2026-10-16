import type { WormAgentConfig } from "../config/config.js";
import type { ImageGenerationProviderPlugin } from "../plugins/types.js";
export declare function listImageGenerationProviders(cfg?: WormAgentConfig): ImageGenerationProviderPlugin[];
export declare function getImageGenerationProvider(providerId: string | undefined, cfg?: WormAgentConfig): ImageGenerationProviderPlugin | undefined;
