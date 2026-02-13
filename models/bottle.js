class Bottle extends MovableObject {
  offset = {
    top: 20,
    left: 30,
    right: 35,
    bottom: 10,
  };
  number;

  /**
   * Represents a bottle on the ground.
   * @constructor
   * @param {string} image - The path of the image of the bottle.
   * * @param {number} number - The number of the bottle.
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