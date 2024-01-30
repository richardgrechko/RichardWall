//wip
function discordLogin() {
  var login = window.open("https://discord.com/api/oauth2/authorize?client_id=1201515886683619368&response_type=code&redirect_uri=https%3A%2F%2Fdimkatextwall.glitch.me%2Fauthorized.html&scope=identify");
  var interval = setInterval(() => login.postMessage("", "https://dimkatextwall.glitch.me"), 500);
  window.addEventListener("message", e => {
    if (!e.data.code) return;
    clearInterval(interval);
    login.close();
    console.log(e.data.code);
  }, { once: true });
}