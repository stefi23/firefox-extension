// Put all the javascript code here, that you want to execute after page load.

// example response:
// {"https://ytmnd.com": 6,
//  "https://ifunny.com", 30}

var currentTab;

function updateHearts(url, numberOfHearts) {
  browser.browserAction.setBadgeText({
    tabId: currentTab.id,
    text: numberOfHearts.toString(),
  });
}

function updateActiveTab(tabs) {
  function updateTab(tabs) {
    if (tabs[0]) {
      currentTab = tabs[0];
      const url = currentTab.url;
      browser.storage.local.get("hearts").then((response) => {
        updateHearts(url, response[url] || 0);
      });
    }
  }
  var gettingActiveTab = browser.tabs.query({
    active: true,
    currentWindow: true,
  });
  gettingActiveTab.then(updateTab);
}

function addHeart(tab) {
  const url = tab.url;
  browser.storage.local
    .get("hearts")
    .then((response) => {
      const newHearts = (response[url] || 0) + 1;
      console.log("response:", response);
      response[url] = newHearts;
      updateHearts(url, newHearts);
      return browser.storage.sync.set({ hearts: response });
    })
    .then(() => {
      console.log("set hearts");
    });
}

browser.browserAction.onClicked.addListener(addHeart);
browser.tabs.onUpdated.addListener(updateActiveTab);
browser.tabs.onActivated.addListener(updateActiveTab);
browser.windows.onFocusChanged.addListener(updateActiveTab);

updateActiveTab();
