/** Lowercase and optionally strip prefixes from allowlist entries before sender comparisons. */
export declare function formatAllowFromLowercase(params: {
    allowFrom: Array<string | number>;
    stripPrefixRe?: RegExp;
}): string[];
/** Normalize allowlist entries through a channel-provided parser or canonicalizer. */
export declare function formatNormalizedAllowFromEntries(params: {
    allowFrom: Array<string | number>;
    normalizeEntry: (entry: string) => string | undefined | null;
}): string[];
/** Check whether a sender id matches a simple normalized allowlist with wildcard support. */
export declare function isNormalizedSenderAllowed(params: {
    senderId: string | number;
    allowFrom: Array<string | number>;
    stripPrefixRe?: RegExp;
}): boolean;
type ParsedChatAllowTarget = {
    kind: "chat_id";
    chatId: number;
} | {
    kind: "chat_guid";
    chatGuid: string;
} | {
    kind: "chat_identifier";
    chatIdentifier: string;
} | {
    kind: "handle";
    handle: string;
};
/** Match chat-aware allowlist entries against sender, chat id, guid, or identifier fields. */
export declare function isAllowedParsedChatSender<TParsed extends ParsedChatAllowTarget>(params: {
    allowFrom: Array<string | number>;
    sender: string;
    chatId?: number | null;
    chatGuid?: string | null;
    chatIdentifier?: string | null;
    normalizeSender: (sender: string) => string;
    parseAllowTarget: (entry: string) => TParsed;
}): boolean;
export {};
