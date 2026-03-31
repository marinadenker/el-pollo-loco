let canvas;
let world;
let keyboard = new Keyboard();
let currentLevel = 1;
let gameResult = null;

function init() {
  document.getElementById("landingscreen").classList.add("d-none");
  document.getElementById("game-btns").classList.remove("d-none");
  document.getElementById("mobile-btns").classList.remove("d-none");

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

document.addEventListener("DOMContentLoaded", () => {
  /**
   * ontouchstart, the specific keyboard functions are set to true.
   */
  document
    .getElementById("move-left-btn")
    .addEventListener("touchstart", (e) => {
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
  document
    .getElementById("move-right-btn")
    .addEventListener("touchend", (e) => {
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
});

function toggleOverlay(overlayId, getContentFn) {
  const overlay = document.getElementById(overlayId);
  if (getContentFn) overlay.innerHTML = getContentFn();
  overlay.classList.toggle("d-none");
}

function restartGame() {
  gameResult = null;
  const wasMuted = world?.isMuted || false;
  exitGame();
  init();
  if (wasMuted) world.toggleSound();
  updateSoundBtn();
}

function updateSoundBtn() {
  const btn = document.getElementById("sound-btn");
  btn.innerHTML = world.isMuted
    ? '<img src="img/icons/volume_off.svg">'
    : '<img src="img/icons/volume_up.svg">';
}

function toggleSoundBtn() {
  world.toggleSound();
  updateSoundBtn();
}

function gameOver(result) {
  if (result === "lost") {
    showLostSequence();
  } else {
    showWonScreen();
  }
}

function showLostSequence() {
  const overlay = document.getElementById("game-result-overlay");
  overlay.innerHTML = getGameOverScreen();
  overlay.classList.remove("d-none");

  setTimeout(() => {
    exitGame();
    overlay.innerHTML = getYouLostScreen();
    overlay.classList.remove("d-none");
  }, 3000);
}

function showWonScreen() {
  const overlay = document.getElementById("game-result-overlay");
  setTimeout(() => {
    exitGame();
    overlay.innerHTML = getYouWonScreen();
    overlay.classList.remove("d-none");
  }, 3000);
}

function exitGame() {
  gameResult = null;
  world.cleanUp();
  world.backgroundMusic.pause();
  world.backgroundMusic.currentTime = 0;
  document.getElementById("game-result-overlay").classList.add("d-none");
  document.getElementById("landingscreen").classList.remove("d-none");
  document.getElementById("game-btns").classList.add("d-none");
  document.getElementById("mobile-btns").classList.add("d-none");
}

function startLevel(level) {
  currentLevel = level;
  restartGame();
}