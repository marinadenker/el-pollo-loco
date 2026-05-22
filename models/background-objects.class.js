class BackgroundObject extends MovableObject {
  height = 480;
  width = 720;

  /**
   * Creates a background object and positions it at the bottom of the canvas.
   * @param {string} imagePath - Path to the background image file.
   * @param {number} x - Horizontal position of the tile in the game world.
   */
  constructor(imagePath, x) {
    super();
    this.loadImage(imagePath);
    this.x = x;
    this.y = 480 - this.height;
  }
}