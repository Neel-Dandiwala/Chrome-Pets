let enabled = false;
let exit = false;

chrome.storage.onChanged.addListener((changes) => {
  if (changes.isEnabled && changes.isEnabled.newValue) {
    enabled = true;
    create();
    tick();
  }
  if (changes.isEnabled && !changes.isEnabled.newValue) {
    findExit();
  }
});

let x = -50;
let y = -50;
let desiredX = 0;
let desiredY = 0;
let canvasContainer = null;
let pageCanvas = null;
let idleCounter = 0;
const tempImage = new Image();
tempImage.src = chrome.runtime.getURL("/static/Sprite1.png");
const audio = new Audio(chrome.runtime.getURL("/static/penguin-sound.mp3"));
var ctx = null;
let spriteX = 0;
let spriteY = 0;
let staggerFrame = 9;
let spriteFrame = 0;
let idleFlag = true;
const edgeControl = 64;

function findExit() {
  var xDiff = bodyContainer.scrollWidth - x;
  var yDiff = bodyContainer.scrollHeight - y;
  if (xDiff < x && yDiff < y) {
    desiredX = xDiff < yDiff ? bodyContainer.scrollWidth + 100 : desiredX;
    desiredY = xDiff < yDiff ? desiredY : bodyContainer.scrollHeight + 100;
  } else if (xDiff < x && yDiff >= y) {
    desiredX = xDiff < y ? bodyContainer.scrollWidth + 100 : desiredY;
    desiredY = xDiff < y ? desiredY : -100;
  } else if (xDiff >= x && yDiff < y) {
    desiredX = x < yDiff ? -100 : desiredX;
    desiredY = x < yDiff ? desiredY : bodyContainer.scrollHeight + 100;
  } else if (xDiff >= x && yDiff >= y) {
    desiredX = x < y ? -100 : desiredX;
    desiredY = x < y ? desiredY : -100;
  }

  document.removeEventListener("dblclick", (event) => {
    desiredX = event.pageX;
    desiredY = event.pageY;
  });

  exit = true;
  chrome.storage.sync.set({ buttonDisabled: true });
}

function destroy() {
  if (ctx) ctx.clearRect(0, 0, 32, 32);
  document.body.removeChild(canvasContainer);
  x = -50;
  y = -50;
  desiredX = 0;
  desiredY = 0;
  canvasContainer = null;
  pageCanvas = null;
  idleCounter = 0;
  ctx = null;
  spriteX = 0;
  spriteY = 0;
  staggerFrame = 9;
  spriteFrame = 0;
  idleFlag = true;
}

function create() {
  if (pageCanvas === null) {
    if (canvasContainer === null) {
      canvasContainer = document.createElement("div");
      document.body.appendChild(canvasContainer);
      canvasContainer.style.position = "absolute";
      canvasContainer.style.left = x + "px";
      canvasContainer.style.top = y + "px";
      canvasContainer.style.width = "50px";
      canvasContainer.style.height = "50px";
      // canvasContainer.style.border = "1px solid red";
      canvasContainer.style.zIndex = "10000";
      canvasContainer.style.overflow = "hidden";
      bodyContainer = document.body;
    } else {
      bodyContainer = canvasContainer;
    }

    pageCanvas = document.createElement("canvas");
    // pageCanvas.style.width = bodyContainer.scrollWidth+"px";
    // pageCanvas.style.height = bodyContainer.scrollHeight+"px";
    pageCanvas.style.width = "100%";
    pageCanvas.style.height = "100%";
    pageCanvas.width = 32;
    pageCanvas.height = 32;
    // pageCanvas.width = bodyContainer.scrollWidth   * 0.1;
    // pageCanvas.height = bodyContainer.scrollHeight * 0.1;
    pageCanvas.style.overflow = "visible";
    pageCanvas.style.overflow = "absolute";

    ctx = pageCanvas.getContext("2d");

    tempImage.onload = function () {
      ctx.drawImage(
        tempImage,
        36 * spriteX + 2,
        36 * spriteY + 3,
        36,
        36,
        0,
        0,
        36,
        36
      );
    };

    canvasContainer.appendChild(pageCanvas);
  }

  pageCanvas.addEventListener("click", () => {
    if (ctx) {
      idleFlag = false;
      ctx.clearRect(0, 0, 32, 32);
      spriteX = 0;
      spriteY = 4;
      ctx.drawImage(
        tempImage,
        36 * spriteX + 2,
        36 * spriteY + 3,
        36,
        36,
        0,
        0,
        36,
        36
      );

      ctx.clearRect(0, 0, 32, 32);
      spriteX = 1;
      spriteY = 4;
      ctx.drawImage(
        tempImage,
        36 * spriteX + 2,
        36 * spriteY + 3,
        36,
        36,
        0,
        0,
        36,
        36
      );
      audio.play();

      setTimeout(function () {
        ctx.clearRect(0, 0, 32, 32);
        spriteX = 2;
        spriteY = 4;
        ctx.drawImage(
          tempImage,
          36 * spriteX + 2,
          36 * spriteY + 3,
          36,
          36,
          0,
          0,
          36,
          36
        );
      }, 1000);
    }
    idleFlag = true;
  });

  document.addEventListener("dblclick", (event) => {
    desiredX = event.pageX;
    desiredY = event.pageY;
  });
}

