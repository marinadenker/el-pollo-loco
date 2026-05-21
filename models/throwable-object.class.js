class ThrowableObject extends MovableObject {
  offset = {
    top: 20,
    left: 40,
    right: 40,
    bottom: 10,
  };
  currentImage = 0;

  IMAGES_SPLASHING = [
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png",
  ];

  IMAGES_ROTATING = [
    "img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png",
  ];

  bottleNumber;


  constructor(x, y, direction, bottleNumber) {
    super();
    this.loadImage("img/6_salsa_bottle/salsa_bottle.png"); 
    this.loadImages(this.IMAGES_SPLASHING);
    this.loadImages(this.IMAGES_ROTATING);
    this.x = x;
    this.y = y;
    this.bottleNumber = bottleNumber;
    this.otherDirection = direction;
    this.width = 50;
    this.height = 60;
    this.animate(this.IMAGES_ROTATING);
    this.throw();
  }


/**
 * Launches the bottle by applying an upward impulse and gravity,
 * then moves it horizontally at 10px per 25ms in the character's
 * current facing direction (right if `otherDirection` is false, left otherwise).
 */
  throw() {
    this.speedY = 30;
    this.applyGravity();
    const direction = this.otherDirection ? -10 : 10;
    const moveInterval = setInterval(() => {
      this.x += direction;
      if (this.y >= 480) {
        clearInterval(moveInterval);
        this.removeFromWorld();
      }
    }, 25);
  }


  removeFromWorld() {
  if (!this.world) return;
  const index = this.world.throwableObjects.indexOf(this);
  if (index !== -1) {
    this.world.throwableObjects.splice(index, 1);
  }
}

/**
 * Starts a looping animation at 100ms per frame for the given image set.
 * @param {string[]} images - Ordered array of image paths to animate through.
 */
  animate(images) {
    setInterval(() => {
      this.playAnimation(images);
    }, 100);
  }
}