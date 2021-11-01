// type="module";
const { detect } = require("./detect-browser/es");
const browser = detect();
if (browser) {
	console.log(browser.name);
	console.log(browser.version);
	console.log(browser.os);
}
