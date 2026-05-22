class Bottle extends MovableObject {
  offset = {
    top: 20,
    left: 30,
    right: 35,
    bottom: 10,
  };
  number;

  /**
   * Creates a ground bottle at a random x position with a fixed size of 80×80px.
   * Adjusts the left/right hitbox offsets for the upright bottle image variant.
   * @param {number} number - Unique identifier assigned to this instance.
   * @param {string} image - Path to the bottle sprite image.
   */
  constructor(number, image) {
    super();
    this.loadImage(image); 
    this.number = number;
    this.x = 200 + Math.random() * 2000;
    this.width = 80;
    this.height = 80;
    this.y = 380;
    if (image == "img/6_salsa_bottle/1_salsa_bottle_on_ground.png") {
      this.offset.left = 40;
      this.offset.right = 20;
    }
  }
}