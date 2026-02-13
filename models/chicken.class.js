class Chicken extends MovableObject {
  offset = {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  };
  walkingSpeed;
  IMAGES_WALKING = [
    "img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
  ];

  IMAGES_DEAD = ["img/3_enemies_chicken/chicken_normal/2_dead/dead.png"];

  isAlive = true;
  currentImage = 0;
  number;

  /**
   * Represents a chicken.
   * @constructor
   * @param {number} number - Number of the chicken.
   */
  constructor(number) {
    super();
    this.loadImage("img/3_enemies_chicken/chicken_normal/1_walk/1_w.png");
    this.x = 600 + Math.random() * 1000;
    const aspectRatio = 243 / 248; // ≈ 0.979
    this.width = Math.random() * 40 + 50;
    this.height = this.width * aspectRatio;
    this.y = 440 - this.height;
    this.walkingSpeed = 0.15 + Math.random() * 0.5;
    this.number = number;
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_DEAD);
    if (this.isAlive) {
      this.animate();
    }
  }

  /**
   * Animates the chicken, so that it walks towards the game character.
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

