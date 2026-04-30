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
  lastAction = new Date().getTime();
  worldActions = new WorldActions();
  endbossAlert = false;
  endbossAttacking = false;
  collectedCoins = 0;

  earnedCoinAudio = new Audio("audio/coin.mp3");
  earnedBottleAudio = new Audio("audio/collect.mp3");
  hurtAudio = new Audio("audio/ouch.mp3");
  jumpAudio = new Audio("audio/jump.mp3");
  throwBottleAudio = new Audio("audio/throw.mp3");
  bottleHitAudio = new Audio();
  chickenDeadAudio = new Audio("audio/chicken.mp3");
  endbossAttacksAudio = new Audio("audio/endboss_attack.mp3");
  endbossDeadAudio = new Audio("audio/endboss_dead.mp3");
  snoringAudio = new Audio("audio/snoring.mp3");
  backgroundMusic = new Audio("audio/mixkit-summer-fun-13.mp3");

  constructor(canvas, keyboard) {
    this.backgroundMusic.play();
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.checkLevel();
    this.character = new Character();
    this.setWorld();
    this.objectsStartMoving();
    this.run();
    setTimeout(() => this.draw(), 500);
  }

  checkLevel() {
    if (currentLevel == 1) {
      this.getLevel1();
    } else {
      this.getLevel2();
    }
  }

  getLevel1() {
    this.level = level1;
    this.enemies = level1.enemies;
    this.clouds = level1.clouds;
    this.backgroundObjects = level1.backgroundObjects;
    this.coins = level1.coins;
    this.bottles = level1.bottles;
  }

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
    this.addToMap(this.statusBarEndboss);
  }

  setWorld() {
    this.character.world = this;
    this.worldActions.world = this;
    this.enemies.forEach((enemy) => (enemy.world = this));
  }

  run() {
    setInterval(() => {
      this.worldActions.checkCollisions();
      this.worldActions.checkThrowObjects();
      this.worldActions.checkEndbossState();
      this.checkGameOver();
    }, 1000 / 60);

    setInterval(() => {
      this.PepeIsSleeping();
    }, 1000);
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
    this.addObjectsToMap(this.coins);
    this.addObjectsToMap(this.throwableObjects);

    this.ctx.translate(-this.camera_x, 0);

    let self = this;
    this.gameLoopId = requestAnimationFrame(function () {
      self.draw();
    });
  }

  addObjectsToMap(objects) {
    objects.forEach((object) => {
      this.addToMap(object);
    });
  }

  addToMap(mo) {
    if (mo.otherDirection) {
      this.flipImage(mo);
    }
    mo.draw(this.ctx);
    if (mo.otherDirection) {
      this.flipImageBack(mo);
    }
  }

  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
  }

  flipImageBack(mo) {
    mo.x = mo.x * -1;
    this.ctx.restore();
  }

  updateStatusbar(bar, assets, images) {
    bar.setPercentage(assets, images);
  }

  trackInactivity() {
    this.lastAction = new Date().getTime();
  }

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

  clearIntervals() {
    for (let i = 1; i < 9999; i++) window.clearInterval(i);
  }

  cleanUp() {
    this.clearIntervals();
    cancelAnimationFrame(this.gameLoopId);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  checkGameOver() {
    if (gameResult !== null) return;

    if (this.statusBarEnergy.percentage <= 0) {
      gameResult = "lost";
      this.showGameOverScreen("lost");
    } else if (this.statusBarEndboss.percentage <= 0) {
      gameResult = "won";
      this.showGameOverScreen("won");
    }
  }

  showGameOverScreen(result) {
    gameResult = result;
    gameOver(result);
  }

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
      this.endbossDeadAudio,
      this.snoringAudio,
      this.backgroundMusic,
    ];
  }

  toggleSound() {
    this.isMuted = !this.isMuted;
    this.allAudios.forEach((audio) => (audio.muted = this.isMuted));
  }

  playSound(audio) {
    audio.muted = this.isMuted;
    audio.play();
  }
}