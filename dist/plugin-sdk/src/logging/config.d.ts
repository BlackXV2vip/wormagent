import type { WormAgentConfig } from "../config/types.js";
type LoggingConfig = WormAgentConfig["logging"];
export declare function readLoggingConfig(): LoggingConfig | undefined;
export {};
