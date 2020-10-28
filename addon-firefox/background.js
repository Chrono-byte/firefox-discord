/* eslint-disable no-redeclare */
/* eslint-disable no-undef */
var enabled = true;

// function onError(error) {
// 	console.log(`Error: ${error}`);
// }

function isDisabled() {
	if (enabled === true) return false;
	if (enabled === false) return true;
}

function getTabJson(currentTab) {
	var response = {
		tabURL : currentTab.url,
		tabTitle : currentTab.title,
	};
	return JSON.stringify(response);
}

function sendData(tab) {
	if(isDisabled() == false) {
		if (tab.incognito)
			return;
		var xhr = new XMLHttpRequest();
		xhr.open("POST", "http://localhost:6553/setRP", true);
		xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
		xhr.send(getTabJson(tab));
	} else if(isDisabled() === true) {
		var xhr = new XMLHttpRequest();
		xhr.open("POST", "http://localhost:6553/setRP", true);
		xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
		xhr.send(JSON.stringify({
			tabURL : "https://github.com/Chronomly/firefox-discord",
			tabTitle : "Paused",
		}));
	}
}

function handleActivated(activeInfo) {
	var tabq = browser.tabs.get(activeInfo.tabId);
	tabq.then(function(tab) {
		sendData(tab);
	});
}

// eslint-disable-next-line no-unused-vars
function handleUpdated(tabId, changeInfo, tabInfo) {
	var tabq = browser.tabs.get(tabId);
	tabq.then(function(tab) {
		if (tab.active)
			sendData(tab);
	});
}

function handleFocus(windowId) {
	if (windowId < 0)
		return;
	var wq = browser.windows.get(windowId);
	wq.then(function(win) {
		if (win.focused) {
			var tabq = browser.tabs.query({active : true, currentWindow : true});
			tabq.then(function(rtab) {
				sendData(rtab[0]);
			});
		}
	});
}

function handleClick() {
	if (enabled === true) {
		browser.browserAction.setIcon({
			path: {
				36: "assets/chat_bubble-black-18dp/2x/outline_chat_bubble_black_18dp.png",
				96: "assets/chat_bubble-black-48dp/2x/outline_chat_bubble_black_48dp.png"
			}
		});
		return enabled = false;
	} else if(enabled === false) {
		browser.browserAction.setIcon({
			path: {
				36: "assets/chat_bubble-white-18dp/2x/outline_chat_bubble_white_18dp.png",
				96: "assets/chat_bubble-white-48dp/2x/outline_chat_bubble_white_48dp.png"
			}
		});
		return enabled = true;
	}
}

browser.windows.onFocusChanged.addListener(handleFocus);
browser.tabs.onUpdated.addListener(handleUpdated);
browser.tabs.onActivated.addListener(handleActivated);
browser.browserAction.onClicked.addListener(handleClick);