let canvas;
let world;
let keyboard = new Keyboard();
let currentLevel = 1;


function init(){
    if (currentLevel == 1) {
      initLevel();
    } else {
      initLevel2();
    }
    canvas = document.getElementById('canvas');
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
  if (event.keyCode == 68  && !event.repeat) {
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