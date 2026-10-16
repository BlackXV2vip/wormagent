import type { CommandNormalizeOptions } from "../auto-reply/commands-registry.js";
import { createInboundDebouncer, type InboundDebounceCreateParams } from "../auto-reply/inbound-debounce.js";
import type { WormAgentConfig } from "../config/types.js";
export declare function shouldDebounceTextInbound(params: {
    text: string | null | undefined;
    cfg: WormAgentConfig;
    hasMedia?: boolean;
    commandOptions?: CommandNormalizeOptions;
    allowDebounce?: boolean;
}): boolean;
export declare function createChannelInboundDebouncer<T>(params: Omit<InboundDebounceCreateParams<T>, "debounceMs"> & {
    cfg: WormAgentConfig;
    channel: string;
    debounceMsOverride?: number;
}): {
    debounceMs: number;
    debouncer: ReturnType<typeof createInboundDebouncer<T>>;
};
