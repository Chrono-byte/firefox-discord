// type="module";
const { detect } = require("./detect-browser/es");
const browser = detect();
if (browser) {
	console.log([
		browser.name,
		browser.version,
		browser.os
	]);
}
