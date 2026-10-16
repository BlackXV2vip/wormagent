import { defineSetupPluginEntry } from "wormagent/plugin-sdk/core";
import { bluebubblesPlugin } from "./src/channel.js";

export default defineSetupPluginEntry(bluebubblesPlugin);
