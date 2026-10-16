import { Jv as resolveApiKeyForProvider, _y as postJsonRequest, gy as normalizeBaseUrl, hy as assertOkOrThrowHttpError } from "./auth-profiles-DHKWTcix.js";
import { t as normalizeGoogleModelId } from "./model-id-normalization-Zo5g3Ush.js";
import { t as parseGeminiAuth } from "./gemini-auth-DvabtJrt.js";
//#region src/image-generation/providers/fal.ts
const DEFAULT_FAL_BASE_URL = "https://fal.run";
const DEFAULT_FAL_IMAGE_MODEL = "fal-ai/flux/dev";
const DEFAULT_FAL_EDIT_SUBPATH = "image-to-image";
const DEFAULT_OUTPUT_FORMAT = "png";
const FAL_SUPPORTED_SIZES = [
	"1024x1024",
	"1024x1536",
	"1536x1024",
	"1024x1792",
	"1792x1024"
];
const FAL_SUPPORTED_ASPECT_RATIOS = [
	"1:1",
	"4:3",
	"3:4",
	"16:9",
	"9:16"
];
function resolveFalBaseUrl(cfg) {
	return (cfg?.models?.providers?.fal?.baseUrl?.trim() || DEFAULT_FAL_BASE_URL).replace(/\/+$/u, "");
}
function ensureFalModelPath(model, hasInputImages) {
	const trimmed = model?.trim() || DEFAULT_FAL_IMAGE_MODEL;
	if (!hasInputImages) return trimmed;
	if (trimmed.endsWith(`/${DEFAULT_FAL_EDIT_SUBPATH}`) || trimmed.endsWith("/edit") || trimmed.includes("/image-to-image/")) return trimmed;
	return `${trimmed}/${DEFAULT_FAL_EDIT_SUBPATH}`;
}
function parseSize(raw) {
	const trimmed = raw?.trim();
	if (!trimmed) return null;
	const match = /^(\d{2,5})x(\d{2,5})$/iu.exec(trimmed);
	if (!match) return null;
	const width = Number.parseInt(match[1] ?? "", 10);
	const height = Number.parseInt(match[2] ?? "", 10);
	if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) return null;
	return {
		width,
		height
	};
}
function mapResolutionToEdge(resolution) {
	if (!resolution) return;
	return resolution === "4K" ? 4096 : resolution === "2K" ? 2048 : 1024;
}
function aspectRatioToEnum(aspectRatio) {
	const normalized = aspectRatio?.trim();
	if (!normalized) return;
	if (normalized === "1:1") return "square_hd";
	if (normalized === "4:3") return "landscape_4_3";
	if (normalized === "3:4") return "portrait_4_3";
	if (normalized === "16:9") return "landscape_16_9";
	if (normalized === "9:16") return "portrait_16_9";
}
function aspectRatioToDimensions(aspectRatio, edge) {
	const match = /^(\d+):(\d+)$/u.exec(aspectRatio.trim());
	if (!match) throw new Error(`Invalid fal aspect ratio: ${aspectRatio}`);
	const widthRatio = Number.parseInt(match[1] ?? "", 10);
	const heightRatio = Number.parseInt(match[2] ?? "", 10);
	if (!Number.isFinite(widthRatio) || !Number.isFinite(heightRatio) || widthRatio <= 0 || heightRatio <= 0) throw new Error(`Invalid fal aspect ratio: ${aspectRatio}`);
	if (widthRatio >= heightRatio) return {
		width: edge,
		height: Math.max(1, Math.round(edge * heightRatio / widthRatio))
	};
	return {
		width: Math.max(1, Math.round(edge * widthRatio / heightRatio)),
		height: edge
	};
}
function resolveFalImageSize(params) {
	const parsed = parseSize(params.size);
	if (parsed) return parsed;
	const normalizedAspectRatio = params.aspectRatio?.trim();
	if (normalizedAspectRatio && params.hasInputImages) throw new Error("fal image edit endpoint does not support aspectRatio overrides");
	const edge = mapResolutionToEdge(params.resolution);
	if (normalizedAspectRatio && edge) return aspectRatioToDimensions(normalizedAspectRatio, edge);
	if (edge) return {
		width: edge,
		height: edge
	};
	if (normalizedAspectRatio) return aspectRatioToEnum(normalizedAspectRatio) ?? aspectRatioToDimensions(normalizedAspectRatio, 1024);
}
function toDataUri(buffer, mimeType) {
	return `data:${mimeType};base64,${buffer.toString("base64")}`;
}
function fileExtensionForMimeType(mimeType) {
	const normalized = mimeType?.toLowerCase().trim();
	if (!normalized) return "png";
	if (normalized.includes("jpeg")) return "jpg";
	const slashIndex = normalized.indexOf("/");
	return slashIndex >= 0 ? normalized.slice(slashIndex + 1) || "png" : "png";
}
async function fetchImageBuffer(url) {
	const response = await fetch(url);
	if (!response.ok) {
		const text = await response.text().catch(() => "");
		throw new Error(`fal image download failed (${response.status}): ${text || response.statusText}`);
	}
	const mimeType = response.headers.get("content-type")?.trim() || "image/png";
	const arrayBuffer = await response.arrayBuffer();
	return {
		buffer: Buffer.from(arrayBuffer),
		mimeType
	};
}
function buildFalImageGenerationProvider() {
	return {
		id: "fal",
		label: "fal",
		defaultModel: DEFAULT_FAL_IMAGE_MODEL,
		models: [DEFAULT_FAL_IMAGE_MODEL, `${DEFAULT_FAL_IMAGE_MODEL}/${DEFAULT_FAL_EDIT_SUBPATH}`],
		capabilities: {
			generate: {
				maxCount: 4,
				supportsSize: true,
				supportsAspectRatio: true,
				supportsResolution: true
			},
			edit: {
				enabled: true,
				maxCount: 4,
				maxInputImages: 1,
				supportsSize: true,
				supportsAspectRatio: false,
				supportsResolution: true
			},
			geometry: {
				sizes: [...FAL_SUPPORTED_SIZES],
				aspectRatios: [...FAL_SUPPORTED_ASPECT_RATIOS],
				resolutions: [
					"1K",
					"2K",
					"4K"
				]
			}
		},
		async generateImage(req) {
			const auth = await resolveApiKeyForProvider({
				provider: "fal",
				cfg: req.cfg,
				agentDir: req.agentDir,
				store: req.authStore
			});
			if (!auth.apiKey) throw new Error("fal API key missing");
			if ((req.inputImages?.length ?? 0) > 1) throw new Error("fal image generation currently supports at most one reference image");
			const hasInputImages = (req.inputImages?.length ?? 0) > 0;
			const imageSize = resolveFalImageSize({
				size: req.size,
				resolution: req.resolution,
				aspectRatio: req.aspectRatio,
				hasInputImages
			});
			const model = ensureFalModelPath(req.model, hasInputImages);
			const requestBody = {
				prompt: req.prompt,
				num_images: req.count ?? 1,
				output_format: DEFAULT_OUTPUT_FORMAT
			};
			if (imageSize !== void 0) requestBody.image_size = imageSize;
			if (hasInputImages) {
				const [input] = req.inputImages ?? [];
				if (!input) throw new Error("fal image edit request missing reference image");
				requestBody.image_url = toDataUri(input.buffer, input.mimeType);
			}
			const response = await fetch(`${resolveFalBaseUrl(req.cfg)}/${model}`, {
				method: "POST",
				headers: {
					Authorization: `Key ${auth.apiKey}`,
					"Content-Type": "application/json"
				},
				body: JSON.stringify(requestBody)
			});
			if (!response.ok) {
				const text = await response.text().catch(() => "");
				throw new Error(`fal image generation failed (${response.status}): ${text || response.statusText}`);
			}
			const payload = await response.json();
			const images = [];
			let imageIndex = 0;
			for (const entry of payload.images ?? []) {
				const url = entry.url?.trim();
				if (!url) continue;
				const downloaded = await fetchImageBuffer(url);
				imageIndex += 1;
				images.push({
					buffer: downloaded.buffer,
					mimeType: downloaded.mimeType,
					fileName: `image-${imageIndex}.${fileExtensionForMimeType(downloaded.mimeType || entry.content_type)}`
				});
			}
			if (images.length === 0) throw new Error("fal image generation response missing image data");
			return {
				images,
				model,
				metadata: payload.prompt ? { prompt: payload.prompt } : void 0
			};
		}
	};
}
//#endregion
//#region src/image-generation/providers/google.ts
const DEFAULT_GOOGLE_IMAGE_BASE_URL = "https://generativelanguage.googleapis.com/v1beta";
const DEFAULT_GOOGLE_IMAGE_MODEL = "gemini-3.1-flash-image-preview";
const DEFAULT_OUTPUT_MIME$1 = "image/png";
const GOOGLE_SUPPORTED_SIZES = [
	"1024x1024",
	"1024x1536",
	"1536x1024",
	"1024x1792",
	"1792x1024"
];
const GOOGLE_SUPPORTED_ASPECT_RATIOS = [
	"1:1",
	"2:3",
	"3:2",
	"3:4",
	"4:3",
	"4:5",
	"5:4",
	"9:16",
	"16:9",
	"21:9"
];
function resolveGoogleBaseUrl(cfg) {
	return cfg?.models?.providers?.google?.baseUrl?.trim() || DEFAULT_GOOGLE_IMAGE_BASE_URL;
}
function normalizeGoogleImageModel(model) {
	const trimmed = model?.trim();
	return normalizeGoogleModelId(trimmed || DEFAULT_GOOGLE_IMAGE_MODEL);
}
function mapSizeToImageConfig(size) {
	const trimmed = size?.trim();
	if (!trimmed) return;
	const normalized = trimmed.toLowerCase();
	const aspectRatio = new Map([
		["1024x1024", "1:1"],
		["1024x1536", "2:3"],
		["1536x1024", "3:2"],
		["1024x1792", "9:16"],
		["1792x1024", "16:9"]
	]).get(normalized);
	const [widthRaw, heightRaw] = normalized.split("x");
	const width = Number.parseInt(widthRaw ?? "", 10);
	const height = Number.parseInt(heightRaw ?? "", 10);
	const longestEdge = Math.max(width, height);
	const imageSize = longestEdge >= 3072 ? "4K" : longestEdge >= 1536 ? "2K" : void 0;
	if (!aspectRatio && !imageSize) return;
	return {
		...aspectRatio ? { aspectRatio } : {},
		...imageSize ? { imageSize } : {}
	};
}
function buildGoogleImageGenerationProvider() {
	return {
		id: "google",
		label: "Google",
		defaultModel: DEFAULT_GOOGLE_IMAGE_MODEL,
		models: [DEFAULT_GOOGLE_IMAGE_MODEL, "gemini-3-pro-image-preview"],
		capabilities: {
			generate: {
				maxCount: 4,
				supportsSize: true,
				supportsAspectRatio: true,
				supportsResolution: true
			},
			edit: {
				enabled: true,
				maxCount: 4,
				maxInputImages: 5,
				supportsSize: true,
				supportsAspectRatio: true,
				supportsResolution: true
			},
			geometry: {
				sizes: [...GOOGLE_SUPPORTED_SIZES],
				aspectRatios: [...GOOGLE_SUPPORTED_ASPECT_RATIOS],
				resolutions: [
					"1K",
					"2K",
					"4K"
				]
			}
		},
		async generateImage(req) {
			const auth = await resolveApiKeyForProvider({
				provider: "google",
				cfg: req.cfg,
				agentDir: req.agentDir,
				store: req.authStore
			});
			if (!auth.apiKey) throw new Error("Google API key missing");
			const model = normalizeGoogleImageModel(req.model);
			const baseUrl = normalizeBaseUrl(resolveGoogleBaseUrl(req.cfg), DEFAULT_GOOGLE_IMAGE_BASE_URL);
			const allowPrivate = Boolean(req.cfg?.models?.providers?.google?.baseUrl?.trim());
			const authHeaders = parseGeminiAuth(auth.apiKey);
			const headers = new Headers(authHeaders.headers);
			const imageConfig = mapSizeToImageConfig(req.size);
			const inputParts = (req.inputImages ?? []).map((image) => ({ inlineData: {
				mimeType: image.mimeType,
				data: image.buffer.toString("base64")
			} }));
			const resolvedImageConfig = {
				...imageConfig,
				...req.aspectRatio?.trim() ? { aspectRatio: req.aspectRatio.trim() } : {},
				...req.resolution ? { imageSize: req.resolution } : {}
			};
			const { response: res, release } = await postJsonRequest({
				url: `${baseUrl}/models/${model}:generateContent`,
				headers,
				body: {
					contents: [{
						role: "user",
						parts: [...inputParts, { text: req.prompt }]
					}],
					generationConfig: {
						responseModalities: ["TEXT", "IMAGE"],
						...Object.keys(resolvedImageConfig).length > 0 ? { imageConfig: resolvedImageConfig } : {}
					}
				},
				timeoutMs: 6e4,
				fetchFn: fetch,
				allowPrivateNetwork: allowPrivate
			});
			try {
				await assertOkOrThrowHttpError(res, "Google image generation failed");
				const payload = await res.json();
				let imageIndex = 0;
				const images = (payload.candidates ?? []).flatMap((candidate) => candidate.content?.parts ?? []).map((part) => {
					const inline = part.inlineData ?? part.inline_data;
					const data = inline?.data?.trim();
					if (!data) return null;
					const mimeType = inline?.mimeType ?? inline?.mime_type ?? DEFAULT_OUTPUT_MIME$1;
					const extension = mimeType.includes("jpeg") ? "jpg" : mimeType.split("/")[1] ?? "png";
					imageIndex += 1;
					return {
						buffer: Buffer.from(data, "base64"),
						mimeType,
						fileName: `image-${imageIndex}.${extension}`
					};
				}).filter((entry) => entry !== null);
				if (images.length === 0) throw new Error("Google image generation response missing image data");
				return {
					images,
					model
				};
			} finally {
				await release();
			}
		}
	};
}
//#endregion
//#region src/image-generation/providers/openai.ts
const DEFAULT_OPENAI_IMAGE_BASE_URL = "https://api.openai.com/v1";
const DEFAULT_OPENAI_IMAGE_MODEL = "gpt-image-1";
const DEFAULT_OUTPUT_MIME = "image/png";
const DEFAULT_SIZE = "1024x1024";
const OPENAI_SUPPORTED_SIZES = [
	"1024x1024",
	"1024x1536",
	"1536x1024"
];
function resolveOpenAIBaseUrl(cfg) {
	return cfg?.models?.providers?.openai?.baseUrl?.trim() || DEFAULT_OPENAI_IMAGE_BASE_URL;
}
function buildOpenAIImageGenerationProvider() {
	return {
		id: "openai",
		label: "OpenAI",
		defaultModel: DEFAULT_OPENAI_IMAGE_MODEL,
		models: [DEFAULT_OPENAI_IMAGE_MODEL],
		capabilities: {
			generate: {
				maxCount: 4,
				supportsSize: true,
				supportsAspectRatio: false,
				supportsResolution: false
			},
			edit: {
				enabled: false,
				maxCount: 0,
				maxInputImages: 0,
				supportsSize: false,
				supportsAspectRatio: false,
				supportsResolution: false
			},
			geometry: { sizes: [...OPENAI_SUPPORTED_SIZES] }
		},
		async generateImage(req) {
			if ((req.inputImages?.length ?? 0) > 0) throw new Error("OpenAI image generation provider does not support reference-image edits");
			const auth = await resolveApiKeyForProvider({
				provider: "openai",
				cfg: req.cfg,
				agentDir: req.agentDir,
				store: req.authStore
			});
			if (!auth.apiKey) throw new Error("OpenAI API key missing");
			const response = await fetch(`${resolveOpenAIBaseUrl(req.cfg)}/images/generations`, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${auth.apiKey}`,
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					model: req.model || DEFAULT_OPENAI_IMAGE_MODEL,
					prompt: req.prompt,
					n: req.count ?? 1,
					size: req.size ?? DEFAULT_SIZE
				})
			});
			if (!response.ok) {
				const text = await response.text().catch(() => "");
				throw new Error(`OpenAI image generation failed (${response.status}): ${text || response.statusText}`);
			}
			return {
				images: ((await response.json()).data ?? []).map((entry, index) => {
					if (!entry.b64_json) return null;
					return {
						buffer: Buffer.from(entry.b64_json, "base64"),
						mimeType: DEFAULT_OUTPUT_MIME,
						fileName: `image-${index + 1}.png`,
						...entry.revised_prompt ? { revisedPrompt: entry.revised_prompt } : {}
					};
				}).filter((entry) => entry !== null),
				model: req.model || DEFAULT_OPENAI_IMAGE_MODEL
			};
		}
	};
}
//#endregion
export { buildGoogleImageGenerationProvider as n, buildFalImageGenerationProvider as r, buildOpenAIImageGenerationProvider as t };
