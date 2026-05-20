let canvas;
let world;
let keyboard = new Keyboard();
let currentLevel = 1;
let gameResult = null;

/**
 * Initializes the game by hiding the landing screen, showing the UI controls,
 * loading the appropriate level, and creating a new World instance.
 */
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
 * On keydown, the corresponding keyboard flag is set to true.
 */
window.addEventListener("keydown", (event) => {
  if (event.code === "ArrowRight") keyboard.RIGHT = true;
  if (event.code === "ArrowLeft") keyboard.LEFT = true;
  if (event.code === "ArrowUp") keyboard.UP = true;
  if (event.code === "ArrowDown") keyboard.DOWN = true;
  if (event.code === "Space") keyboard.SPACE = true;
  if (event.code === "KeyD" && !event.repeat) keyboard.D = true;
});


/**
 * On keyup, the corresponding keyboard flag is set to false.
 */
window.addEventListener("keyup", (event) => {
  if (event.code === "ArrowRight") keyboard.RIGHT = false;
  if (event.code === "ArrowLeft") keyboard.LEFT = false;
  if (event.code === "ArrowUp") keyboard.UP = false;
  if (event.code === "ArrowDown") keyboard.DOWN = false;
  if (event.code === "Space") keyboard.SPACE = false;
  if (event.code === "KeyD") keyboard.D = false;
});


/**
 * Prevents the default browser behavior for an event, but only if the event
 * is cancelable. Used to suppress scrolling during touch interactions.
 * @param {Event} e - The event to suppress.
 */
function preventDefault(e) {
  if (e.cancelable) {
    e.preventDefault();
  }
}


document.addEventListener("DOMContentLoaded", () => {
  /**
   * On touchstart on the left button, sets the LEFT keyboard flag to true.
   */
  document
    .getElementById("move-left-btn")
    .addEventListener("touchstart", (e) => {
      preventDefault(e);
      keyboard.LEFT = true;
    });


  /**
   * On touchend on the left button, sets the LEFT keyboard flag to false.
   */
  document.getElementById("move-left-btn").addEventListener("touchend", (e) => {
    preventDefault(e);
    keyboard.LEFT = false;
  });


  /**
   * On touchstart on the right button, sets the RIGHT keyboard flag to true.
   */
  document
    .getElementById("move-right-btn")
    .addEventListener("touchstart", (e) => {
      preventDefault(e);
      keyboard.RIGHT = true;
    });


  /**
   * On touchend on the right button, sets the RIGHT keyboard flag to false.
   */
  document
    .getElementById("move-right-btn")
    .addEventListener("touchend", (e) => {
      preventDefault(e);
      keyboard.RIGHT = false;
    });


  /**
   * On touchstart on the jump button, sets the UP keyboard flag to true.
   */
  document.getElementById("jump-btn").addEventListener("touchstart", (e) => {
    preventDefault(e);
    keyboard.UP = true;
  });


  /**
   * On touchend on the jump button, sets the UP keyboard flag to false.
   */
  document.getElementById("jump-btn").addEventListener("touchend", (e) => {
    preventDefault(e);
    keyboard.UP = false;
  });


  /**
   * On touchstart on the throw button, sets the D keyboard flag to true.
   */
  document.getElementById("throw-btn").addEventListener("touchstart", (e) => {
    preventDefault(e);
    keyboard.D = true;
  });


  /**
   * On touchend on the throw button, sets the D keyboard flag to false.
   */
  document.getElementById("throw-btn").addEventListener("touchend", (e) => {
    preventDefault(e);
    keyboard.D = false;
  });
});


/**
 * Toggles the visibility of an overlay element. Optionally sets its inner HTML
 * using a content-generating function before toggling.
 * @param {string} overlayId - The ID of the overlay element to toggle.
 * @param {Function} [getContentFn] - Optional function that returns an HTML string
 *   to inject into the overlay before toggling.
 */
function toggleOverlay(overlayId, getContentFn) {
  const overlay = document.getElementById(overlayId);
  if (getContentFn) overlay.innerHTML = getContentFn();
  overlay.classList.toggle("d-none");
}


/**
 * Restarts the game from scratch. Preserves the current mute state,
 * cleans up the existing world, re-initializes the game, and re-applies
 * the mute setting and sound button UI.
 */
function restartGame() {
  gameResult = null;
  const wasMuted = world?.isMuted || false;
  exitGame();
  init();
  if (wasMuted) world.toggleSound();
  updateSoundBtn();
}


/**
 * Updates the sound toggle button icon to reflect the current mute state.
 * Shows a volume_off icon when muted, and volume_up when unmuted.
 */
function updateSoundBtn() {
  const btn = document.getElementById("sound-btn");
  btn.innerHTML = world.isMuted
    ? '<img src="img/icons/volume_off.svg">'
    : '<img src="img/icons/volume_up.svg">';
}


/**
 * Toggles the game sound on or off and updates the sound button icon accordingly.
 */
function toggleSoundBtn() {
  world.toggleSound();
  updateSoundBtn();
}


/**
 * Handles the end of the game by triggering either the loss or win sequence
 * depending on the result.
 * @param {"lost"|"won"} result - The outcome of the game.
 */
function gameOver(result) {
  if (result === "lost") {
    showLostSequence();
  } else {
    showWonScreen();
  }
}


/**
 * Shows the game-over screen immediately, then after a 3-second delay
 * exits the game and displays the "You Lost" screen.
 */
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


/**
 * After a 3-second delay, exits the game and displays the "You Won" screen.
 */
function showWonScreen() {
  const overlay = document.getElementById("game-result-overlay");
  setTimeout(() => {
    exitGame();
    overlay.innerHTML = getYouWonScreen();
    overlay.classList.remove("d-none");
  }, 3000);
}


/**
 * Cleans up the current game session: resets the game result, stops and resets
 * the background music, cleans up the world, and restores the landing screen UI.
 */
function exitGame() {
  gameResult = null;
  currentLevel = 1;
  world.cleanUp();
  world.backgroundMusic.pause();
  world.backgroundMusic.currentTime = 0;
  document.getElementById("game-result-overlay").classList.add("d-none");
  document.getElementById("landingscreen").classList.remove("d-none");
  document.getElementById("game-btns").classList.add("d-none");
  document.getElementById("mobile-btns").classList.add("d-none");
}


/**
 * Sets the current level and restarts the game to load that level.
 * @param {number} level - The level number to start (e.g. 1 or 2).
 */
function startLevel(level) {
  currentLevel = level;
  restartGame();
}