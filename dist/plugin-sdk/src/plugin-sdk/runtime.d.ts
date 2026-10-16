import type { RuntimeEnv } from "../runtime.js";
export type { RuntimeEnv } from "../runtime.js";
export { createNonExitingRuntime, defaultRuntime } from "../runtime.js";
export { danger, info, isVerbose, isYes, logVerbose, logVerboseConsole, setVerbose, setYes, shouldLogVerbose, success, warn, } from "../globals.js";
export * from "../logging.js";
export { waitForAbortSignal } from "../infra/abort-signal.js";
export { registerUnhandledRejectionHandler } from "../infra/unhandled-rejections.js";
type LoggerLike = {
    info: (message: string) => void;
    error: (message: string) => void;
};
/** Adapt a simple logger into the RuntimeEnv contract used by shared plugin SDK helpers. */
export declare function createLoggerBackedRuntime(params: {
    logger: LoggerLike;
    exitError?: (code: number) => Error;
}): RuntimeEnv;
/** Reuse an existing runtime when present, otherwise synthesize one from the provided logger. */
export declare function resolveRuntimeEnv(params: {
    runtime?: RuntimeEnv;
    logger: LoggerLike;
    exitError?: (code: number) => Error;
}): RuntimeEnv;
/** Resolve a runtime that treats exit requests as unsupported errors instead of process termination. */
export declare function resolveRuntimeEnvWithUnavailableExit(params: {
    runtime?: RuntimeEnv;
    logger: LoggerLike;
    unavailableMessage?: string;
}): RuntimeEnv;
