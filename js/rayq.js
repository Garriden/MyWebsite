// oneko.js: https://github.com/adryd325/oneko.js



(function oneko() {
  const NEKO_SPEED = 10;
  const FRAME_SPEED = 125;
  const FRAME_SPEED_MOVING = 50;
  const FRAME_SPEED_IDLE = 1000;
  const FRAME_RATE = -4;
  const START_MOVING_DISTANCE = 400;

  let frameRate = 0;
  let frameSpeed = FRAME_SPEED_MOVING;
  let timesPettedThisSession = 0;

  const isReducedMotion =
    window.matchMedia(`(prefers-reduced-motion: reduce)`) === true ||
    window.matchMedia(`(prefers-reduced-motion: reduce)`).matches === true;

  if(isReducedMotion) return;

  const nekoEl = document.createElement("div");

  let nekoPosX = 1294;
  let nekoPosY = 114;

  let mousePosX = nekoPosX;
  let mousePosY = nekoPosY;

  let startMoving  = 0;

  let frameCount = 0;
  let idleTime = 0;
  let idleAnimation = "sleeping";
  let idleAnimationFrame = 100;

  const spriteSets = { // col / row.
    idle:  [ [-1, -4], [-1, -3],],
    alert: [ [-3, -4], [-3, -4], [-3, -4], [-3, -4]],
    scratchSelf: [
      [-2, -3], [-2, -3], [-2, -3], [-2, -3], [-2, -3],
      [-2, -4], [-2, -4], [-2, -4], [-2, -4], [-2, -4],
      [-2, -3], [-2, -3], [-2, -3], [-2, -3], [-2, -3],
      [-2, -5], [-2, -5], [-2, -5], [-2, -5], [-2, -5],],
    tired: [[-3, -3]],
    sleeping: [[0, -3], [0, -3], [0, -4], [0, -4],],
    N:  [ [-4, 0], [-4, -1], [-4, -2],],
    NE: [ [-3, 0], [-3, -1], [-3, -2],],
    E:  [ [-2, 0], [-2, -1], [-2, -2],],
    SE: [ [-1, 0], [-1, -1], [-1, -2],],
    S:  [ [0, 0],  [0, -1],  [0, -2], ],
    SW: [ [-7, 0], [-7, -1], [-7, -2],],
    W:  [ [-6, 0], [-6, -1], [-6, -2],],
    NW: [ [-5, 0], [-5, -1], [-5, -2],],
  };

  function init() {
    nekoEl.id = "oneko";
    nekoEl.ariaHidden = true;
    nekoEl.style.width = "128px";
    nekoEl.style.height = "128px";
    nekoEl.style.position = "absolute";
    nekoEl.style.pointerEvents = "auto";
    nekoEl.style.imageRendering = "pixelated";
    nekoEl.style.left = `${nekoPosX - 16}px`;
    nekoEl.style.top = `${nekoPosY - 16}px`;
    nekoEl.style.zIndex = Number.MAX_SAFE_INTEGER;

    //let nekoFile = "./images/oneko.gif"
    let nekoFile = "./images/rayqq.gif"
    const curScript = document.currentScript
    if (curScript && curScript.dataset.cat) {
      nekoFile = curScript.dataset.cat
    }
    nekoEl.style.backgroundImage = `url(${nekoFile})`;

    document.body.appendChild(nekoEl);

    document.addEventListener("mousemove", function (event) {
      mousePosX = event.clientX;
      mousePosY = event.clientY + window.scrollY;
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

    if(timestamp - lastFrameTimestamp > frameSpeed) {
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

    if(idleTime > 3 && Math.floor(Math.random() * 10) == 0 && idleAnimation == null) {
      frameSpeed = FRAME_SPEED;
      //let avalibleIdleAnimations = ["sleeping", "scratchSelf"];

      idleAnimation = "sleeping";
        //avalibleIdleAnimations[
        //  Math.floor(Math.random() * avalibleIdleAnimations.length)
        //];
    }

    switch(idleAnimation) {
      case "sleeping":
        frameSpeed = FRAME_SPEED;
        if(idleAnimationFrame < 30) {
          setSprite("tired", 0);
          break;
        }
        setSprite("sleeping", Math.floor(idleAnimationFrame / 4));
        if(idleAnimationFrame > 400) {
          resetIdleAnimation();
        }
        break;
      case "scratchSelf":
        frameSpeed = FRAME_SPEED;
        setSprite(idleAnimation, idleAnimationFrame);
        if(idleAnimationFrame > 55) {
          resetIdleAnimation();
        }
        break;
      default:
        frameSpeed = FRAME_SPEED_IDLE;
        setSprite("idle", idleTime);
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

  function Petting()
  {
    ++timesPettedThisSession;
    incrementCounter();

    frameSpeed = 1; // change to scratch fast.
    idleAnimation = "scratchSelf";
  
    const parent = nekoEl.parentElement;
    const rect = nekoEl.getBoundingClientRect();
    const scrollLeft = window.scrollX || document.documentElement.scrollLeft;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const centerX = rect.left + rect.width / 2 + scrollLeft;
    const centerY = rect.top + rect.height / 2 + scrollTop;
  
    let thunderCount = 10;
    let delay = 0; // Starting delay in milliseconds
  
    for(let ii = 0; ii < thunderCount; ++ii) {
      const randomDelay = Math.random() * 500; // Delay each thunder.
      
      // Create the icon with a delay
      setTimeout(() => {
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.textContent = '⚡';
        
        const offsetX = (Math.random() - 1.2) * 100;
        const offsetY = (Math.random() - 1.5) * 100;
        
        heart.style.left = `${centerX + offsetX - 32}px`;
        heart.style.top = `${centerY + offsetY - 32}px`;
        
        parent.appendChild(heart);
  
        setTimeout(() => {
          parent.removeChild(heart);
        }, 1000);
      }, delay + randomDelay);
      
      // Increase the base delay for the next thunder
      delay += 100;
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
        font-size: 10em;
        animation: heartBurst 1s ease-out;
        animation-fill-mode: forwards;
        color:rgb(222, 255, 38);
      }
    `;

  document.head.appendChild(style);


  const SERVER_URL = 'http://localhost:3000';

  const counterDisplay = document.getElementById('pet-counter');

  // Function to fetch and display the current count (run on page load)
  async function getAndUpdateCounter() {
      try {
          // Replace with your actual server endpoint
          const response = await fetch(`${SERVER_URL}/api/get-neko-pet-count`); 
          const data = await response.json();
          counterDisplay.textContent = data.count; // Assuming the server returns { count: N }
      } catch (error) {
          console.error('Error fetching count:', error);
      }
  }

async function incrementCounter() {
    try {

        // Replace with your actual server endpoint

        const finalUrl = `${SERVER_URL}/api/increment-neko-pet-count`;
        console.log('Attempting POST to:', finalUrl);
        
        const response = await fetch(finalUrl, {
            method: 'POST', // Use POST to signal a change in data
            headers: {
                'Content-Type': 'application/json'
            }
            // You might send a body here if necessary, but for a simple increment, it's optional
        });
        
        const data = await response.json();
        
        // Update the displayed counter with the new count returned by the server
        counterDisplay.textContent = data.newCount; 

    } catch (error) {
        console.error('Error incrementing count:', error);
        // Optionally show an error to the user
    }
}

// 3. Attach the event listener
  //nekoEl.addEventListener('click', explodeHearts);
nekoEl.addEventListener('click', Petting);

// 4. Call the initial function to display the count when the page loads
document.addEventListener('DOMContentLoaded', getAndUpdateCounter); 





  function frame() {
    ++frameCount;
    const diffX = nekoPosX - mousePosX;
    const diffY = nekoPosY - mousePosY;
    const distance = Math.sqrt(diffX ** 2 + diffY ** 2);

    if(distance < NEKO_SPEED || distance < 128) {
      idle();
      return;
    }

    if(startMoving == 0) {
      if(distance != 0 && distance < START_MOVING_DISTANCE) {
        startMoving = 1;
      } else {
        idle();
        return;
      }

    }

    idleAnimation = null;
    idleAnimationFrame = 0;

    if(idleTime > 1) {
      frameSpeed = FRAME_SPEED_IDLE / 4;
      setSprite("alert", 0);

      // count down after being alerted before moving
      idleTime = Math.min(idleTime, 7);
      --idleTime;
      //frameSpeed = FRAME_SPEED_MOVING;
      return;
    }

    frameSpeed = FRAME_SPEED_MOVING;
    let direction;
    direction  = diffY / distance >  0.5 ? "N" : "";
    direction += diffY / distance < -0.5 ? "S" : "";
    direction += diffX / distance >  0.5 ? "W" : "";
    direction += diffX / distance < -0.5 ? "E" : "";
    setSprite(direction, frameCount);

    if(frameRate++ > FRAME_RATE) {
      frameRate = 0;

      nekoPosX -= (diffX / distance) * NEKO_SPEED;
      nekoPosY -= (diffY / distance) * NEKO_SPEED;

      updatePos();
    }
  }

function updatePos() {
  //if(nekoPosY > window.innerHeight) {  // Hide the cat if it is off-screen (Scroll mode)
  //  nekoEl.style.display = "none";
  //} else {
    nekoEl.style.display = "block";
    nekoEl.style.left = `${nekoPosX - 16}px`;
    nekoEl.style.top = `${nekoPosY - 16}px`;
  //}
}

  init();
})();