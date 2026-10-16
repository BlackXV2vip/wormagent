import type { WormAgentConfig } from "./config.js";
import type { AgentAcpBinding, AgentBinding, AgentRouteBinding } from "./types.agents.js";
export type ConfiguredBindingRule = AgentBinding;
export declare function isRouteBinding(binding: AgentBinding): binding is AgentRouteBinding;
export declare function isAcpBinding(binding: AgentBinding): binding is AgentAcpBinding;
export declare function listConfiguredBindings(cfg: WormAgentConfig): AgentBinding[];
export declare function listRouteBindings(cfg: WormAgentConfig): AgentRouteBinding[];
export declare function listAcpBindings(cfg: WormAgentConfig): AgentAcpBinding[];
