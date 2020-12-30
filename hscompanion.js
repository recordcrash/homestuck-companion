//Here we get the page number so we know what request to make
var url = window.location.pathname.split("/");
var page = url.pop() || url.pop(); //This deals with trailing slashes
var adv = url.pop();

//Handling title pages

if (page === "story" || page === "problem-sleuth") {
  adv = page;
  page = 1;
}

//Here we get the value from the options to see if comments should be loaded or not
var hussiecomment = browser.storage.local.get("hussiecomment");
hussiecomment.then((result) => {
  if (result.hussiecomment) requestCommentary();
});

//Time to request the commentary from the API

function requestCommentary() {
  if (!window.location.hostname.includes("homestuck2.com")) {
    // Only load commentary on the Homestuck proper domain - prevents issues with Homestuck^2
    readFile(browser.extension.getURL("./commentary.json"))
      .then((datajson) => {
        advJson = JSON.parse(datajson).find((el) => el.name === adv);
        pageJson = advJson.data.find((el) => el.id === page.toString());
        if (pageJson.commentary) {
          //If there's actually commentary for that page, we try to create the container
          //We create the div we're going to embed in the page based on homestuck.com standards

          var son = document.createElement("div");
          son.id = "commentary";
          son.className =
            "row bg-hs-gray bg-light-gray--md pad-b-md pad-b-lg--md pos-r";
          var sonsson = document.createElement("div");
          sonsson.className = "mar-x-auto disp-bl bg-hs-gray pad-t-lg";
          sonsson.style = "max-width:650px;";
          var commentary = document.createElement("p");
          commentary.className =
            "o-story_text type-rg type-hs-small--md type-center line-caption line-copy--md pad-x-0 pad-x-lg--md pad-b-lg";
          commentary.style = "white-space:pre-line;";

          //We add the commentary to it (Note to self: look into just doing a secure innerHTML so we can add images in the future)
          commentary.textContent = pageJson.commentary;

          //And now we add the commentary container to the div, the div to the other div, etc
          sonsson.appendChild(commentary);
          son.appendChild(sonsson);
          document.getElementsByClassName("pos-r")[0].appendChild(son);
        }

        if (pageJson.notes) {
          //If there's actually notes for that page, we try to create the container
          //We create the div we're going to embed in the page based on homestuck.com standards

          var son = document.createElement("div");
          son.id = "notes";
          son.className =
            "row bg-hs-gray bg-light-gray--md pad-b-md pad-b-lg--md pos-r";
          var sonsson = document.createElement("div");
          sonsson.className = "mar-x-auto disp-bl bg-hs-gray pad-t-lg";
          sonsson.style = "max-width:650px;";
          var notes = document.createElement("p");
          notes.className =
            "o-story_text type-rg type-hs-small--md type-center line-caption line-copy--md pad-x-0 pad-x-lg--md pad-b-lg";
          notes.style = "white-space:pre-line;";

          //We add the notes to it (Note to self: stop repeating comments)
          notes.textContent = pageJson.notes;

          //And now we add the notes container to the div, the div to the other div, etc
          sonsson.appendChild(notes);
          son.appendChild(sonsson);
          document.getElementsByClassName("pos-r")[0].appendChild(son);
        }
      })
      .catch((error) => {
        if (error instanceof TypeError)
          console.log(
            "[HOMESTUCK COMPANION] There is no commentary available for this page yet, but there may be in the future. Support the official book releases!"
		  );
		  
		  var son = document.createElement("div");
          son.id = "notes";
          son.className =
            "row bg-hs-gray bg-light-gray--md pad-b-md pad-b-lg--md pos-r";
          var sonsson = document.createElement("div");
          sonsson.className = "mar-x-auto disp-bl bg-hs-gray pad-t-lg";
          sonsson.style = "max-width:650px;";
          var notes = document.createElement("p");
          notes.className =
            "o-story_text type-rg type-hs-small--md type-center line-caption line-copy--md pad-x-0 pad-x-lg--md pad-b-lg";
          notes.style = "white-space:pre-line;";

          //We add the notes to it (Note to self: stop repeating comments)
          notes.innerHTML = '<div><p>The Homestuck Companion Extension has been deprecated as of 2021, and will be delisted in 2022. You are highly encouraged to uninstall it and <a href="https://bambosh.github.io/unofficial-homestuck-collection/">check this out instead</a>: <a href="https://bambosh.github.io/unofficial-homestuck-collection/"><img src="https://bambosh.github.io/unofficial-homestuck-collection/images/collection_logo.png"/></a></p><p>Not only does it offer better user experience than Homestuck.com, including Flash animations, but it will have a mod in the near future that will completely replace this extension, and be updated with future commentary, if any. Stay tuned for news <a href="https://homestuck.net/collection.html">here</a>.</p></div>';

          //And now we add the notes container to the div, the div to the other div, etc
          sonsson.appendChild(notes);
          son.appendChild(sonsson);
          document.getElementsByClassName("pos-r")[0].appendChild(son);
      }); //or if there's an error remove the container
  }
}

//Keyboard controls

document.onkeydown = function (e) {
  switch (e.keyCode) {
    case 17: //either ctrl key
      if (e.location == 2) {
        //restricts key to right ctrl
        if (
          document.activeElement.id != "SBURBStage" &&
          document.activeElement.type != "application/x-shockwave-flash"
        ) {
          document.getElementsByClassName("o_chat-log-btn")[0].click();
        }
      }
      break;
    case 37: //left arrow
      //If you are not playing a walkaround, change page
      if (
        document.activeElement.id != "SBURBStage" &&
        document.activeElement.type != "application/x-shockwave-flash"
      ) {
        document.getElementsByClassName("disp-ib")[0].lastElementChild.click(); // `disp-ib` is SBaHJ's special forward / backward nav box
        document
          .getElementsByClassName("o_game-nav-item")[1]
          .lastElementChild.click();
      }
      break;
    case 39: //right arrow
      if (
        document.activeElement.id != "SBURBStage" &&
        document.activeElement.type != "application/x-shockwave-flash"
      ) {
        if (!window.location.hostname.includes("homestuck2.com")) {
          // site-specific workaround - for some reason, `click()`ing both elements doesn't work on Homestuck^2
          document
            .getElementsByClassName("disp-ib")[1]
            .firstElementChild.click();
        }
        document
          .getElementsByClassName(
            "o_story-nav type-hs-copy line-tight pad-x-0 pad-x-lg--md"
          )[0]
          .lastElementChild.children[1].click(); // This also handles the Epilogues if we remove the last class `mar-b-lg` (Epilogues use `pad-b`lg`).
      }
      break;
  }
};

//Add or remove commentary on option change

browser.storage.onChanged.addListener((change) => {
  if (change.hussiecomment.newValue) requestCommentary();
  else {
    document.querySelector("#commentary").remove();
    document.querySelector("#notes").remove();
  }
});

//Readfile function for the json

let readFile = (_path) => {
  return new Promise((resolve, reject) => {
    fetch(_path, { mode: "same-origin" })
      .then(function (_res) {
        return _res.blob();
      })
      .then(function (_blob) {
        var reader = new FileReader();

        reader.addEventListener("loadend", function () {
          resolve(this.result);
        });

        reader.readAsText(_blob);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
