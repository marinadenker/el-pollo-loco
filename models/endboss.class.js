class Endboss extends MovableObject {
  height = 500;
  width = 429;
  y = -20;
  isAlive = true;
  speed = 0;
  currentState = "walking";
  energy = 100;
  animation;
  walkingSpeed = 0.15;
  number = -1;
  isHitting = false;

  offset = {
    top: 100,
    left: 45,
    right: 20,
    bottom: 45,
  };

  IMAGES_WALKING = [
    "img/4_enemie_boss_chicken/1_walk/G1.png",
    "img/4_enemie_boss_chicken/1_walk/G2.png",
    "img/4_enemie_boss_chicken/1_walk/G3.png",
    "img/4_enemie_boss_chicken/1_walk/G4.png",
  ];

  IMAGES_ALERT = [
    "img/4_enemie_boss_chicken/2_alert/G5.png",
    "img/4_enemie_boss_chicken/2_alert/G6.png",
    "img/4_enemie_boss_chicken/2_alert/G7.png",
    "img/4_enemie_boss_chicken/2_alert/G8.png",
    "img/4_enemie_boss_chicken/2_alert/G9.png",
    "img/4_enemie_boss_chicken/2_alert/G10.png",
    "img/4_enemie_boss_chicken/2_alert/G11.png",
    "img/4_enemie_boss_chicken/2_alert/G12.png",
  ];

  IMAGES_ATTACKING = [
    "img/4_enemie_boss_chicken/3_attack/G13.png",
    "img/4_enemie_boss_chicken/3_attack/G14.png",
    "img/4_enemie_boss_chicken/3_attack/G15.png",
    "img/4_enemie_boss_chicken/3_attack/G16.png",
    "img/4_enemie_boss_chicken/3_attack/G17.png",
    "img/4_enemie_boss_chicken/3_attack/G18.png",
    "img/4_enemie_boss_chicken/3_attack/G19.png",
    "img/4_enemie_boss_chicken/3_attack/G20.png",
  ];

  IMAGES_HURT = [
    "img/4_enemie_boss_chicken/4_hurt/G21.png",
    "img/4_enemie_boss_chicken/4_hurt/G22.png",
    "img/4_enemie_boss_chicken/4_hurt/G23.png",
  ];

  IMAGES_DYING = [
    "img/4_enemie_boss_chicken/4_hurt/G21.png",
    "img/4_enemie_boss_chicken/4_hurt/G22.png",
    "img/4_enemie_boss_chicken/4_hurt/G23.png",
    "img/4_enemie_boss_chicken/5_dead/G24.png",
    "img/4_enemie_boss_chicken/5_dead/G25.png",
    "img/4_enemie_boss_chicken/5_dead/G26.png",
  ];

  IMAGES_DEAD = ["img/4_enemie_boss_chicken/5_dead/G26.png"];

  currentImage = 0;

  /**
   * Represents the endboss.
   * @constructor
   */
  constructor() {
    super();
    this.loadImage(this.IMAGES_WALKING[0]);
    this.x = 2450;
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_ALERT);
    this.loadImages(this.IMAGES_ATTACKING);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DYING);
    this.loadImages(this.IMAGES_DEAD);
    if (this.isAlive) {
      this.animate();
    }
  }

  animate() {
    this.animateCurrentState();
    setInterval(() => {
      if (this.speed < 0) {
        this.moveBack();
      } else {
        this.moveLeft();
        this.otherDirection = false;
      }
    }, 1000 / 60);
  }

  changeState(newState) {
    if (this.currentState === newState) return;
    this.currentState = newState;
    this.animateCurrentState();
  }

  animateCurrentState() {
    if (this.animation) {
      clearInterval(this.animation);
    }
    if (this.currentState == "walking") {
      this.endbossWalks();
    } else if (this.currentState == "alert") {
      this.endbossAlerted();
    } else if (this.currentState == "attack") {
      this.endbossAttacks();
    } else if (this.currentState == "hurt") {
      this.endbossHurt();
    } else if (this.currentState == "dead") {
    }
  }

  endbossWalks() {
    this.animation = setInterval(() => {
      this.playAnimation(this.IMAGES_WALKING);
    }, 300);
  }

  endbossAlerted() {
    this.animation = setInterval(() => {
      this.playAnimation(this.IMAGES_ALERT);
    }, 300);
  }

  endbossAttacks() {
    this.animation = setInterval(() => {
      this.playAnimation(this.IMAGES_ATTACKING, 5);
    }, 250);
  }

  endbossIsHurt() {
    clearInterval(this.animation);
    this.animation = setInterval(() => {
      this.playAnimation(this.IMAGES_HURT);
    }, 300);
  }

  hit() {
    return new Promise((resolve) => {
      this.energy -= 20;
      if (this.energy < 0) this.energy = 0;
      this.lastHit = new Date().getTime();
      this.currentState = "hurt";
      this.endbossIsHurt();
      setTimeout(() => {
        if (this.currentState !== "dead") {
          this.currentState = "walking";
          this.animateCurrentState();
        }
      }, 1000);
      resolve();
    });
  }
}