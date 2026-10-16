//#region src/plugin-sdk/reply-payload.ts
/** Extract the supported outbound reply fields from loose tool or agent payload objects. */
function normalizeOutboundReplyPayload(payload) {
	return {
		text: typeof payload.text === "string" ? payload.text : void 0,
		mediaUrls: Array.isArray(payload.mediaUrls) ? payload.mediaUrls.filter((entry) => typeof entry === "string" && entry.length > 0) : void 0,
		mediaUrl: typeof payload.mediaUrl === "string" ? payload.mediaUrl : void 0,
		replyToId: typeof payload.replyToId === "string" ? payload.replyToId : void 0
	};
}
/** Wrap a deliverer so callers can hand it arbitrary payloads while channels receive normalized data. */
function createNormalizedOutboundDeliverer(handler) {
	return async (payload) => {
		await handler(payload && typeof payload === "object" ? normalizeOutboundReplyPayload(payload) : {});
	};
}
/** Prefer multi-attachment payloads, then fall back to the legacy single-media field. */
function resolveOutboundMediaUrls(payload) {
	if (payload.mediaUrls?.length) return payload.mediaUrls;
	if (payload.mediaUrl) return [payload.mediaUrl];
	return [];
}
/** Count outbound media items after legacy single-media fallback normalization. */
function countOutboundMedia(payload) {
	return resolveOutboundMediaUrls(payload).length;
}
/** Check whether an outbound payload includes any media after normalization. */
function hasOutboundMedia(payload) {
	return countOutboundMedia(payload) > 0;
}
/** Check whether an outbound payload includes text, optionally trimming whitespace first. */
function hasOutboundText(payload, options) {
	const text = options?.trim ? payload.text?.trim() : payload.text;
	return Boolean(text);
}
/** Check whether an outbound payload includes any sendable text or media. */
function hasOutboundReplyContent(payload, options) {
	return hasOutboundText(payload, { trim: options?.trimText }) || hasOutboundMedia(payload);
}
/** Normalize reply payload text/media into a trimmed, sendable shape for delivery paths. */
function resolveSendableOutboundReplyParts(payload, options) {
	const text = options?.text ?? payload.text ?? "";
	const trimmedText = text.trim();
	const mediaUrls = resolveOutboundMediaUrls(payload).map((entry) => entry.trim()).filter(Boolean);
	const mediaCount = mediaUrls.length;
	const hasText = Boolean(trimmedText);
	const hasMedia = mediaCount > 0;
	return {
		text,
		trimmedText,
		mediaUrls,
		mediaCount,
		hasText,
		hasMedia,
		hasContent: hasText || hasMedia
	};
}
/** Preserve caller-provided chunking, but fall back to the full text when chunkers return nothing. */
function resolveTextChunksWithFallback(text, chunks) {
	if (chunks.length > 0) return [...chunks];
	if (!text) return [];
	return [text];
}
/** Send media-first payloads intact, or chunk text-only payloads through the caller's transport hooks. */
async function sendPayloadWithChunkedTextAndMedia(params) {
	const payload = params.ctx.payload;
	const text = payload.text ?? "";
	const urls = resolveOutboundMediaUrls(payload);
	if (!text && urls.length === 0) return params.emptyResult;
	if (urls.length > 0) {
		let lastResult = await params.sendMedia({
			...params.ctx,
			text,
			mediaUrl: urls[0]
		});
		for (let i = 1; i < urls.length; i++) lastResult = await params.sendMedia({
			...params.ctx,
			text: "",
			mediaUrl: urls[i]
		});
		return lastResult;
	}
	const limit = params.textChunkLimit;
	const chunks = limit && params.chunker ? params.chunker(text, limit) : [text];
	let lastResult;
	for (const chunk of chunks) lastResult = await params.sendText({
		...params.ctx,
		text: chunk
	});
	return lastResult;
}
/** Detect numeric-looking target ids for channels that distinguish ids from handles. */
function isNumericTargetId(raw) {
	const trimmed = raw.trim();
	if (!trimmed) return false;
	return /^\d{3,}$/.test(trimmed);
}
/** Append attachment links to plain text when the channel cannot send media inline. */
function formatTextWithAttachmentLinks(text, mediaUrls) {
	const trimmedText = text?.trim() ?? "";
	if (!trimmedText && mediaUrls.length === 0) return "";
	const mediaBlock = mediaUrls.length ? mediaUrls.map((url) => `Attachment: ${url}`).join("\n") : "";
	if (!trimmedText) return mediaBlock;
	if (!mediaBlock) return trimmedText;
	return `${trimmedText}\n\n${mediaBlock}`;
}
/** Send a caption with only the first media item, mirroring caption-limited channel transports. */
async function sendMediaWithLeadingCaption(params) {
	if (params.mediaUrls.length === 0) return false;
	for (const [index, mediaUrl] of params.mediaUrls.entries()) {
		const isFirst = index === 0;
		const caption = isFirst ? params.caption : void 0;
		try {
			await params.send({
				mediaUrl,
				caption
			});
		} catch (error) {
			if (params.onError) {
				await params.onError({
					error,
					mediaUrl,
					caption,
					index,
					isFirst
				});
				continue;
			}
			throw error;
		}
	}
	return true;
}
async function deliverTextOrMediaReply(params) {
	const { mediaUrls } = resolveSendableOutboundReplyParts(params.payload, { text: params.text });
	if (await sendMediaWithLeadingCaption({
		mediaUrls,
		caption: params.text,
		send: params.sendMedia,
		onError: params.onMediaError
	})) return "media";
	if (!params.text) return "empty";
	const chunks = params.chunkText ? params.chunkText(params.text) : [params.text];
	let sentText = false;
	for (const chunk of chunks) {
		if (!chunk) continue;
		await params.sendText(chunk);
		sentText = true;
	}
	return sentText ? "text" : "empty";
}
async function deliverFormattedTextWithAttachments(params) {
	const text = formatTextWithAttachmentLinks(params.payload.text, resolveOutboundMediaUrls(params.payload));
	if (!text) return false;
	await params.send({
		text,
		replyToId: params.payload.replyToId
	});
	return true;
}
//#endregion
export { formatTextWithAttachmentLinks as a, hasOutboundText as c, resolveOutboundMediaUrls as d, resolveSendableOutboundReplyParts as f, sendPayloadWithChunkedTextAndMedia as h, deliverTextOrMediaReply as i, isNumericTargetId as l, sendMediaWithLeadingCaption as m, createNormalizedOutboundDeliverer as n, hasOutboundMedia as o, resolveTextChunksWithFallback as p, deliverFormattedTextWithAttachments as r, hasOutboundReplyContent as s, countOutboundMedia as t, normalizeOutboundReplyPayload as u };
