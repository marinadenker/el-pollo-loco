class World {
  gameLoopId;
  character;
  enemies;
  clouds;
  backgroundObjects;
  coins;
  bottles;
  bottleNumber = 0;
  bottlesLeft = 0;
  camera_x = 0;
  level;
  statusBarEnergy = new StatusBar("energy", 10, 10);
  statusBarCoins = new StatusBar("coins", 55, 10);
  statusBarBottles = new StatusBar("bottles", 100, 10);
  statusBarEndboss = new StatusBar("endboss", 10, 550);
  canvas;
  ctx;
  keyboard;
  throwableObjects = [];
  lastAction = Date.now();
  worldActions = new WorldActions();
  endbossAlert = false;
  endbossAttacking = false;
  endbossRetreating = false;
  collectedCoins = 0;
  isPaused = false;

  earnedCoinAudio = new Audio("audio/coin.mp3");
  earnedBottleAudio = new Audio("audio/collect.mp3");
  hurtAudio = new Audio("audio/ouch.mp3");
  jumpAudio = new Audio("audio/jump.mp3");
  throwBottleAudio = new Audio("audio/throw.mp3");
  chickenDeadAudio = new Audio("audio/chicken.mp3");
  endbossAttacksAudio = new Audio("audio/endboss_attack.mp3");
  endbossDeadAudio = new Audio("audio/endboss_dead.mp3");
  snoringAudio = new Audio("audio/snoring.mp3");
  backgroundMusic = new Audio("audio/mixkit-summer-fun-13.mp3");
  lostAudio = new Audio("audio/lost.mp3");
  wonAudio = new Audio("audio/won.mp3");
  bossFightAudio = new Audio("audio/bossfight.mp3");


  /**
   * Initialises the game world: starts background music, sets up the canvas context,
   * loads the current level, creates the character, wires up world references,
   * starts object movement, and launches the game and draw loops.
   * @param {HTMLCanvasElement} canvas - The canvas element to render the game on.
   * @param {Keyboard} keyboard - The keyboard input handler instance.
   */
  constructor(canvas, keyboard) {
    this.isMuted = localStorage.getItem("isMuted") === "true";
    this.backgroundMusic.muted = this.isMuted;
    this.backgroundMusic.play();
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.checkLevel();
    this.character = new Character();
    this.setWorld();
    this.objectsStartMoving();
    this.run();
    this.draw();
    this.allAudios.forEach((audio) => (audio.muted = this.isMuted));
  }


  /**
   * Determines which level to load based on the global `currentLevel` variable
   * and delegates to {@link loadLevel}.
   */  
  checkLevel() {
    this.loadLevel(currentLevel == 1 ? level1 : level2);
  }


  /**
   * Loads a level into the world, populating enemies, clouds,
   * background objects, coins, and bottles from the level data.
   * @param {Level} level - The level object to load.
   */  
  loadLevel(level) {
    this.level = level;
    this.enemies = level.enemies;
    this.clouds = level.clouds;
    this.backgroundObjects = level.backgroundObjects;
    this.coins = level.coins;
    this.bottles = level.bottles;
  }


  /**
   * Sets initial movement speeds for all enemies and clouds in the level.
   * Each enemy uses its own `walkingSpeed`; clouds move at a fixed speed of 0.02.
   */  
  objectsStartMoving() {
    this.enemies.forEach((enemy) => {
      enemy.speed = enemy.walkingSpeed;
    });
    this.clouds.forEach((cloud) => {
      cloud.speed = 0.02;
    });
  }


  /**
   * Draws all four status bars (energy, coins, bottles, endboss) onto the canvas
   * in screen space (unaffected by camera translation).
   */  
  addStatusbarsToCanvas() {
    this.addToMap(this.statusBarEnergy);
    this.addToMap(this.statusBarCoins);
    this.addToMap(this.statusBarBottles);
    this.addToMap(this.statusBarEndboss);
  }


  /**
   * Injects the world reference into the character, `worldActions`,
   * and every enemy, enabling them to access shared game state.
   */  
  setWorld() {
    this.character.world = this;
    this.worldActions.world = this;
    this.enemies.forEach((enemy) => (enemy.world = this));
  }


  /**
   * Starts the two main game logic intervals:
   * - 60fps: collision detection, throw input, endboss state, and game-over check.
   * - 1000ms: checks whether the character should enter a sleep state.
   */  
run() {
  setInterval(() => {
    if (this.isPaused) return;
    this.worldActions.checkCollisions();
    this.worldActions.checkThrowObjects();
    this.worldActions.checkEndbossState();
    this.checkGameOver();
  }, 1000 / 60);

  setInterval(() => {
    if (this.isPaused) return;
    this.PepeIsSleeping();
  }, 1000);
}


  /**
   * The main render loop. Clears the canvas each frame, applies camera translation,
   * draws all game objects in layer order, and schedules the next frame via
   * `requestAnimationFrame`. Status bars are drawn in fixed screen space between translations.
   */  
  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.backgroundObjects, 0);

    this.ctx.translate(-this.camera_x, 0);
    // ---- Space for fixed objects ----
    this.addStatusbarsToCanvas();
    this.ctx.translate(this.camera_x, 0);

    this.addToMap(this.character);
    this.addObjectsToMap(this.clouds);
    this.addObjectsToMap(this.enemies);
    this.addObjectsToMap(this.bottles);
    this.addObjectsToMap(this.coins);
    this.addObjectsToMap(this.throwableObjects);

    this.ctx.translate(-this.camera_x, 0);

    let self = this;
    this.gameLoopId = requestAnimationFrame(function () {
      self.draw();
    });
  }


  /**
   * Iterates over an array of game objects and draws each one onto the canvas.
   * @param {MovableObject[]} objects - The objects to render.
   */  
  addObjectsToMap(objects) {
    objects.forEach((object) => {
      this.addToMap(object);
    });
  }


  /**
   * Draws a single game object onto the canvas.
   * Flips the canvas context horizontally if the object is facing left (`otherDirection`),
   * then restores it after drawing.
   * @param {MovableObject} mo - The game object to draw.
   */  
  addToMap(mo) {
    if (mo.otherDirection) {
      this.flipImage(mo);
    }
    mo.draw(this.ctx);
    if (mo.otherDirection) {
      this.flipImageBack(mo);
    }
  }


  /**
   * Flips the canvas context horizontally for left-facing sprites
   * by translating and scaling, and negates the object's x position
   * so it renders correctly under the transform.
   * @param {MovableObject} mo - The object to flip.
   */  
  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
  }


  /**
   * Restores the canvas context after a horizontal flip
   * by negating the object's x position back and calling `ctx.restore()`.
   * @param {MovableObject} mo - The object that was flipped.
   */  
  flipImageBack(mo) {
    mo.x = mo.x * -1;
    this.ctx.restore();
  }


  /**
   * Updates a status bar to reflect a new value.
   * @param {StatusBar} bar - The status bar to update.
   * @param {number} assets - The current value to display (e.g. energy, bottle count).
   * @param {string[]} images - The image set the status bar should use for rendering.
   */  
  updateStatusbar(bar, assets, images) {
    bar.setPercentage(assets, images);
  }


  /**
   * Records the current timestamp as the last player action,
   * resetting the inactivity timer.
   */  
  trackInactivity() {
    this.lastAction = Date.now();
  }


  /**
   * Checks how long the player has been inactive and updates the character's
   * sleep state accordingly:
   * - >15s inactive → sleeping (`isSleeping = true`)
   * - 5–15s inactive → snoozing (`isSnoozing = true`)
   * - <5s → fully awake (both flags false)
   */  
  PepeIsSleeping() {
    const inactiveSince = new Date().getTime() - this.lastAction;
    if (inactiveSince > 15000) {
      this.character.isSnoozing = false;
      this.character.isSleeping = true;
    } else if (inactiveSince > 5000) {
      this.character.isSnoozing = true;
      this.character.isSleeping = false;
    } else {
      this.character.isSnoozing = false;
      this.character.isSleeping = false;
    }
  }


  /**
   * Clears all active `setInterval` timers by brute-forcing IDs 1–9998.
   * Used during cleanup to stop all game loops regardless of their references.
   */  
  clearIntervals() {
    for (let i = 1; i < 9999; i++) window.clearInterval(i);
  }


  /**
   * Fully stops the game: clears all intervals, cancels the animation frame loop,
   * and wipes the canvas.
   */  
  cleanUp() {
    this.clearIntervals();
    cancelAnimationFrame(this.gameLoopId);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }


  /**
   * Checks win/loss conditions once per frame.
   * - Energy at 0% → player lost (ran out of health).
   * - All bottles used up, none left on the ground, none in flight, and endboss still alive → player lost (ran out of bottles).
   * - Endboss health at 0% → player won.
   * Does nothing if `gameResult` is already set (prevents double-triggering).
   */
  checkGameOver() {
    if (gameResult !== null) return;
    if (this.statusBarEnergy.percentage <= 0) {
      gameResult = "lost";
      reasonsForLoss = "You ran out of health!";
      this.showGameOverScreen("lost");
      } else if ( this.statusBarBottles.percentage <= 0 && this.level.bottles.length === 0 && this.throwableObjects.length === 0 && this.statusBarEndboss.percentage > 0) {
        gameResult = "lost";
        reasonsForLoss = "You ran out of bottles!";
        this.showGameOverScreen("lost");
      } else if (this.statusBarEndboss.percentage <= 0) {
        gameResult = "won";
        this.showGameOverScreen("won");
    }
  }


  /**
   * Sets the global `gameResult` and calls the external `gameOver()` function
   * to display the appropriate end screen.
   * @param {"won"|"lost"} result - The outcome to display.
   */  
  showGameOverScreen(result) {
    gameResult = result;
    this.backgroundMusic.pause();
    this.backgroundMusic.currentTime = 0;
    this.bossFightAudio.pause();
    this.bossFightAudio.currentTime = 0;
    if (result === "lost") {
      this.playSound(this.lostAudio);
    } else {
      this.playSound(this.wonAudio);
    }
    gameOver(result);
  }


  /**
   * Getter that returns all audio instances in the world as a flat array,
   * used for bulk operations like muting.
   * @returns {Audio[]} Every Audio object managed by the world.
   */  
  get allAudios() {
    return [
      this.earnedCoinAudio,
      this.earnedBottleAudio,
      this.hurtAudio,
      this.jumpAudio,
      this.throwBottleAudio,
      this.chickenDeadAudio,
      this.endbossDeadAudio,
      this.endbossAttacksAudio,
      this.snoringAudio,
      this.backgroundMusic,
      this.lostAudio,
      this.wonAudio,
      this.bossFightAudio,
    ];
  }


  /**
   * Toggles the mute state for all audio in the world.
   * Flips `this.isMuted` and applies it to every Audio instance via {@link allAudios}.
   */  
  toggleSound() {
    this.isMuted = !this.isMuted;
    this.allAudios.forEach((audio) => (audio.muted = this.isMuted));
    localStorage.setItem("isMuted", this.isMuted);
  }


  /**
   * Plays an audio clip, applying the current mute state before playing.
   * @param {Audio} audio - The audio instance to play.
   */  
  playSound(audio) {
    audio.muted = this.isMuted;
    audio.play();
  }
}