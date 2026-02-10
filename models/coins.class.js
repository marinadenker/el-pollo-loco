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
   * Represents a coin
   * @constructor
   * @param {number} number - The number of the coin.
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
   * Animates the coin
   */
  animate() {
    setInterval(() => {
      this.playAnimation(this.IMAGES_TURNING);
    }, 400);
  }
}