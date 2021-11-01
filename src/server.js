const express = require("express");
const DiscordRPC = require("discord-rpc");

const client = new DiscordRPC.Client({transport: "ipc"});
const app = express();

app.use(express.json());

function setRP(tabData) {
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
	setRP({
		tabTitle: req.body.tabTitle,
		tabURL: req.body.tabURL,
		browserBrand: req.body.browserBrand
	});
	console.log(req.body);
	res.end();
});

const server = app.listen(7070, () => console.log("Express port: 7070"));

exports.client = client;
exports.server = server;

client.on("ready", () => {
	console.log("RPC Client + Express Server Ready");
	setRP({
		tabTitle: "Idle",
		tabURL: "No Activity Yet",
		browserBrand: "Firefox"
	});
});

client.login({clientId: "673201865772761098"/*, clientSecret: "abcdef123"*/}).catch(console.error);
