"use strict";
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

	// Oldest Tab Logic
	oldestTab = new Date(tabData.longestTabTimestamp).getTime();

	oldestTab = Math.floor((new Date().getTime() - oldestTab) / 1000 / 60);

	if (oldestTab > 60) {
		// oldest tab is over an hour old
		oldestTab = Math.floor(oldestTab / 60);
		if (oldestTab > 24) {
			// oldest tab is over a day old
			oldestTab = Math.floor(oldestTab / 24);
			oldestTab = oldestTab + " days ago";
		} else {
			oldestTab = oldestTab + " hours ago";
		}
	} else oldestTab = oldestTab + " minutes ago";

	oldestTab = "Oldest tab opened: " + oldestTab;

	// Tab Count Logic
	var tabs;
	if (tabData.tabCount > 0) {
		tabs = tabData.tabCount + " tab open";
		if (tabData.tabCount > 1) {
			tabs = tabData.tabCount + " tabs open";
			if (tabData.tabCount > 6) {
				tabs = `Too many tabs open ${tabData.tabCount}`;
				if (tabData.tabCount > 10) {
					tabs = `tell this user to close some tabs ${tabData.tabCount}`;
					if (tabData.tabCount > 20) {
						tabs = `this user has ${tabData.tabCount} tabs open`;
						if (tabData.tabCount > 23) {
							tabs = `please call the RAM police, ${tabData.tabCount} tabs open`;
							if (tabData.tabCount > 100) {
								tabs = `Too many tabs open ${tabData.tabCount} (seriously, close some tabs)`;
							}
						}
					}
				}
			}
		}
	}

	console.log(tabs);

	client.setActivity({
		details: tabs,
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

	switch (tabData.browserBrand) {
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
	console.log(req.body);
	var { tabCount, longestTabTimestamp } = req.body;

	setRP({
		tabCount: tabCount,
		longestTabTimestamp: longestTabTimestamp,
		browserBrand: req.body.browserBrand
	});

	res.status(200).send(JSON.stringify({ status: "OK" }));

	res.end();
});

app.post("/setRP/internal", (req, res) => {
	console.log(req.body);

	setRPInternal({
		tabTitle: req.body.tabTitle,
		tabURL: req.body.tabURL,
		browserBrand: req.body.browserBrand
	});

	res.status(200).send(JSON.stringify({ status: "OK" }));

	res.end();
});

let listener = app.listen(7070, () => {
	console.log("Internal API is listening on port http://localhost:" + listener.address().port);
});

client.on("ready", () => {
	console.log("Discord RPC is ready");

	client.setActivity({
		details: "No Activity Detected",
		state: "fuck about it later if you want",
		startTimestamp: new Date().getTime(),
		largeImageKey: "firefox-large",
		largeImageText: "Statisfy",
		instance: false
	});
});



client.login({ clientId: "673201865772761098" }).catch(err => {
	console.error(err);

	process.exit(1);
});

exports.client = client;
exports.server = listener;