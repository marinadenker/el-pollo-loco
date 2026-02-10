class Endboss extends MovableObject {
  height = 500;
  width = 429;
  y = -20;
  isAlive = true;
  speed = 0;
  emotionalStage = "walking";
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

  /**
   * Animates the endboss, so that it walks towards the game character and shows the emotional stage.
   */
  animate() {
    this.animateEmotionalStage();
    this.animation;
    setInterval(() => {
      this.moveLeft();
    }, 1000 / 60);
  }

  /**
   * Animates the endbosses emotional stage.
   */
  animateEmotionalStage() {
    if (this.animation) {
      clearInterval(this.animation);
    }
    if (this.emotionalStage == "walking") {
      this.endbossWalks;
    } else if (this.emotionalStage == "alert") {
      this.endbossAlerted();
    } else if (this.emotionalStage == "attack") {
      this.endbossAttacks();
    }
  }

  /**
   * Lets endboss walk to the left.
   */
  endbossWalks() {
    this.animation = setInterval(() => {
      this.playAnimation(this.IMAGES_WALKING);
    }, 300);
  }

  /**
   * Lets endboss be alert.
   */
  endbossAlerted() {
    this.animation = setInterval(() => {
      this.playAnimation(this.IMAGES_ALERT);
    }, 300);
  }

  /**
   * Lets endboss attack.
   */
  endbossAttacks() {
    this.animation = setInterval(() => {
      this.playAnimation(this.IMAGES_ATTACKING, 5);
    }, 250);
  }

  /**
   * Plays hurt-animation.
   */
  endbossIsHurt() {
    clearInterval(this.animation);
    this.animation = setInterval(() => {
      this.playAnimation(this.IMAGES_HURT);
    }, 300);
  }

  /**
   * Lets endboss be hit and animates endboss accordingly.
   * After one secons, endboss continues with the current emotional stage.
   */
  hit() {
    return new Promise((resolve) => {
      this.endbossIsHurt();
      setTimeout(() => {
        this.animateEmotionalStage();
      }, 1000);
      resolve();
    });
  }
}