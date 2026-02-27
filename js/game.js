let canvas;
let world;
let keyboard = new Keyboard();
let currentLevel = 1;

function init() {
  if (currentLevel == 1) {
    initLevel1();
  } else {
    initLevel2();
  }
  canvas = document.getElementById("canvas");
  world = new World(canvas, keyboard);
}

/**
 * onkeydown, the keyboard functions are set to true.
 */
window.addEventListener("keydown", (event) => {
  if (event.keyCode == 39) {
    keyboard.RIGHT = true;
  }
  if (event.keyCode == 37) {
    keyboard.LEFT = true;
  }
  if (event.keyCode == 38) {
    keyboard.UP = true;
  }
  if (event.keyCode == 40) {
    keyboard.DOWN = true;
  }
  if (event.keyCode == 32) {
    keyboard.SPACE = true;
  }
  if (event.keyCode == 68 && !event.repeat) {
    keyboard.D = true;
  }
});

/**
 * onkeyup, the keyboard functions are set to false.
 */
window.addEventListener("keyup", (event) => {
  if (event.keyCode == 39) {
    keyboard.RIGHT = false;
  }
  if (event.keyCode == 37) {
    keyboard.LEFT = false;
  }
  if (event.keyCode == 38) {
    keyboard.UP = false;
  }
  if (event.keyCode == 40) {
    keyboard.DOWN = false;
  }
  if (event.keyCode == 32) {
    keyboard.SPACE = false;
  }
  if (event.keyCode == 68) {
    keyboard.D = false;
  }
});

/**
 * prevents default.
 */
function preventDefault(e) {
  if (e.cancelable) {
    e.preventDefault();
  }
}

/**
 * ontouchstart, the specific keyboard functions are set to true.
 */
document.getElementById("move-left-btn").addEventListener("touchstart", (e) => {
  preventDefault(e);
  keyboard.LEFT = true;
});

/**
 * ontouchend, the specific keyboard functions are set to false.
 */
document.getElementById("move-left-btn").addEventListener("touchend", (e) => {
  preventDefault(e);
  keyboard.LEFT = false;
});

/**
 * ontouchstart, the specific keyboard functions are set to true.
 */
document
  .getElementById("move-right-btn")
  .addEventListener("touchstart", (e) => {
    preventDefault(e);
    keyboard.RIGHT = true;
  });

/**
 * ontouchend, the specific keyboard functions are set to false.
 */
document.getElementById("move-right-btn").addEventListener("touchend", (e) => {
  preventDefault(e);
  keyboard.RIGHT = false;
});

/**
 * ontouchstart, the specific keyboard functions are set to true.
 */
document.getElementById("jump-btn").addEventListener("touchstart", (e) => {
  preventDefault(e);
  keyboard.UP = true;
});

/**
 * ontouchend, the specific keyboard functions are set to false.
 */
document.getElementById("jump-btn").addEventListener("touchend", (e) => {
  preventDefault(e);
  keyboard.UP = false;
});

/**
 * ontouchstart, the specific keyboard functions are set to true.
 */
document.getElementById("throw-btn").addEventListener("touchstart", (e) => {
  preventDefault(e);
  keyboard.D = true;
});

/**
 * ontouchend, the specific keyboard functions are set to false.
 */
document.getElementById("throw-btn").addEventListener("touchend", (e) => {
  preventDefault(e);
  keyboard.D = false;
});


function closeOverlay(overlayId) {
  document.getElementById(overlayId).classList.add("d-none");
}

function openExplanation() {
  const overlay = document.getElementById("game-explanation");
  overlay.innerHTML = getExplanationOverlay();
  overlay.classList.remove("d-none");
}

function openImprint() {
  const overlay = document.getElementById("imprint");
  overlay.innerHTML = getImprintOverlay();
  overlay.classList.remove("d-none");
}