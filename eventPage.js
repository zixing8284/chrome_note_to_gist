function openApp() {
    chrome.tabs.create({
        url: chrome.extension.getURL('index.html'),
        active: true
    });
}
chrome.browserAction.onClicked.addListener(() => {
    openApp();
})