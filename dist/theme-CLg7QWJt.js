import chalk, { Chalk } from "chalk";
//#region src/terminal/palette.ts
const MUSTANG_PALETTE = {
	accent: "#FF5A2D",
	accentBright: "#FF7A3D",
	accentDim: "#D14A22",
	info: "#FF8A5B",
	success: "#2FBF71",
	warn: "#FFB020",
	error: "#E23D2D",
	muted: "#8B7F77"
};
//#endregion
//#region src/terminal/theme.ts
const hasForceColor = typeof process.env.FORCE_COLOR === "string" && process.env.FORCE_COLOR.trim().length > 0 && process.env.FORCE_COLOR.trim() !== "0";
const baseChalk = process.env.NO_COLOR && !hasForceColor ? new Chalk({ level: 0 }) : chalk;
const hex = (value) => baseChalk.hex(value);
const theme = {
	accent: hex(MUSTANG_PALETTE.accent),
	accentBright: hex(MUSTANG_PALETTE.accentBright),
	accentDim: hex(MUSTANG_PALETTE.accentDim),
	info: hex(MUSTANG_PALETTE.info),
	success: hex(MUSTANG_PALETTE.success),
	warn: hex(MUSTANG_PALETTE.warn),
	error: hex(MUSTANG_PALETTE.error),
	muted: hex(MUSTANG_PALETTE.muted),
	heading: baseChalk.bold.hex(MUSTANG_PALETTE.accent),
	command: hex(MUSTANG_PALETTE.accentBright),
	option: hex(MUSTANG_PALETTE.warn)
};
const isRich = () => Boolean(baseChalk.level > 0);
const colorize = (rich, color, value) => rich ? color(value) : value;
//#endregion
export { isRich as n, theme as r, colorize as t };
