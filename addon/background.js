/* eslint-disable no-redeclare */
/* eslint-disable no-undef */
let enabled = true;

// function for figuring out what browser is being used
function getBrowserInfo() {
	// detect firefox
	if(browser.runtime.getBrowserInfo) {
		return browser.runtime.getBrowserInfo().then(info => {
			return info.name;
		});
	}

	// detect chrome
	return browser.management.getSelf().then(info => {
		return info.name;
	});
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

async function postData(url = "", data = {}) {
	if(enabled == false) return;

	const response = await fetch(url, {
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
	});
	return response.json();
}

function sendData(tab) {
	if (enabled) {
		if (tab.incognito) return;
		postData("http://localhost:7070/setRP", {
			tabURL: tab.url,
			tabTitle: tab.title,
		});
	} else if (!enabled) {
		postData("http://localhost:7070/setRP", {
			tabURL: "https://github.com/Chronomly/firefox-discord",
			tabTitle: "Paused",
		}).then(data => {
			console.log(data); // JSON data parsed by `data.json()` call
		});
	}
}

function handleActivated(activeInfo) {
	let tabq = browser.tabs.get(activeInfo.tabId);
	tabq.then(function (tab) {
		sendData(tab);
	});
}

function handleUpdated(tabId) {
	let tabq = browser.tabs.get(tabId);
	tabq.then(function (tab) {
		if (tab.active) sendData(tab);
	});
}

function handleFocus(windowId) {
	if (windowId < 0) return;
	let wq = browser.windows.get(windowId);
	wq.then(function (win) {
		if (win.focused) {
			let tabq = browser.tabs.query({active: true, currentWindow: true});
			tabq.then(function (rtab) {
				sendData(rtab[0]);
			});
		}
	});
}

function handleClick() {
	const blackOrWhite = enabled ? "black" : "white";

	browser.browserAction.setIcon({
		path: {
			36: `assets/chat_bubble-${blackOrWhite}-18dp/2x/outline_chat_bubble_${blackOrWhite}_18dp.png`,
			96: `assets/chat_bubble-${blackOrWhite}-48dp/2x/outline_chat_bubble_${blackOrWhite}_48dp.png`
		}
	});

	return (enabled = !enabled);
}

browser.windows.onFocusChanged.addListener(handleFocus);
browser.tabs.onUpdated.addListener(handleUpdated);
browser.tabs.onActivated.addListener(handleActivated);

// handle disable toggle
browser.browserAction.onClicked.addListener(handleClick);
