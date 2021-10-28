function saveOptions(e) {
  e.preventDefault();
  browser.storage.local.set({
    hussiecomment: document.querySelector("#hussiecomment").checked,
    notuhc: document.querySelector("#notuhc").checked,
  });
}

function restoreOptions() {

  function setCurrentChoice(key) {
    return async function setCurrentChoice(result) {
      if (result[key] === undefined) {
        options = {}
        options[key] = true
        await browser.storage.local.set(options);
      }
      document.querySelector("#" + key).checked = result[key];
    }
  }

  function onError(error) {
    console.log('[HOMESTUCK COMPANION] Error saving options: ${error}');
  }

  //We attempt to get the boolean values from storage
  var hussiecomment = browser.storage.local.get("hussiecomment");
  var notuhc = browser.storage.local.get("notuhc");

  hussiecomment.then(setCurrentChoice("hussiecomment"), onError);
  notuhc.then(setCurrentChoice("notuhc"), onError);
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