function moveCanvas() {
  // x = (x == desiredX) ? desiredX : ((x < desiredX) ? x+1 : x-1);
  if (x !== desiredX) {
    if (x < desiredX) {
      spriteY = 0;
      if (y === desiredY) {
        x++;
        if (x < desiredX - 10 || x > desiredX + 10) {
          x++;
        }
        animate(0, 3);
      }
    } else {
      spriteY = 3;
      if (y === desiredY) {
        x--;
        if (x < desiredX - 10 || x > desiredX + 10) {
          x--;
        }
        animate(0, 3);
      }
    }
  }
  // y = (y == desiredY) ? desiredY : ((y < desiredY) ? y+1 : y-1);
  if (y !== desiredY) {
    if (y < desiredY) {
      y++;
      if (y < desiredY - 10 || y > desiredY + 10) {
        y++;
      }
      spriteY = 1;
      animate(0, 3);
    } else {
      y--;
      if (y < desiredY - 10 || y > desiredY + 10) {
        y--;
      }
      spriteY = 2;
      animate(0, 3);
    }
  }

  if (idleCounter === 1) {
    ctx.clearRect(0, 0, 32, 32);
    spriteX = 2;
    spriteY = 4;
    ctx.drawImage(
      tempImage,
      36 * spriteX + 2,
      36 * spriteY + 3,
      36,
      36,
      0,
      0,
      36,
      36
    );
  }

  if (idleFlag == true && desiredX === x && desiredY === y) {
    idleCounter += 1;
    if (idleCounter === 100) {
      ctx.clearRect(0, 0, 32, 32);
      spriteX = 3;
      spriteY = 4;
      ctx.drawImage(
        tempImage,
        36 * spriteX + 2,
        36 * spriteY + 3,
        36,
        36,
        0,
        0,
        36,
        36
      );
    }
    if (idleCounter === 1900) {
      ctx.clearRect(0, 0, 32, 32);
      spriteX = 2;
      spriteY = 4;
      ctx.drawImage(
        tempImage,
        36 * spriteX + 2,
        36 * spriteY + 3,
        36,
        36,
        0,
        0,
        36,
        36
      );
    }
    if (idleCounter === 2000) {
      desiredX = Math.floor(
        Math.random() * (bodyContainer.scrollWidth - edgeControl)
      );
      desiredY = Math.floor(
        Math.random() * (bodyContainer.scrollHeight - edgeControl)
      );
    }
  } else {
    idleCounter = 0;
    staggerFrame = 11;
  }

  desiredX =
    bodyContainer.scrollWidth - edgeControl < desiredX
      ? bodyContainer.scrollWidth - edgeControl
      : desiredX;
  desiredY =
    bodyContainer.scrollHeight - edgeControl < desiredY
      ? bodyContainer.scrollHeight - edgeControl
      : desiredY;
  canvasContainer.style.left = x + "px";
  canvasContainer.style.top = y + "px";
}

function animate(start, finish) {
  if (ctx) {
    if (spriteFrame % staggerFrame === 0) {
      ctx.clearRect(0, 0, 32, 32);
      spriteX = spriteX == finish ? start : spriteX + 1;
      ctx.drawImage(
        tempImage,
        36 * spriteX + 2,
        36 * spriteY + 3,
        36,
        36,
        0,
        0,
        36,
        36
      );
    }
    spriteFrame++;
  }
}

const tick = () => {
  moveCanvas();
  if (
    x > bodyContainer.scrollWidth ||
    x < -50 ||
    y < -50 ||
    y > bodyContainer.scrollHeight
  ) {
    enabled = false;
    exit = false;
    chrome.storage.sync.set({ buttonDisabled: false });
    destroy();
  }
  if (enabled) {
    window.requestAnimationFrame(tick);
  }
};
