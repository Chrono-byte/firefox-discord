const express = require("express");
const DiscordRPC = require("discord-rpc");
const moment = require("moment");

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

	if (tabData.browserBrand === "Firefox") {
		tabData.browserIcon = "firefox-large";
		tabData.browserName = "Firefox";
	} else if (tabData.browserBrand === "Brave") {
		tabData.browserIcon = "brave-large";
		tabData.browserName = "Brave Web Browser";
	} else if (tabData.browserBrand === "Chromium") {
		tabData.browserIcon = "firefox-large";
		tabData.browserName = "Chromium";
	} else if (tabData.browserBrand === "Chrome") {
		tabData.browserIcon = "firefox-large";
		tabData.browserName = "Google Chrome";
	} else {
		tabData.browserIcon = "firefox-large";
		tabData.browserName = "Error";
	}

	client.setActivity({
		details: tabData.tabTitle,
		state: tabData.tabURL,
		startTimestamp: moment(new Date()).toDate(),
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

const server = app.listen(6553, () => console.log("Express port: 6553"));

exports.client = client;
exports.server = server;

client.on("ready", () => {
	console.log("RPC Client + Express Server Ready");
	setRP({
		tabTitle: "Idle",
		tabURL: "No Activity Yet"
	});
});

client.login({clientId: "673201865772761098", clientSecret: "abcdef123"}).catch(console.error);
