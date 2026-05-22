class Cloud extends MovableObject {
  y = 20;
  height = 250;
  width = 500;

  /**
 * Creates a new Cloud instance, loads the cloud image,
 * and positions it at a random x coordinate between 0 and 500.
 * Starts the movement animation immediately.
 */
  constructor() {
    super();
    this.loadImage("img/5_background/layers/4_clouds/1.png");

    this.x = 0 + Math.random() * 500;
    this.animate();
  }

  /**
 * Starts the cloud movement by continuously moving it to the left.
 */
  animate(){
    this.moveLeft();
  }


}