"use strict";
/* eslint-disable no-redeclare */
/* eslint-disable no-undef */
let enabled = true;

async function getBrowserInfo() {
	let info = await browser.runtime.getBrowserInfo();
	info = info.name.toLowerCase();
	return info;
}

// function for getting the current tab count
function getTabCount() {
	return browser.tabs.query({}).then(tabs => tabs.length);
}

// function for getting the timestamp of the oldest tab
let oldestTab;
function getLongestTabTimestamp() {
	return browser.tabs.query({}).then(tabs => {
		oldestTab = tabs[0];
		for (let i = 1; i < tabs.length; i++) {
			if (tabs[i].lastAccessed < oldestTab.lastAccessed) {
				oldestTab = tabs[i];
			}
		}
		return oldestTab.lastAccessed;
	});
}

async function sendData() {
	let tabCount = await getTabCount()

	// get the current tab
	const tab = await browser.tabs.query({ active: true, currentWindow: true });
	// if (tab.incognito) return;

	console.log("Sending data to the server...");

	// send the data to the server
	if (enabled) {
		console.log("Discord Rich Presence is enabled.");

		await fetch("http://localhost:7070/setRP", {
			method: "POST",
			mode: "cors",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				tabCount: await getTabCount(),
				longestTabTimestamp: await getLongestTabTimestamp(),
				browserBrand: await getBrowserInfo()
			})
		}).then(response => {
			if (response.status == 200) {
				return true;
			} else {
				return response.status;
			}
		}).catch(err => {
			console.log(err);
		});
	} else if (!enabled) {
		console.log("Discord Rich Presence is disabled.");

		await fetch("http://localhost:7070/setRP/internal", {
			method: "POST",
			mode: "cors",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				tabURL: "https://github.com/Chronomly/firefox-discord",
				tabTitle: "Paused",
				browserBrand: await getBrowserInfo()
			})
		}).then(response => {
			if (response.status == 200) {
				return true;
			} else {
				return response.status;
			}
		}).catch(err => {
			console.log(err);
		});
	}

	console.log(tabCount);
}

function handleClick() {
	const blackOrWhite = enabled ? "black" : "white";

	// set icon color to indicate enabled/disabled
	browser.action.setIcon({
		path: {
			36: `assets/chat_bubble-${blackOrWhite}-18dp/2x/outline_chat_bubble_${blackOrWhite}_18dp.png`,
			96: `assets/chat_bubble-${blackOrWhite}-48dp/2x/outline_chat_bubble_${blackOrWhite}_48dp.png`
		}
	});

	// set hover text to indicate enabled/disabled
	browser.action.setTitle({
		title: enabled ? "Discord Rich Presence is disabled" : "Discord Rich Presence is enabled"
	});

	return (enabled = !enabled);
}

// handle window focus
browser.windows.onFocusChanged.addListener(() => {
	sendData();
});

// handle tab updates
browser.tabs.onUpdated.addListener(() => {
	sendData();
});

// handle tab switching
browser.tabs.onActivated.addListener(() => {
	sendData();
});

// handle tab deletion
browser.tabs.onRemoved.addListener(tabId => {
	sendData();
});

// handle tab creation
browser.tabs.onCreated.addListener(() => {
	sendData();
});

// handle disable toggle
browser.action.onClicked.addListener(handleClick);
