/* eslint-disable no-redeclare */
/* eslint-disable no-undef */
let enabled = true;

// function onError(error) {
// 	console.log(`Error: ${error}`);
// }

async function postData(url, data) {
	const response = await fetch(url, {
		method: "POST",
		mode: "cors",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	});
	return response.json();
}

function testCompare(url, url) {
	if(url === url) return true;
}

function testCompareNot(url, url) {
	if(url !== url) return false;
}


function sendData(tab) {
	if (enabled) {
		if (tab.incognito) return;
		postData("http://localhost:6553/setRP", {
			tabURL: tab.url,
			tabTitle: tab.title,
		}).then((data) => {
			console.log(data);
		});
	} else if (!enabled) {
		postData("http://localhost:6553/setRP", {
			tabURL: "https://github.com/Chronomly/firefox-discord",
			tabTitle: "Paused",
		}).then((data) => {
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
			let tabq = browser.tabs.query({ active: true, currentWindow: true });
			tabq.then(function (rtab) {
				sendData(rtab[0]);
			});
		}
	});
}

function handleClick() {
	if (enabled) {
		browser.browserAction.setIcon({
			path: {
				36: "assets/chat_bubble-black-18dp/2x/outline_chat_bubble_black_18dp.png",
				96: "assets/chat_bubble-black-48dp/2x/outline_chat_bubble_black_48dp.png",
			},
		});
		return (enabled = false);
	} else if (!enabled) {
		browser.browserAction.setIcon({
			path: {
				36: "assets/chat_bubble-white-18dp/2x/outline_chat_bubble_white_18dp.png",
				96: "assets/chat_bubble-white-48dp/2x/outline_chat_bubble_white_48dp.png",
			},
		});
		return (enabled = true);
	}
}

browser.windows.onFocusChanged.addListener(handleFocus);
browser.tabs.onUpdated.addListener(handleUpdated);
browser.tabs.onActivated.addListener(handleActivated);
browser.browserAction.onClicked.addListener(handleClick);
