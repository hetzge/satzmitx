import * as core from "./core.js"

console.log("Hello SatzMitX background script")

browser.runtime.onMessage.addListener(async (message) => {
	if (message.key === "FOUND_FINDINGS") {
		core.addFindings(message.findings)
		browser.runtime.sendMessage({ key: "UPDATED_FINDINGS" })
	}
});
browser.runtime.onInstalled.addListener(async (details) => {
	console.log("Installed", details);
});
browser.runtime.onStartup.addListener(async () => {
	console.log("Startup");
});