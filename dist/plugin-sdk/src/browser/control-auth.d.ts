import type { WormAgentConfig } from "../config/config.js";
export type BrowserControlAuth = {
    token?: string;
    password?: string;
};
export declare function resolveBrowserControlAuth(cfg: WormAgentConfig | undefined, env?: NodeJS.ProcessEnv): BrowserControlAuth;
export declare function ensureBrowserControlAuth(params: {
    cfg: WormAgentConfig;
    env?: NodeJS.ProcessEnv;
}): Promise<{
    auth: BrowserControlAuth;
    generatedToken?: string;
}>;
