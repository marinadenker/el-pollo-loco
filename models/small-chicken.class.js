class BabyChicken extends MovableObject {
  walkingSpeed;
  isAlive = true;
  currentImage = 0;
  number;

  offset = {
    top: 3,
    left: 2,
    right: 2,
    bottom: 3,
  };

  IMAGES_WALKING = [
    "img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
    "img/3_enemies_chicken/chicken_small/1_walk/2_w.png",
    "img/3_enemies_chicken/chicken_small/1_walk/3_w.png",
  ];

  IMAGES_DEAD = ["img/3_enemies_chicken/chicken_small/2_dead/dead.png"];


  /**
   * Creates a baby chicken with randomised size, position, and speed.
   * - Width: 20–50px; height scales at 1.2× width.
   * - Spawns at a random x between 500 and 2000.
   * - Walking speed: 0.15–0.65px per frame.
   * - Top offset is set to -10 for very small chickens (height < 40px) to align the hitbox.
   * @param {number} number - Unique identifier assigned to this instance.
   */
  constructor(number) {
    super();
    this.loadImage("img/3_enemies_chicken/chicken_small/1_walk/1_w.png");
    this.x = 500 + Math.random() * 1500;
    this.width = Math.random() * 30 + 20;
    this.height = this.width * 1.2;
    this.y = 430 - this.height;
    this.walkingSpeed = 0.15 + Math.random() * 0.5;
    this.number = number;
    this.offset.top = this.height < 40 ? -10 : 3;
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_DEAD);
    if (this.isAlive) {
      this.animate();
    }
  }

  /**
   * Starts two loops for movement and animation:
   * - 60fps interval: moves the chicken left by `walkingSpeed` while alive.
   * - 270ms interval: advances the walking animation while alive.
   */
  animate() {
    this.movementInterval = setInterval(() => {
      if (this.isAlive) {
        this.x -= this.walkingSpeed;
      }
    }, 1000 / 60);

    this.animationInterval = setInterval(() => {
      if (this.isAlive) {
        this.playAnimation(this.IMAGES_WALKING);
      }
    }, 270);
  }
}