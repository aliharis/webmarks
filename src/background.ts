// Background service worker for Webmarks extension
chrome.action.onClicked.addListener((tab) => {
  // Open the extension app in a new tab
  chrome.tabs.create({
    url: chrome.runtime.getURL('index.html')
  });
});