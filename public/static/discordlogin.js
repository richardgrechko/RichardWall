//wip
function discordLogin() {
  var login = window.open(
    "https://discord.com/api/oauth2/authorize?client_id=1201515886683619368&response_type=code&redirect_uri=https%3A%2F%2Fdimkatextwall.glitch.me%2Fauthorized.html&scope=identify"
  );
  var interval = setInterval(
    () => {
      login.postMessage("", "https://dimkatextwall.glitch.me");
      if (login.closed) cancelDiscordLogin();
    },
    500
  );
  discordloginbtn.disabled = true;
  document.getElementById("login").style.display = "none";
  window.addEventListener(
    "message",
    (e) => {
      if (e.data.error) {
        showAlert("An error occurred. Please try again.", 5e3);
        console.log("Discord login error:", e.data.error, e.data.error_description);
        cancelDiscordLogin();
      }
      if (!e.data.code) return;
      clearInterval(interval);
      login.close();
      client.sendWsMessage({ discordlogin: [e.data.code] });
    },
    { once: true }
  );
  login.onclose = cancelDiscordLogin;
  function cancelDiscordLogin() {
    clearInterval(interval);
    login.close();
    discordloginbtn.disabled = false;
    document.getElementById("login").style.display = "block";
    
  }
}


