function handleInstallation(detail) {
  function setDefaultOptions() {
    browser.storage.local.set({
      hussiecomment: true
    });
  }

  if (detail.reason === "install")
    setDefaultOptions();
}

browser.runtime.onInstalled.addListener(handleInstallation);
