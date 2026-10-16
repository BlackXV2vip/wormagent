import "./redact-DJH_TKCK.js";
import "./errors-Cn8_L7ES.js";
import "./logger-XBPi1AwR.js";
import "./paths-C7DNYmnN.js";
import "./tmp-wormagent-dir-DiDbPUEX.js";
import { n as isRich, r as theme } from "./theme-CLg7QWJt.js";
import "./globals-B9nPdA7s.js";
import { n as defaultRuntime } from "./runtime-BNNetENg.js";
import "./ansi-cwY8Vrne.js";
import "./subsystem-DFHXIqzU.js";
import "./boolean-BgLJTske.js";
import "./utils-1TVTmhOV.js";
import { t as formatDocsLink } from "./links-B85QumIb.js";
import "./boundary-path-BVHzCDEE.js";
import "./boundary-file-read-1knRHcS0.js";
import "./logger-BiD_FF0f.js";
import { n as runCommandWithTimeout } from "./exec-CxOzjJqc.js";
import "./host-env-security-CCNk6EJM.js";
import "./config-state-DKm2UeRW.js";
import "./registry-bBUk5Kld.js";
import "./manifest-registry-y-alnJW5.js";
import { t as formatCliCommand } from "./command-format-RWUdRF1N.js";
import { f as hasBinary } from "./frontmatter-UZWcmlyv.js";
import "./env-overrides-B6fJDYq1.js";
import "./path-alias-guards-DXmUfTMe.js";
import "./sandbox-paths-CtoRdT5i.js";
import "./skills-D_0p-HUs.js";
import { n as runCommandWithRuntime } from "./cli-utils-DUWx0Fkc.js";
//#region src/commands/docs.ts
const SEARCH_TOOL = "https://docs.wormagent.ai/mcp.SearchWormAgent";
const SEARCH_TIMEOUT_MS = 3e4;
const DEFAULT_SNIPPET_MAX = 220;
function resolveNodeRunner() {
	if (hasBinary("pnpm")) return {
		cmd: "pnpm",
		args: ["dlx"]
	};
	if (hasBinary("npx")) return {
		cmd: "npx",
		args: ["-y"]
	};
	throw new Error("Missing pnpm or npx; install a Node package runner.");
}
async function runNodeTool(tool, toolArgs, options = {}) {
	const runner = resolveNodeRunner();
	return await runCommandWithTimeout([
		runner.cmd,
		...runner.args,
		tool,
		...toolArgs
	], {
		timeoutMs: options.timeoutMs ?? SEARCH_TIMEOUT_MS,
		input: options.input
	});
}
async function runTool(tool, toolArgs, options = {}) {
	if (hasBinary(tool)) return await runCommandWithTimeout([tool, ...toolArgs], {
		timeoutMs: options.timeoutMs ?? SEARCH_TIMEOUT_MS,
		input: options.input
	});
	return await runNodeTool(tool, toolArgs, options);
}
function extractLine(lines, prefix) {
	const line = lines.find((value) => value.startsWith(prefix));
	if (!line) return;
	return line.slice(prefix.length).trim();
}
function normalizeSnippet(raw, fallback) {
	const cleaned = (raw && raw.trim().length > 0 ? raw : fallback).replace(/\s+/g, " ").trim();
	if (!cleaned) return "";
	if (cleaned.length <= DEFAULT_SNIPPET_MAX) return cleaned;
	return `${cleaned.slice(0, DEFAULT_SNIPPET_MAX - 3)}...`;
}
function firstParagraph(text) {
	return text.split(/\n\s*\n/).map((chunk) => chunk.trim()).filter(Boolean)[0] ?? "";
}
function parseSearchOutput(raw) {
	const blocks = raw.replace(/\r/g, "").split(/\n(?=Title: )/g).map((chunk) => chunk.trim()).filter(Boolean);
	const results = [];
	for (const block of blocks) {
		const lines = block.split("\n");
		const title = extractLine(lines, "Title:");
		const link = extractLine(lines, "Link:");
		if (!title || !link) continue;
		const content = extractLine(lines, "Content:");
		const contentIndex = lines.findIndex((line) => line.startsWith("Content:"));
		const snippet = normalizeSnippet(content, firstParagraph(contentIndex >= 0 ? lines.slice(contentIndex + 1).join("\n").trim() : ""));
		results.push({
			title,
			link,
			snippet: snippet || void 0
		});
	}
	return results;
}
function escapeMarkdown(text) {
	return text.replace(/[()[\]]/g, "\\$&");
}
function buildMarkdown(query, results) {
	const lines = [`# Docs search: ${escapeMarkdown(query)}`, ""];
	if (results.length === 0) {
		lines.push("_No results._");
		return lines.join("\n");
	}
	for (const item of results) {
		const title = escapeMarkdown(item.title);
		const snippet = item.snippet ? escapeMarkdown(item.snippet) : "";
		const suffix = snippet ? ` - ${snippet}` : "";
		lines.push(`- [${title}](${item.link})${suffix}`);
	}
	return lines.join("\n");
}
function formatLinkLabel(link) {
	return link.replace(/^https?:\/\//i, "");
}
function renderRichResults(query, results, runtime) {
	runtime.log(`${theme.heading("Docs search:")} ${theme.info(query)}`);
	if (results.length === 0) {
		runtime.log(theme.muted("No results."));
		return;
	}
	for (const item of results) {
		const linkLabel = formatLinkLabel(item.link);
		const link = formatDocsLink(item.link, linkLabel);
		runtime.log(`${theme.muted("-")} ${theme.command(item.title)} ${theme.muted("(")}${link}${theme.muted(")")}`);
		if (item.snippet) runtime.log(`  ${theme.muted(item.snippet)}`);
	}
}
async function renderMarkdown(markdown, runtime) {
	runtime.log(markdown.trimEnd());
}
async function docsSearchCommand(queryParts, runtime) {
	const query = queryParts.join(" ").trim();
	if (!query) {
		const docs = formatDocsLink("/", "docs.wormagent.ai");
		if (isRich()) {
			runtime.log(`${theme.muted("Docs:")} ${docs}`);
			runtime.log(`${theme.muted("Search:")} ${formatCliCommand("wormagent docs \"your query\"")}`);
		} else {
			runtime.log("Docs: https://docs.wormagent.ai/");
			runtime.log(`Search: ${formatCliCommand("wormagent docs \"your query\"")}`);
		}
		return;
	}
	const res = await runTool("mcporter", [
		"call",
		SEARCH_TOOL,
		"--args",
		JSON.stringify({ query }),
		"--output",
		"text"
	], { timeoutMs: SEARCH_TIMEOUT_MS });
	if (res.code !== 0) {
		const err = res.stderr.trim() || res.stdout.trim() || `exit ${res.code}`;
		runtime.error(`Docs search failed: ${err}`);
		runtime.exit(1);
		return;
	}
	const results = parseSearchOutput(res.stdout);
	if (isRich()) {
		renderRichResults(query, results, runtime);
		return;
	}
	await renderMarkdown(buildMarkdown(query, results), runtime);
}
//#endregion
//#region src/cli/docs-cli.ts
function registerDocsCli(program) {
	program.command("docs").description("Search the live WormAgent docs").argument("[query...]", "Search query").addHelpText("after", () => `\n${theme.muted("Docs:")} ${formatDocsLink("/cli/docs", "docs.wormagent.ai/cli/docs")}\n`).action(async (queryParts) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			await docsSearchCommand(queryParts, defaultRuntime);
		});
	});
}
//#endregion
export { registerDocsCli };
