export declare const WORMAGENT_CLI_ENV_VAR = "WORMAGENT_CLI";
export declare const WORMAGENT_CLI_ENV_VALUE = "1";
export declare function markWormAgentExecEnv<T extends Record<string, string | undefined>>(env: T): T;
export declare function ensureWormAgentExecMarkerOnProcess(env?: NodeJS.ProcessEnv): NodeJS.ProcessEnv;
