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
   * Represents a bottle
   * @constructor
   * @param {boolean} sound - Informs whether the sound is on or off.
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
    this.applyGravity();
    this.animate();
    this.width = 120;
    this.height = 220;
    this.sound = sound;
  }


  /**
   * Animates the character, so that it walks towards the current direction.
   */
  // animate() {
  //   setInterval(() => {
  //     this.checkDirection();
  //     this.world.camera_x = -this.x + 100;
  //   }, 1000 / 60);

  //   setInterval(() => {
  //     this.checkStatus();
  //   }, 1000 );

  //   setInterval(() => {
  //     this.checkStatus2();
  //   }, 300 );
  // }

  animate() {
    setInterval(() => {
      if (!this.world) return; // WICHTIG: Prüfung hinzufügen
      this.checkDirection();
      this.world.camera_x = -this.x + 100;
      if (this.world.keyboard.RIGHT) {
        this.x += this.speed;
      }

      if (this.world.keyboard.LEFT) {
        this.x -= this.speed;
      }
    }, 1000 / 60);

    setInterval(() => {
      if (!this.world) return; // WICHTIG: Prüfung hinzufügen

      if (this.isAboveGround()) {
        this.playAnimation(this.IMAGES_JUMPING);
      } else {
        if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
          this.playAnimation(this.IMAGES_WALKING);
        }
      }
    }, 100);
  }

  /**
   * Finds out which direction Pepe is currently moving to.
   */
  checkDirection() {
    if (!this.world) return; // WICHTIG: Prüfung hinzufügen
    this.ifPepeIsWalkingRight();
    this.ifPepeIsWalkingLeft();
    this.ifPepeIsJumping();
  }

  /**
   * If Pepe is moving to the right, this function starts the correct animation and saves information on the direction for other functions.
   */
  ifPepeIsWalkingRight() {
    if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
      this.moveRight();
      // this.world.registerTime();
      this.otherDirection = false;
      this.direction = true;
    }
  }

  /**
   * If Pepe is moving to the left, this function starts the correct animation and saves information on the direction for other functions.
   */
  ifPepeIsWalkingLeft() {
    if (this.world.keyboard.LEFT && this.x > 0) {
      this.moveLeft();
      // this.world.registerTime();
      this.otherDirection = true;
      this.direction = false;
    }
  }

  /**
   * If Pepe is jumping, this function starts the correct animation and saves information on the direction for other functions.
   */
  ifPepeIsJumping() {
    if ((this.world.keyboard.SPACE && !this.isAboveGround()) || (this.world.keyboard.UP && !this.isAboveGround())) {
      this.jump(this.sound);
      // this.world.registerTime();
    }
  }

  /**
   * Checks, which status Pepe is in and starts correct animation.
   */
  checkStatus() {
    if (this.isDead()) {
      this.endPepesLife();
    } else if (this.isSnoozing) {
      this.playAnimation(this.IMAGES_IDLE);
    } else if (this.isSleeping) {
      this.putPepeinSleepingMode();
    } else if (this.isHurt()) {
      this.playAnimation(this.IMAGES_HURT);
    } else if (this.isAboveGround()) {
      this.playAnimation(this.IMAGES_JUMPING);
    } else {
      this.ifPepeIsMoving();
    }
  }

  checkStatus2() {
    if (this.isHurt()) {
      this.playAnimation(this.IMAGES_HURT);
    } else if (this.isAboveGround()) {
      this.playAnimation(this.IMAGES_JUMPING);
    } else {
      this.ifPepeIsMoving();
    }
  }

  /**
   * Plays death-animation, shows game over image and ends game.
   */
  endPepesLife() {
    this.world.clearAllIntervals();
    this.playAnimation(this.IMAGES_DEAD);
    this.world.showGameOverImage();
    setInterval(() => {
      this.y += 10;
    }, 50);
    this.world.leaveGame("lost", 0);
  }

  /**
   * Plays sleeping-animation and if Pepe wakes up plays frigthened-animation.
   */
  putPepeinSleepingMode() {
    this.playAnimation(this.IMAGES_LONG_IDLE);
    if (this.world.keyboard.D) {
      this.playAnimation(this.IMAGES_FRIGHTENED);
    }
  }

  /**
   * Plays walking-animation.
   */
  ifPepeIsMoving() {
    if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
      this.playAnimation(this.IMAGES_WALKING);
    }
  }
}