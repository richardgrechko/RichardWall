(function oneko() {
  const isReducedMotion =
    window.matchMedia(`(prefers-reduced-motion: reduce)`).matches;

  if (isReducedMotion) return;

  const nekoEl = createNekoElement();
  const nekoPos = { x: 32, y: 32 };
  const mousePos = { x: 0, y: 0 };
  let frameCount = 0;
  let idleTime = 0;
  let idleAnimation = null;
  let idleAnimationFrame = 0;
  const nekoSpeed = 16;

  const spriteSets = {
    // Sprite sets defined here
  };

  function createNekoElement() {
    const nekoEl = document.createElement("div");
    nekoEl.id = "oneko";
    nekoEl.ariaHidden = true;
    nekoEl.style.cssText = `
      width: 32px;
      height: 32px;
      position: fixed;
      pointer-events: none;
      image-rendering: pixelated;
      z-index: ${Number.MAX_VALUE};
    `;
    nekoEl.style.backgroundImage = `url(${getNekoFile()})`;
    document.body.appendChild(nekoEl);
    return nekoEl;
  }

  function getNekoFile() {
    const curScript = document.currentScript;
    return curScript && curScript.dataset.cat
      ? curScript.dataset.cat
      : "/static/oneko.gif";
  }

  function onMouseMove(event) {
    mousePos.x = event.clientX;
    mousePos.y = event.clientY;
  }

  let lastFrameTimestamp; // Define lastFrameTimestamp variable

  function onAnimationFrame(timestamp) {
    if (!nekoEl.isConnected) return;
    if (!lastFrameTimestamp) lastFrameTimestamp = timestamp;
    if (timestamp - lastFrameTimestamp > 100) {
      lastFrameTimestamp = timestamp;
      frame();
    }
    window.requestAnimationFrame(onAnimationFrame);
  }

  function setSprite(name, frame) {
    const sprite = spriteSets[name][frame % spriteSets[name].length];
    nekoEl.style.backgroundPosition = `${sprite[0] * 32}px ${sprite[1] * 32}px`;
  }

  // Other utility functions and sprite definitions go here...

  function frame() {
    frameCount += 1;
    const diffX = nekoPos.x - mousePos.x;
    const diffY = nekoPos.y - mousePos.y;
    const distance = Math.sqrt(diffX ** 2 + diffY ** 2);

    if (distance < nekoSpeed || distance < 48) {
      idle();
      return;
    }

    idleAnimation = null;
    idleAnimationFrame = 0;

    if (idleTime > 1) {
      setSprite("alert", 0);
      idleTime = Math.min(idleTime, 7);
      idleTime -= 1;
      return;
    }

    let direction = "";
    direction += diffY / distance > 0.5 ? "N" : "";
    direction += diffY / distance < -0.5 ? "S" : "";
    direction += diffX / distance > 0.5 ? "W" : "";
    direction += diffX / distance < -0.5 ? "E" : "";
    setSprite(direction, frameCount);

    nekoPos.x -= (diffX / distance) * nekoSpeed;
    nekoPos.y -= (diffY / distance) * nekoSpeed;

    nekoPos.x = Math.min(Math.max(16, nekoPos.x), window.innerWidth - 16);
    nekoPos.y = Math.min(Math.max(16, nekoPos.y), window.innerHeight - 16);

    nekoEl.style.left = `${nekoPos.x - 16}px`;
    nekoEl.style.top = `${nekoPos.y - 16}px`;
  }

  function init() {
    nekoEl.addEventListener("mousemove", onMouseMove);
    window.requestAnimationFrame(onAnimationFrame);
  }

  init();
})();
