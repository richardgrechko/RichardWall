setInterval(function() {
  self.postMessage(new Uint8Array(1));
}, 30000)