class World {
  gameLoopId;
  character;
  enemies;
  clouds;
  backgroundObjects;
  coins;
  bottles;
  camera_x = 0;
  level;
  statusBarEnergy = new StatusBar("energy", 10);
  statusBarCoins = new StatusBar("coins", 55);
  statusBarBottles = new StatusBar("bottles", 100);
  canvas;
  ctx;
  keyboard;
  throwableObjects = [new ThrowableObject()];
  lastAction = new Date().getTime();
  worldActions = new WorldActions();

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.character = new Character();
    this.checkLevel();
    this.objectsStartMoving();
    this.setWorld();
    this.run();
    setTimeout(() => this.draw(), 500);
  }

  /**
   * sets up correct level.
   */
  checkLevel() {
    if (currentLevel == 1) {
      this.getLevel1();
    } else {
      this.getLevel2();
    }
  }

  /**
   * saves all information necessary for level 1 into variables.
   */
  getLevel1() {
    this.level = level1;
    this.enemies = level1.enemies;
    this.clouds = level1.clouds;
    this.backgroundObjects = level1.backgroundObjects;
    this.coins = level1.coins;
    this.bottles = level1.bottles;
  }

  /**
   * saves all information necessary for level 2 into variables.
   */
  getLevel2() {
    this.level = level2;
    this.enemies = level2.enemies;
    this.clouds = level2.clouds;
    this.backgroundObjects = level2.backgroundObjects;
    this.coins = level2.coins;
    this.bottles = level2.bottles;
  }

  objectsStartMoving() {
    this.enemies.forEach((enemy) => {
      enemy.speed = enemy.walkingSpeed;
    });
    this.clouds.forEach((cloud) => {
      cloud.speed = 0.02;
    });
  }

  addStatusbarsToCanvas() {
    this.addToMap(this.statusBarEnergy);
    this.addToMap(this.statusBarCoins);
    this.addToMap(this.statusBarBottles);
  }

  /**
   * Links the character and each enemy to this world context for interactions.
   */
  setWorld() {
    this.character.world = this;
    this.worldActions.world = this;
  }

  /**
   * makes game Intervals start.
   */
  run() {
    setInterval(() => {
      this.worldActions.checkCollisions();
      this.checkThrowObjects();
      // this.worldActions.checkDistanceToEndboss();
      // this.isPepeSleeping();
    }, 1000 / 60);
  }

  checkThrowObjects() {
    if (this.keyboard.D) {
      let bottle = new ThrowableObject(this.character.x + 100, this.character.y + 100);
      this.throwableObject.push(bottle);
    }
  }

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
    this.addObjectsToMap(this.throwableObjects);

    this.ctx.translate(-this.camera_x, 0);

    let self = this; //draw wird immer wieder aufgerufen
    this.gameLoopId = requestAnimationFrame(function () {
      self.draw();
    });
  }

  /**
   * Iterates over the provided array of objects and calls `addToMap()` for each one, rendering them onto the canvas in sequence.
   * @param {object} objects - the provided array of objects.
   */
  addObjectsToMap(objects) {
    objects.forEach((object) => {
      this.addToMap(object);
    });
  }

  /**
   * Adds a single movable object to the canvas.
   * If the object is facing the opposite direction (otherDirection = true), its image is temporarily flipped horizontally before drawing.
   * After rendering the object, the image orientation is restored.
   * @param {object} mo - single movable object.
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
   * flips image horizontally.
   * @param {object} mo - single movable object.
   */
  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
  }

  /**
   * This method resets the object's horizontal position and restores the canvas context to its previous state.
   * @param {object} mo - single movable object.
   */
  flipImageBack(mo) {
    mo.x = mo.x * -1;
    this.ctx.restore();
  }
}