const express = require("express");
const DiscordRPC = require("discord-rpc");

const client = new DiscordRPC.Client({transport : "ipc"});
const app = express();

app.use(express.json());

function setRP(type, tabTitle, tabURL) {
	if(tabURL.split("").length > 100) {
		var r = /:\/\/(.[^/]+)/;
		tabURL = `https://${tabURL.match(r)[1]}`;
	}

	if (type === "normal") {
		client.setActivity({
			details : tabTitle,
			state : tabURL,
			// startTimestamp: moment(new Date()).add(parse("-0s"), "ms").toDate(),
			largeImageKey : "firefox-large",
			largeImageText : "Firefox",
			instance : false,
		});
	}
}

app.post("/setRP", (req, res) => {
	if (req.body.iconName) {
		setRP("normal", req.body.tabTitle, req.body.tabURL, req.body.iconName);
	} else {
		setRP("normal", req.body.tabTitle, req.body.tabURL);
	}
	res.end();
});

const server = app.listen(6553, () => console.log("Express port: 6553"));

exports.server = server;

client.on("ready", () => {
	console.log("Logged in with RPC!");
	setRP("normal", "Idle", "Firefox");
});

client.login("433007687819853824").catch(console.error);

exports.client = client;