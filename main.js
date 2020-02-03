const path = require("path");
const { app, nativeImage, Menu, Tray } = require("electron");
const express = require("./server.js"); 

// Electron

let tray;

app.on("ready", () => {
	let contextMenu = Menu.buildFromTemplate([
		{
			label: "FD RPC", 
			enabled: "false", 
			icon: "assets/chat_bubble-24px.svg"
		},
		{
			label: "By Chronomly", 
			enabled: "false"
		},
		{type: "separator" },
		{
			label: "Quit",
			click: () => {
				express.client.destroy();
				express.server.close();
				app.quit();
			}
		}
	]);
	const iconPath = path.join(__dirname, "assets/chat_bubble-white-48dp/2x/outline_chat_bubble_white_48dp.png");
	const trayIcon = nativeImage.createFromPath(iconPath);

	tray = new Tray(trayIcon);

	tray.setToolTip("Firefox Discord RPC");
	tray.setContextMenu(contextMenu);

});