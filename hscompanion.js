var pathname = window.location.pathname.split('/', 3); // e.g. /story/123/ becomes ['', 'story', '123']
var page = pathname[2];
var adv = pathname[1];

// for title pages
if (page == undefined){
  page = 1;
}

// TODO: retrieve value from options
var hussiecomment = true;

function addContentToPage(content) {
  // create a new row of content to the bottom of the page
  var row = document.createElement("div");
  row.className = "row bg-hs-gray bg-light-gray--md pad-b-md pad-b-lg--md pos-r"; // from homestuck page
  var card = document.createElement("div");
  card.className = "mar-x-auto disp-bl bg-hs-gray pad-t-lg";
  card.style = "max-width:650px;";
  var container = document.createElement("p");
  container.className = "o-story_text type-rg type-hs-small--md type-center line-caption line-copy--md pad-x-0 pad-x-lg--md pad-b-lg";

  // consider using innerHTML so that in future images can be added
  container.textContent = content;

  // add to page
  card.appendChild(container);
  row.appendChild(card);
  document.getElementsByClassName("pos-r")[0].appendChild(row);
}

if (hussiecomment){
  fetch('https://recordcrash.com:3141/' + adv + '/' + page)
    .then(data => data.json())
    .then(content => {
      if ((content[0].commentary != null)){
        addContentToPage(content[0].commentary);
      }

      if ((content[0].notes != null)){
        addContentToPage(content[0].notes);
      }
    })
    .catch(error => {
      if (error instanceof TypeError)
        console.log("[HOMESTUCK COMPANION] There is no commentary available for this page yet, but there may be in the future. Support the official book releases!");
      // or if there's an error remove the container
    });
}

// add keyboard controls for navigation
document.onkeydown = function(e) {
  switch (e.keyCode) {
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
