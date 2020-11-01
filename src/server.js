const express = require("express");
const DiscordRPC = require("discord-rpc");
const moment = require("moment");

const client = new DiscordRPC.Client({ transport: "ipc" });
const app = express();

app.use(express.json());

function setRP(type, tabTitle, tabURL) {
	let r = /:\/\/(.[^/]+)/;
	if (tabURL.split("").length > 100) {
		tabURL = `https://${tabURL.match(r)[1]}`;
	}
	if (tabTitle.split("").length > 128) {
		tabTitle = `https://${tabTitle.match(r)[1]}`;
	}

	if (type === "normal") {
		client.setActivity({
			details: tabTitle,
			state: tabURL,
			startTimestamp: moment(new Date()).toDate(),
			largeImageKey: "brave-large",
			largeImageText: "Brave",
			instance: false,
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

exports.client = client;
exports.server = server;

client.on("ready", () => {
	console.log("RPC Client Ready");
	setRP("normal", "Idle", "No activity yet");
});

client
	.login({ clientId: "673201865772761098", clientSecret: "abcdef123" })
	.catch(console.error);
