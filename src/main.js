const path = require("path");
const { app, nativeImage, Menu, Tray } = require("electron");
const rpcServer = require("./server.js");

let tray;

app.on("ready", () => {
	let contextMenu = Menu.buildFromTemplate([
		{
			label: "Discord RPC for Firefox",
			enabled: "false"
		},
		{
			label: "By Chronomly",
			enabled: "false"
		},
		{ type: "separator" },
		{
			label: "Quit",
			click: () => {
				rpcServer.client.destroy();
				rpcServer.server.close();
				app.quit();
				console.log("Exited");
			}
		}
	]);
	const iconPath = path.join(__dirname, "../assets/chat_bubble-white-48dp/2x/outline_chat_bubble_white_48dp.png");
	const trayIcon = nativeImage.createFromPath(iconPath);

	tray = new Tray(trayIcon);

	tray.setToolTip("Discord RPC for Firefox");
	tray.setContextMenu(contextMenu);

	console.log("Electron App Ready");
});
