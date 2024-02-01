//wip
var login;
var interval;
var code;
var canceldiscordlogin = document.getElementById("canceldiscordlogin");
var discordloginbtn = document.getElementById("discordloginbtn");
var discordloginname = document.getElementById("discordloginname");
var discordchoosename = document.getElementById("discordchoosename");

function discordLogin() {
  login = window.open(
    "https://discord.com/api/oauth2/authorize?client_id=1201515886683619368&response_type=code&redirect_uri=https%3A%2F%2Fdimkatextwall.glitch.me%2Fauthorized.html&scope=identify"
  );
  interval = setInterval(() => {
    login.postMessage("", "https://dimkatextwall.glitch.me");
    if (login.closed) cancelDiscordLogin();
  }, 500);
  discordloginbtn.disabled = true;
  document.getElementById("login").style.display = "none";
  window.addEventListener(
    "message",
    (e) => {
      if (e.data.error) {
        showAlert("An error occurred. Please try again.", 5e3);
        console.log(
          "Discord login error:",
          e.data.error,
          e.data.error_description
        );
        cancelDiscordLogin();
      }
      if (!e.data.code) return;
      clearInterval(interval);
      login.close();
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
  login.close();
  discordloginbtn.disabled = false;
  document.getElementById("login").style.display = "block";
  document.getElementById("discordlogin").style.display = "none";
  discordloginbtn.style.display = "inline-block";
  discordloginname.disabled = false;
  discordchoosename.disabled = false;
}

client.on("wsmessage", e => {
  if (e.discordnoaccount) {
    document.getElementById("discordlogin").style.display = "block";
    discordloginbtn.style.display = "none";
    discordloginbtn.disabled = false;
  }
  if (e.discordnametaken) {
    showAlert("Username is already in use.", 3e3);
    discordloginname.disabled = false;
    discordchoosename.disabled = false;
  }
  if (e.token) {
    cancelDiscordLogin();
    discordloginbtn.style.display = "inline-block";
  }
  if (e.discordloginfail) {
    showAlert("An error occurred.", 3e3);
    cancelDiscordLogin();
  }
});

discordchoosename.onclick = sendUsername;
discordloginname.onkeydown = e => {
  if (e.which == 13) sendUsername();
};
function sendUsername() {
  client.sendWsMessage({ discordlogin: discordloginname.value });
  discordloginname.disabled = true;
  discordchoosename.disabled = true;
}