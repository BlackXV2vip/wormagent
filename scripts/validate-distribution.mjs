#!/usr/bin/env node
import { access, readFile } from "node:fs/promises";
import process from "node:process";

const required = [
  "wormagent.mjs",
  "dist/entry.js",
  "dist/index.js",
  "dist/plugin-sdk/index.js",
  "deploy/config/wormagent.json",
  "deploy/systemd/wormagent-gateway.service",
];

for (const file of required) {
  await access(new URL(`../${file}`, import.meta.url));
}

const pkg = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));
if (!pkg.version || !pkg.bin?.wormagent) {
  throw new Error("package.json is missing version or bin.wormagent");
}

console.error(`Distribution validated: wormagent ${pkg.version} (${required.length} required files)`);
