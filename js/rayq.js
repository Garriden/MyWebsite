// oneko.js: https://github.com/adryd325/oneko.js



(function oneko() {
  const NEKO_SPEED = 14;

  const isReducedMotion =
    window.matchMedia(`(prefers-reduced-motion: reduce)`) === true ||
    window.matchMedia(`(prefers-reduced-motion: reduce)`).matches === true;

  if(isReducedMotion) return;

  const nekoEl = document.createElement("div");

  let nekoPosX = 32;
  let nekoPosY = 32;

  let mousePosX = 0;
  let mousePosY = 0;

  let frameCount = 0;
  let idleTime = 0;
  let idleAnimation = null;
  let idleAnimationFrame = 0;

  const spriteSets = { // col / row.
    idle: [[-1, -2]],
    alert: [[-3, -3]],
    scratchSelf: [
      [-2, -2], [-2, -2], [-2, -2], [-2, -2], [-2, -2],
      [-2, -3], [-2, -3], [-2, -3], [-2, -3], [-2, -3],
      [-2, -2], [-2, -2], [-2, -2], [-2, -2], [-2, -2],
      [-2, -4], [-2, -4], [-2, -4], [-2, -4], [-2, -4],],
    tired: [[-3, -2]],
    sleeping: [[0, -2], [0, -2], [0, -3], [0, -3],],
    N: [
      [-4, 0],
      [-4, -1],
    ],
    NE: [
      [-3, -0],
      [-3, -1],
    ],
    E: [
      [-2, 0],
      [-2, -1],
    ],
    SE: [
      [-1, 0],
      [-1, -1],
    ],
    S: [
      [0, 0],
      [0, -1],
    ],
    SW: [
      [-7, 0],
      [-7, -1],
    ],
    W: [
      [-6, 0],
      [-6, -1],
    ],
    NW: [
      [-5, 0],
      [-5, -1],
    ],
  };

  function init() {
    nekoEl.id = "oneko";
    nekoEl.ariaHidden = true;
    nekoEl.style.width = "128px";
    nekoEl.style.height = "128px";
    nekoEl.style.position = "fixed";
    nekoEl.style.pointerEvents = "auto";
    nekoEl.style.imageRendering = "pixelated";
    nekoEl.style.left = `${nekoPosX - 16}px`;
    nekoEl.style.top = `${nekoPosY - 16}px`;
    nekoEl.style.zIndex = 2147483647;

    //let nekoFile = "./images/oneko.gif"
    let nekoFile = "./images/rayqq.gif"
    const curScript = document.currentScript
    if (curScript && curScript.dataset.cat) {
      nekoFile = curScript.dataset.cat
    }
    nekoEl.style.backgroundImage = `url(${nekoFile})`;

    document.body.appendChild(nekoEl);

    // Scroll.
    document.addEventListener("wheel", function (event) {
      nekoPosY -= event.deltaY / 2;
      updatePos();
    });

    document.addEventListener("mousemove", function (event) {
      mousePosX = event.clientX;
      mousePosY = event.clientY;
    });

    window.requestAnimationFrame(onAnimationFrame);
  }

  let lastFrameTimestamp;

  function onAnimationFrame(timestamp) {
    // Stops execution if the neko element is removed from DOM
    if(!nekoEl.isConnected) {
      return;
    }

    if(!lastFrameTimestamp) {
      lastFrameTimestamp = timestamp;
    }

    if(timestamp - lastFrameTimestamp > 100) {
      lastFrameTimestamp = timestamp;
      frame();
    }

    window.requestAnimationFrame(onAnimationFrame);
  }

  function setSprite(name, frame) {
    const sprite = spriteSets[name][frame % spriteSets[name].length];
    nekoEl.style.backgroundPosition = `${sprite[0] * 128}px ${sprite[1] * 128}px`;
  }

  function resetIdleAnimation() {
    idleAnimation = null;
    idleAnimationFrame = 0;
  }

  function idle() {
    ++idleTime;

    if(idleTime > 4 && Math.floor(Math.random() * 50) == 0 && idleAnimation == null) {
      let avalibleIdleAnimations = ["sleeping", "scratchSelf"];

      idleAnimation =
        avalibleIdleAnimations[
          Math.floor(Math.random() * avalibleIdleAnimations.length)
        ];
    }

    switch(idleAnimation) {
      case "sleeping":
        if(idleAnimationFrame < 30) {
          setSprite("tired", 0);
          break;
        }
        setSprite("sleeping", Math.floor(idleAnimationFrame / 4));
        if(idleAnimationFrame > 250) {
          resetIdleAnimation();
        }
        break;
      case "scratchWallN":
      case "scratchWallS":
      case "scratchWallE":
      case "scratchWallW":
      case "scratchSelf":
        setSprite(idleAnimation, idleAnimationFrame);
        if(idleAnimationFrame > 50) {
          resetIdleAnimation();
        }
        break;
      default:
        setSprite("idle", 0);
        return;
    }
    ++idleAnimationFrame;
  }

  function explodeHearts() {
    const parent = nekoEl.parentElement;
    const rect = nekoEl.getBoundingClientRect();
    const scrollLeft = window.scrollX || document.documentElement.scrollLeft;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const centerX = rect.left + rect.width / 2 + scrollLeft;
    const centerY = rect.top + rect.height / 2 + scrollTop;

    for (let ii = 0; ii < 50; ++ii) {
      const heart = document.createElement('div');
      heart.className = 'heart';
      heart.textContent = '❤';
      const offsetX = (Math.random() - 0.6) * 100;
      const offsetY = (Math.random() - 0.65) * 100;
      heart.style.left = `${centerX + offsetX - 16}px`;
      heart.style.top = `${centerY + offsetY - 16}px`;
      parent.appendChild(heart);

      setTimeout(() => {
        parent.removeChild(heart);
      }, 1000);
    }
  }

  const style = document.createElement('style');
  style.innerHTML = `
		  @keyframes heartBurst {
			  0% { transform: scale(0); opacity: 1; }
        100% { transform: scale(1); opacity: 0; }
		  }
		  .heart {
			  position: absolute;
			  font-size: 4em;
			  animation: heartBurst 1s ease-out;
			  animation-fill-mode: forwards;
			  color: #f40a7bff;
		  }
	  `;

  document.head.appendChild(style);
  nekoEl.addEventListener('click', explodeHearts);

  function frame() {
    ++frameCount;
    const diffX = nekoPosX - mousePosX;
    const diffY = nekoPosY - mousePosY;
    const distance = Math.sqrt(diffX ** 2 + diffY ** 2);

    if(distance < NEKO_SPEED || distance < 72) {
      idle();
      return;
    }

    idleAnimation = null;
    idleAnimationFrame = 0;

    if(idleTime > 1) {
      setSprite("alert", 0);

      // count down after being alerted before moving
      idleTime = Math.min(idleTime, 7);
      --idleTime;
      return;
    }

    let direction;
    direction  = diffY / distance >  0.5 ? "N" : "";
    direction += diffY / distance < -0.5 ? "S" : "";
    direction += diffX / distance >  0.5 ? "W" : "";
    direction += diffX / distance < -0.5 ? "E" : "";
    setSprite(direction, frameCount);

    nekoPosX -= (diffX / distance) * NEKO_SPEED;
    nekoPosY -= (diffY / distance) * NEKO_SPEED;

    updatePos();
  }

function updatePos() {
  // Hide the cat if it is off-screen
  if(nekoPosY > window.innerHeight) {
    nekoEl.style.display = "none";
  } else {
    nekoEl.style.display = "block";
    nekoEl.style.left = `${nekoPosX - 16}px`;
    nekoEl.style.top = `${nekoPosY - 16}px`;
  }
}

  init();
})();