//Here we get the page number so we know what request to make

var url = window.location.pathname.split('/');
var page = url.pop() || url.pop(); //This deals with trailing slashes
var adv = url.pop();

//Handling title pages

if (page === "story" || page === "problem-sleuth"){
	adv = page;
	page = 1; 
}

//console.log(adv + " " + page); //I use this for debugging, don't judge

//Here we get the value from the options to see if comments should be loaded or not
var hussiecomment = browser.storage.local.get("hussiecomment");
hussiecomment.then(result => {
  if (result.hussiecomment)
    requestCommentary();
});

//Time to request the commentary from the API 

function requestCommentary() {
	fetch('https://recordcrash.com:3141/' + adv + '/' + page)
		.then(data => data.json())
		.then(datajson => {
			if ((datajson[0].commentary != null)){ //If there's actually commentary for that page, we try to create the container
				//We create the div we're going to embed in the page based on homestuck.com standards

				var son = document.createElement("div");
        son.id = "commentary";
				son.className = "row bg-hs-gray bg-light-gray--md pad-b-md pad-b-lg--md pos-r";
				var sonsson = document.createElement("div");
				sonsson.className = "mar-x-auto disp-bl bg-hs-gray pad-t-lg";
				sonsson.style = "max-width:650px;";
				var commentary = document.createElement("p");
				commentary.className = "o-story_text type-rg type-hs-small--md type-center line-caption line-copy--md pad-x-0 pad-x-lg--md pad-b-lg";
        commentary.style = "white-space:pre-line;";

				//We add the commentary to it (Note to self: look into just doing a secure innerHTML so we can add images in the future)
				commentary.textContent = datajson[0].commentary;

				//And now we add the commentary container to the div, the div to the other div, etc
				sonsson.appendChild(commentary);
				son.appendChild(sonsson);
				document.getElementsByClassName("pos-r")[0].appendChild(son);
			}

			if ((datajson[0].notes != null)){ //If there's actually notes for that page, we try to create the container
				//We create the div we're going to embed in the page based on homestuck.com standards

				var son = document.createElement("div");
        son.id = "notes";
				son.className = "row bg-hs-gray bg-light-gray--md pad-b-md pad-b-lg--md pos-r";
				var sonsson = document.createElement("div");
				sonsson.className = "mar-x-auto disp-bl bg-hs-gray pad-t-lg";
				sonsson.style = "max-width:650px;";
				var notes = document.createElement("p");
				notes.className = "o-story_text type-rg type-hs-small--md type-center line-caption line-copy--md pad-x-0 pad-x-lg--md pad-b-lg";
        notes.style = "white-space:pre-line;";

				//We add the notes to it (Note to self: stop repeating comments)
				notes.textContent = datajson[0].notes;

				//And now we add the notes container to the div, the div to the other div, etc
				sonsson.appendChild(notes);
				son.appendChild(sonsson);
				document.getElementsByClassName("pos-r")[0].appendChild(son);
			}
		}) 
		.catch(error => {
			if (error instanceof TypeError)
				console.log("[HOMESTUCK COMPANION] There is no commentary available for this page yet, but there may be in the future. Support the official book releases!");
		}); //or if there's an error remove the container
}

//Keyboard controls

document.onkeydown = function(e) {
    switch (e.keyCode) {
    	case 17:
    		if(document.activeElement.id != "SBURBStage" && document.activeElement.type != "application/x-shockwave-flash") {
            	document.getElementsByClassName("o_chat-log-btn")[0].click();
        	}
    		break;
        case 37:
        	//If you are not playing a walkaround, change page
        	if(document.activeElement.id != "SBURBStage" && document.activeElement.type != "application/x-shockwave-flash") {
            	document.getElementsByClassName("o_game-nav-item")[1].lastElementChild.click();
        	}
            break;
        case 39:
        	if(document.activeElement.id != "SBURBStage" && document.activeElement.type != "application/x-shockwave-flash") {
            	document.getElementsByClassName("o_story-nav type-hs-copy line-tight pad-x-0 pad-x-lg--md mar-b-lg")[0].lastElementChild.children[1].click();
            }
            break;
    }
};

//Add or remove commentary on option change

browser.storage.onChanged.addListener(change => {
  if (change.hussiecomment.newValue)
    requestCommentary();
  else {
    document.querySelector("#commentary").remove();
    document.querySelector("#notes").remove();
  }
});
