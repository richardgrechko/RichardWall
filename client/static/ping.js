setInterval(function() {
  self.postMessage(new Uint8Array(1));
}, 30000)
// the original was empty