import { Ot as applyLegacyMigrations, b as validateConfigObjectWithPlugins } from "./io-YZE2RiMe.js";
//#region src/config/legacy-migrate.ts
function migrateLegacyConfig(raw) {
	const { next, changes } = applyLegacyMigrations(raw);
	if (!next) return {
		config: null,
		changes: []
	};
	const validated = validateConfigObjectWithPlugins(next);
	if (!validated.ok) {
		changes.push("Migration applied, but config still invalid; fix remaining issues manually.");
		return {
			config: null,
			changes
		};
	}
	return {
		config: validated.config,
		changes
	};
}
//#endregion
export { migrateLegacyConfig as t };
