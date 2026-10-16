import type { WormAgentConfig } from "../config/config.js";
import { GatewayClient, type GatewayClientOptions } from "./client.js";
export declare function createOperatorApprovalsGatewayClient(params: Pick<GatewayClientOptions, "clientDisplayName" | "onClose" | "onConnectError" | "onEvent" | "onHelloOk"> & {
    config: WormAgentConfig;
    gatewayUrl?: string;
}): Promise<GatewayClient>;
