class Character extends MovableObject {
  x = 100;
  y = 80;
  speed = 5;
  speedY = 0;
  acceleration = 2.5;
  isSleeping = false;
  isSnoozing = false;
  isFalling = false;

  offset = {
    top: 95,
    left: 20,
    right: 30,
    bottom: 10,
  };

  IMAGES_WALKING = [
    "img/2_character_pepe/2_walk/W-21.png",
    "img/2_character_pepe/2_walk/W-22.png",
    "img/2_character_pepe/2_walk/W-23.png",
    "img/2_character_pepe/2_walk/W-24.png",
    "img/2_character_pepe/2_walk/W-25.png",
    "img/2_character_pepe/2_walk/W-26.png",
  ];

  IMAGES_JUMPING = [
    "img/2_character_pepe/3_jump/J-31.png",
    "img/2_character_pepe/3_jump/J-32.png",
    "img/2_character_pepe/3_jump/J-33.png",
    "img/2_character_pepe/3_jump/J-34.png",
    "img/2_character_pepe/3_jump/J-35.png",
    "img/2_character_pepe/3_jump/J-36.png",
    "img/2_character_pepe/3_jump/J-37.png",
  ];

  IMAGES_LANDING = [
    "img/2_character_pepe/3_jump/J-38.png",
    "img/2_character_pepe/3_jump/J-39.png",
  ];

  IMAGES_FRIGHTENED = [
    "img/2_character_pepe/3_jump/J-31.png",
    "img/2_character_pepe/3_jump/J-32.png",
    "img/2_character_pepe/3_jump/J-38.png",
    "img/2_character_pepe/3_jump/J-39.png",
  ];

  IMAGES_HURT = [
    "img/2_character_pepe/4_hurt/H-41.png",
    "img/2_character_pepe/4_hurt/H-42.png",
    "img/2_character_pepe/4_hurt/H-43.png",
  ];

  IMAGES_DEAD = [
    "img/2_character_pepe/5_dead/D-51.png",
    "img/2_character_pepe/5_dead/D-52.png",
    "img/2_character_pepe/5_dead/D-53.png",
    "img/2_character_pepe/5_dead/D-54.png",
    "img/2_character_pepe/5_dead/D-55.png",
    "img/2_character_pepe/5_dead/D-56.png",
    "img/2_character_pepe/5_dead/D-57.png",
  ];

  IMAGES_IDLE = [
    "img/2_character_pepe/1_idle/idle/I-1.png",
    "img/2_character_pepe/1_idle/idle/I-2.png",
    "img/2_character_pepe/1_idle/idle/I-3.png",
    "img/2_character_pepe/1_idle/idle/I-4.png",
    "img/2_character_pepe/1_idle/idle/I-5.png",
    "img/2_character_pepe/1_idle/idle/I-6.png",
    "img/2_character_pepe/1_idle/idle/I-7.png",
    "img/2_character_pepe/1_idle/idle/I-8.png",
    "img/2_character_pepe/1_idle/idle/I-9.png",
    "img/2_character_pepe/1_idle/idle/I-10.png",
  ];

  IMAGES_LONG_IDLE = [
    "img/2_character_pepe/1_idle/long_idle/I-11.png",
    "img/2_character_pepe/1_idle/long_idle/I-12.png",
    "img/2_character_pepe/1_idle/long_idle/I-13.png",
    "img/2_character_pepe/1_idle/long_idle/I-14.png",
    "img/2_character_pepe/1_idle/long_idle/I-15.png",
    "img/2_character_pepe/1_idle/long_idle/I-16.png",
    "img/2_character_pepe/1_idle/long_idle/I-17.png",
    "img/2_character_pepe/1_idle/long_idle/I-18.png",
    "img/2_character_pepe/1_idle/long_idle/I-19.png",
    "img/2_character_pepe/1_idle/long_idle/I-20.png",
  ];

  world;
  sound;
  currentImage = 0;

