chrome.runtime.onInstalled.addListener(async () => {
  // await openHelloPage();
});

async function openHelloPage() {
  await chrome.tabs.create({
    url: chrome.runtime.getURL("hello.html")
  });
}
