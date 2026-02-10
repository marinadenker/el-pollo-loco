class DrawableObject {
  img;
  imageCache = {};
  currentImage = 0;
  offset = {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  };

  /**
   * Loads a single image and assigns it to the current object.
   * @param {string} path - The file path of the image to load.
   */
  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  /**
   * Loads multiple images and stores them in the image cache for quick access.
   * @param {string} array - Array of image file paths to preload.
   */
  loadImages(array) {
    array.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }

  /**
   * Draws the current image of the object on the canvas.
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
   */
  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height); //drawImage is a methode
  }

  /**
   * Draws a blue outline around the object’s bounding box for debugging purposes.
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
   */
  drawFrame(ctx) {
    if (
      this instanceof Character ||
      this instanceof normalChicken ||
      this instanceof EndBoss ||
      this instanceof SpawnCoin ||
      this instanceof SpawnBottle
    ) {
      ctx.beginPath();
      ctx.lineWidth = "3";
      ctx.strokeStyle = "blue";
      ctx.rect(this.x, this.y, this.width, this.height);
      ctx.stroke();
    }
  }

  /**
   * Draws a red outline around the object’s offset area for collision debugging.
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
   */
  drawOffsetFrame(ctx) {
    if (
      this instanceof Character ||
      this instanceof normalChicken ||
      this instanceof EndBoss ||
      this instanceof SpawnCoin ||
      this instanceof SpawnBottle
    ) {
      ctx.beginPath();
      ctx.lineWidth = "3";
      ctx.strokeStyle = "red";
      ctx.rect(
        this.x + this.offset.left,
        this.y + this.offset.top,
        this.width - this.offset.right,
        this.height - this.offset.bottom
      );
      ctx.stroke();
    }
  }
}