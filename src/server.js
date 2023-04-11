const express = require("express");
const DiscordRPC = require("discord-rpc");

const client = new DiscordRPC.Client({ transport: "ipc" });
const app = express();

app.use(express.json());

function setRP(tabData) {
	let oldestTab;

	switch (tabData.browserBrand && tabData.browserBrand.name) {
		case "firefox":
			tabData.browserIcon = "firefox-large";
			tabData.browserName = "Firefox";
			break;
		case "brave":
			tabData.browserIcon = "brave-large";
			tabData.browserName = "Brave Web Browser";
			break;
		case "chrome":
			tabData.browserIcon = "firefox-large";
			tabData.browserName = "Google Chrome";
			break;
		case "chromium":
			tabData.browserIcon = "firefox-large";
			tabData.browserName = "Chromium";
			break;

		default:
			tabData.browserIcon = "firefox-large";
			tabData.browserName = "Error";
			break;
	}

	oldestTab = new Date(tabData.longestTabTimestamp).getTime();

	oldestTab = `Oldest Tab was opened ${Math.floor((new Date().getTime() - oldestTab) / 1000 / 60)} minutes ago`;

	client.setActivity({
		details: tabData.tabCount + " Tabs Open",
		state: oldestTab,
		startTimestamp: new Date().getTime(),
		largeImageKey: tabData.browserIcon,
		largeImageText: tabData.browserName,
		instance: false
	});
}

function setRPInternal(tabData) {
	let r = /:\/\/(.[^/]+)/;
	if (tabData.tabURL.split("").length > 100) {
		tabData.tabURL = `https://${tabData.tabURL.match(r)[1]}`;
	}
	if (tabData.tabTitle.split("").length > 128) {
		tabData.tabTitle = `https://${tabData.tabTitle.match(r)[1]}`;
	}

	switch (tabData.browserBrand && tabData.browserBrand.name) {
		case "firefox":
			tabData.browserIcon = "firefox-large";
			tabData.browserName = "Firefox";
			break;
		case "brave":
			tabData.browserIcon = "brave-large";
			tabData.browserName = "Brave Web Browser";
			break;
		case "chrome":
			tabData.browserIcon = "firefox-large";
			tabData.browserName = "Google Chrome";
			break;
		case "chromium":
			tabData.browserIcon = "firefox-large";
			tabData.browserName = "Chromium";
			break;

		default:
			tabData.browserIcon = "firefox-large";
			tabData.browserName = "Error";
			break;
	}

	client.setActivity({
		details: tabData.tabTitle,
		state: tabData.tabURL,
		startTimestamp: new Date().getTime(),
		largeImageKey: tabData.browserIcon,
		largeImageText: tabData.browserName,
		instance: false
	});
}

app.post("/setRP", (req, res) => {
	var { tabCount, longestTabTimestamp } = req.body;

	setRP({
		tabCount: tabCount,
		longestTabTimestamp: longestTabTimestamp,
		browserBrand: req.body.browserBrand
	});

	res.end();
});

let listener = app.listen(7070, function () {
	console.log("Internal API is listening on port http://localhost:" + listener.address().port);
});

exports.client = client;
exports.server = listener;

client.on("ready", () => {
	console.log("RPC Client + Express Server Ready");
	setRPInternal({
		tabTitle: "Idle",
		tabURL: "No Activity Yet",
		browserBrand: "Firefox"
	});
});

client.login({ clientId: "673201865772761098" }).catch(console.error);
