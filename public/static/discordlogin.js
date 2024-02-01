var loginPopup;
var interval;
var code;
var canceldiscordlogin = document.getElementById("canceldiscordlogin");
var discordloginbtn = document.getElementById("discordloginbtn");
var discordloginname = document.getElementById("discordloginname");
var discordchoosename = document.getElementById("discordchoosename");

function discordLogin() {
  loginPopup = window.open(
    "https://discord.com/api/oauth2/authorize?client_id=1201515886683619368&response_type=code&redirect_uri=https%3A%2F%2Fdimkatextwall.glitch.me%2Fauthorized.html&scope=identify",
    "",
    "width=800,height=700"
  );
  interval = setInterval(() => {
    loginPopup.postMessage("", "https://dimkatextwall.glitch.me");
    if (loginPopup.closed) cancelDiscordLogin();
  }, 500);
  discordloginbtn.disabled = true;
  document.getElementById("login").style.display = "none";
  window.addEventListener(
    "message",
    (e) => {
      if (e.data.error) {
        showAlert("An error occurred. Please try again.", 5e3);
        console.error(
          "Could not login with Discord:",
          e.data.error,
          e.data.error_description
        );
        cancelDiscordLogin();
      }
      if (!e.data.code) return;
      clearInterval(interval);
      loginPopup.close();
      code = e.data.code;
      client.sendWsMessage({ discordcode: e.data.code });
      client.sendWsMessage({ discordlogin: true });
    },
    { once: true }
  );
}
canceldiscordlogin.onclick = cancelDiscordLogin;
function cancelDiscordLogin() {
  clearInterval(interval);
  loginPopup && loginPopup.close();
  discordloginbtn.disabled = false;
  document.getElementById("login").style.display = "block";
  document.getElementById("discordlogin").style.display = "none";
  discordloginbtn.style.display = "inline-block";
  discordloginname.disabled = false;
  discordchoosename.disabled = false;
}

client.on("wsmessage", (msg) => {
  if (msg.discordnoaccount) {
    document.getElementById("discordlogin").style.display = "block";
    discordloginbtn.style.display = "none";
    discordloginbtn.disabled = false;
  }
  if (msg.discordnametaken) {
    showAlert("Username is already in use.", 3e3);
    discordloginname.disabled = false;
    discordchoosename.disabled = false;
  }
  if (msg.token) {
    cancelDiscordLogin();
    discordloginbtn.style.display = "inline-block";
  }
  if (msg.discordloginfail) {
    showAlert("An error occurred.", 3e3);
    cancelDiscordLogin();
  }
});

discordchoosename.onclick = sendUsername;
discordloginname.onkeydown = (e) => {
  if (e.which == 13) sendUsername();
};
function sendUsername() {
  var username = discordloginname.value;
  if (!/^[\w.-]+$/.test(username)) {
    showAlert("Username is invalid.", 3e3);
    return;
  }
  client.sendWsMessage({ discordlogin: username });
  discordloginname.disabled = true;
  discordchoosename.disabled = true;
}
