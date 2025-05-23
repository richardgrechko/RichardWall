var wallName = getWallName();
function loadScript(url, callback) {
  var elem = document.createElement("script");
  elem.src = url;
  document.head.appendChild(elem);
  elem.onload = callback;
}
if (wallName == "cat") {
  loadScript("/static/oneko.js");
  console.log("/cat, activated oneko cat");
}
console.log("loaded scripts for walls")