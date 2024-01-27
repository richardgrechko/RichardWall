setInterval(function() {
  self.postMessage(new Uint8Array(1));
  console.log("Ping-pong!");
}, 30000)
// the original was empty