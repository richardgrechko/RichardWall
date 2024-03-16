var wallName = location.pathname.replace(/^\/|\/$/g, "");
function loadScript(url, callback) {
  var elem = document.createElement("script");
  elem.src = url;
  document.head.appendChild(elem);
  elem.onload = callback;
}
if (wallName == "cat") {
  loadScript("/static/oneko.js");
}
if (wallName == "~Dimka") {
  document.getElementById("owner").style = "display: block;";
  function updateOwnerIcon() {
    if (location.pathname == "/~Dimka") {} else {document.getElementById("owner").style = "display: none;";}
  }
  setInterval(updateOwnerIcon, 100);
}
if (wallName == "~falling1") {
  document.getElementById("owner").style = "display: block;";
  document.getElementById("owner").title = "This user is the co-owner of Dimka's TextWall.";
  function updateOwnerIcon() {
    if (location.pathname == "/~falling1") {} else {document.getElementById("owner").style = "display: none;";}
  }
  setInterval(updateOwnerIcon, 100);
}