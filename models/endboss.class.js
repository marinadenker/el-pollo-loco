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
   * Creates the endboss at x=2450, loads all animation image sets,
   * and starts the animation loop if alive.
   */
  constructor(difficulty = "normal") {
    super();
    this.loadImage(this.IMAGES_WALKING[0]);
    this.x = 2450;
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_ALERT);
    this.loadImages(this.IMAGES_ATTACKING);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DYING);
    this.loadImages(this.IMAGES_DEAD);
    if (difficulty === "easy") {
      this.energy = 60;
      this.walkingSpeed = 0.1;
    }
    if (this.isAlive) {
      this.animate();
    }
  }

  /**
   * Starts the endboss movement and animation loops.
   * - Runs the current state animation immediately.
   * - 60fps interval: moves left normally, or retreats (`moveBack`) when `speed` is negative.
   */  
animate() {
  this.animateCurrentState();
  setInterval(() => {
    if (this.speed < 0) {
      this.moveBack();
      this.otherDirection = true; 
    } else if (this.speed > 0) {
      this.moveLeft();
      this.otherDirection = false;
    }
  }, 1000 / 60);
}

  /**
   * Transitions the endboss to a new state and restarts the animation.
   * Does nothing if the endboss is already in the requested state.
   * @param {"walking"|"alert"|"attack"|"hurt"|"dead"} newState - The state to transition to.
   */  
  changeState(newState) {
    if (this.currentState === newState) return;
    this.currentState = newState;
    this.animateCurrentState();
  }

  /**
   * Clears the current animation interval and starts the correct one
   * for `currentState`. The "dead" state intentionally runs no animation
   * (handled externally by {@link WorldActions#killEndboss}).
   */  
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

  /**
   * Starts the walking animation loop at 300ms per frame.
   */  
  endbossWalks() {
    this.animation = setInterval(() => {
      this.playAnimation(this.IMAGES_WALKING);
    }, 300);
  }

  /**
   * Starts the alert animation loop at 300ms per frame.
   */  
  endbossAlerted() {
    this.animation = setInterval(() => {
      this.playAnimation(this.IMAGES_ALERT);
    }, 300);
  }

  /**
   * Starts the attack animation loop at 250ms per frame with a `frameSpeed` of 5
   * for a faster, more aggressive look.
   */  
  endbossAttacks() {
    this.animation = setInterval(() => {
      this.playAnimation(this.IMAGES_ATTACKING, 5);
    }, 250);
  }

  /**
   * Immediately stops the current animation and starts the hurt animation loop.
   * Called directly (bypassing `changeState`) so it interrupts any ongoing state.
   */  
  endbossIsHurt() {
    clearInterval(this.animation);
    this.animation = setInterval(() => {
      this.playAnimation(this.IMAGES_HURT);
    }, 300);
  }

  /**
   * Reduces energy by 20, clamps to 0, records the hit timestamp,
   * and switches to the hurt state. After 1 second, transitions back to
   * walking — unless the endboss has since died.
   * @returns {Promise<void>} Resolves immediately after setup; the state reset is async.
   */  
  hit() {
    return new Promise((resolve) => {
      this.energy -= 20;
      if (this.energy < 0) {
      this.energy = 0;
      }
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