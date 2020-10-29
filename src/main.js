const path = require("path");
const { app, nativeImage, Menu, Tray } = require("electron");
const express = require("./server.js");

let tray;

app.on("ready", () => {
	let contextMenu = Menu.buildFromTemplate([
		{
			label: "Discord RPC for Firefox",
			enabled: "false",
			// icon: "assets/chat_bubble-white-48dp/2x/outline_chat_bubble_white_48dp.png"
		},
		{
			label: "By Chronomly",
			enabled: "false",
		},
		{ type: "separator" },
		{
			label: "Quit",
			click: () => {
				express.client.destroy();
				express.server.close();
				app.quit();
				console.log("Exited cleanly");
			},
		},
	]);
	const iconPath = path.join(
		__dirname,
		"assets/chat_bubble-white-48dp/2x/outline_chat_bubble_white_48dp.png"
	);
	const trayIcon = nativeImage.createFromPath(iconPath);

	tray = new Tray(trayIcon);

	tray.setToolTip("Discord RPC for Firefox");
	tray.setContextMenu(contextMenu);

	console.log("Electron App Ready");
});
