class Coin extends MovableObject {
  offset = {
    top: 30,
    left: 30,
    right: 30,
    bottom: 30,
  };

  IMAGES_TURNING = ["img/8_coin/coin_1.png", "img/8_coin/coin_2.png"];

  number;

  currentImage = 0;

  /**
   * Creates a coin at a random position and starts its animation.
   * - x: random between 200 and 2200.
   * - y: random between 180 and 360, keeping coins reachable by jumping.
   * - Size: fixed at 80×80px.
   * @param {number} number - Unique identifier assigned to this instance.
   */
  constructor(number) {
    super().loadImage("img/8_coin/coin_1.png");
    this.number = number;
    this.x = 200 + Math.random() * 2000;
    this.width = 80;
    this.height = 80;
    this.y = 180 + Math.random() * 180;
    this.loadImages(this.IMAGES_TURNING);
    this.animate();
  }

  /**
   * Alternates between the two turning frames every 400ms.
   */
  animate() {
    setInterval(() => {
      this.playAnimation(this.IMAGES_TURNING);
    }, 400);
  }
}