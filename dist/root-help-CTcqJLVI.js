import "./logger-XBPi1AwR.js";
import "./paths-C7DNYmnN.js";
import "./tmp-wormagent-dir-DiDbPUEX.js";
import "./theme-CLg7QWJt.js";
import "./globals-B9nPdA7s.js";
import "./ansi-cwY8Vrne.js";
import "./utils-1TVTmhOV.js";
import "./links-B85QumIb.js";
import { n as VERSION } from "./version-_SOgQUeP.js";
import { t as getCoreCliCommandDescriptors } from "./core-command-descriptors-CaYiyM8Y.js";
import { n as getSubCliEntries } from "./subcli-descriptors-BaTDxoGq.js";
import "./banner-wQEfL2m5.js";
import { t as configureProgramHelp } from "./help-LWzvPRJr.js";
import { Command } from "commander";
//#region src/cli/program/root-help.ts
function buildRootHelpProgram() {
	const program = new Command();
	configureProgramHelp(program, {
		programVersion: VERSION,
		channelOptions: [],
		messageChannelOptions: "",
		agentChannelOptions: ""
	});
	for (const command of getCoreCliCommandDescriptors()) program.command(command.name).description(command.description);
	for (const command of getSubCliEntries()) program.command(command.name).description(command.description);
	return program;
}
function outputRootHelp() {
	buildRootHelpProgram().outputHelp();
}
//#endregion
export { outputRootHelp };