  /**
   * Creates a new Character instance, loads all animation images,
   * applies gravity, and starts the animation loops.
   * @param {SoundManager} sound - The sound manager used to play character audio.
   */
  constructor(sound) {
    super();
    this.loadImage("img/2_character_pepe/2_walk/W-21.png");
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_JUMPING);
    this.loadImages(this.IMAGES_LANDING);
    this.loadImages(this.IMAGES_FRIGHTENED);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGES_IDLE);
    this.loadImages(this.IMAGES_LONG_IDLE);
    this.width = 120;
    this.height = 220;
    this.applyGravity();
    this.animate();
    this.sound = sound;
  }

  /**
   * Starts all animation and movement interval loops for the character.
   * - 60fps loop: handles directional movement and camera.
   * - 300ms loop: handles above-ground jump animation.
   * - 1000ms loop: handles idle/sleep states and death.
   * - 100ms loop: handles in-action animations (walking, hurt).
   */
  animate() {
    setInterval(() => {
      if (!this.world) return;
      this.checkDirection();
      this.world.camera_x = Math.max(-this.world.level.level_end_x, -this.x + 100,);
      this.ifPepeIsFalling();
    }, 1000 / 60);

    setInterval(() => {
      if (!this.world) return;
      this.ifPepeIsAboveGround();
    }, 300);

    setInterval(() => {
      if (!this.world) return;
      this.ifPepeIsInactive();
    }, 1000);

    setInterval(() => {
      if (!this.world) return;
      this.ifPepeIsInAction();
    }, 100);
  }

  /**
   * Checks and processes directional input each frame,
   * delegating to walk and jump handlers.
   */
  checkDirection() {
    this.ifPepeIsWalkingRight();
    this.ifPepeIsWalkingLeft();
    this.ifPepeIsJumping();
  }

  /**
   * Updates the character's sprite while falling, based on vertical speed thresholds.
   * Plays landing or idle frames depending on how fast Pepe is descending.
   */
  ifPepeIsFalling() {
    if (this.isAboveGround()) {
      if (this.speedY < 0 && this.speedY > -20) {
        this.img = this.imageCache["img/2_character_pepe/3_jump/J-37.png"];
      }
      if (this.speedY < -20 && this.speedY > -28) {
        this.playAnimation(this.IMAGES_LANDING);
      }
      if (this.speedY < -28) {
        this.playAnimation(this.IMAGES_IDLE);
      }
    }
  }


  /**
   * Moves Pepe to the right if the RIGHT key is held and the level boundary allows it.
   * Resets the facing direction and resets the inactivity timer.
   */
  ifPepeIsWalkingRight() {
    if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
      this.moveRight();
      this.otherDirection = false;
      this.direction = true;
      this.world.trackInactivity();
    }
  }


  /**
   * Moves Pepe to the left if the LEFT key is held and the position is within bounds.
   * Sets the facing direction flag and resets the inactivity timer.
   */
  ifPepeIsWalkingLeft() {
    if (this.world.keyboard.LEFT && this.x > 0) {
      this.moveLeft();
      this.otherDirection = true;
      this.direction = false;
      this.world.trackInactivity();
    }
  }


  /**
   * Makes Pepe jump if SPACE or UP is pressed and he is not already airborne.
   * Resets the inactivity timer on jump.
   */
  ifPepeIsJumping() {
    if (
      (this.world.keyboard.SPACE && !this.isAboveGround()) || (this.world.keyboard.UP && !this.isAboveGround())) {
      this.jump();
      this.world.trackInactivity();
    }
  }


  /**
   * Plays the jumping animation while Pepe is above ground and moving upward.
   * Called on a 300ms interval.
   */
  ifPepeIsAboveGround() {
    if (this.isAboveGround() && this.speedY > 0) {
      this.playAnimation(this.IMAGES_JUMPING);
    }
  }


  /**
   * Handles animation for inactive states: death, snoozing, and sleeping.
   * Called on a 1000ms interval.
   */ 
  ifPepeIsInactive() {
    if (this.isDead()) {
      this.ifPepeIsDead();
    } else if (this.isSnoozing && !this.isAboveGround()) {
      this.playAnimation(this.IMAGES_IDLE);
    } else if (this.isSleeping) {
      this.playSleepingAnimation();
    } else if (!this.isAboveGround() && Date.now() > this.world.lastAction) {
      this.playAnimation(this.IMAGES_IDLE);
    }
  }


  /**
   * Plays the long idle (sleeping) animation sequence.
   */
  playSleepingAnimation() {
    this.playAnimation(this.IMAGES_LONG_IDLE);
    this.world.playSound(this.world.snoringAudio);
  }


  /**
   * Handles animation while Pepe is actively doing something (hurt or walking).
   * Skips if Pepe is currently sleeping or snoozing.
   * Called on a 100ms interval.
   */
  ifPepeIsInAction() {
    if (this.isSleeping || this.isSnoozing) return;
    if (this.isHurt() && !this.isAboveGround()) {
      this.playAnimation(this.IMAGES_HURT);
    } else {
      this.ifPepeIsWalking();
    }
  }


  /**
   * Plays the walking animation if the LEFT or RIGHT key is currently pressed.
   */  
  ifPepeIsWalking() {
    if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
      this.playAnimation(this.IMAGES_WALKING);
    }
  }


  /**
   * Triggers the death sequence: plays the death animation, makes Pepe fall off-screen,
   * and shows the game-over screen after a short delay.
   */  
  ifPepeIsDead() {
    this.playAnimation(this.IMAGES_DEAD);
    const fallInterval = setInterval(() => {
      this.y += 10;
    }, 50);
    setTimeout(() => {
      clearInterval(fallInterval);
      this.world.showGameOverScreen("lost");
    }, 1000);
  }


  /**
   * Reduces the character's energy by 10 on each hit.
   * Clamps energy to a minimum of 0 and records the timestamp of the last hit.
   */  
  hit() {
    this.energy -= 10;
    if (this.energy < 0) this.energy = 0;
    else this.lastHit = new Date().getTime();
  }
}