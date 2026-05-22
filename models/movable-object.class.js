class MovableObject extends DrawableObject {
  speedY = 0;
  acceleration = 2.5;
  otherDirection = false;
  energy = 100;
  lastHit = 0;
  offset = {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  };


  /**
 * Creates a new MovableObject instance and loads the default character image.
 * Initializes the base DrawableObject and sets the starting sprite.
 */
  constructor() {
    super();
    this.loadImage("img/2_character_pepe/2_walk/W-21.png");
  }


  /**
   * Starts a gravity loop at 25fps that pulls the object downward when airborne.
   * Sets `isFalling` to `true` while the object is descending.
   */
  applyGravity() {
    setInterval(() => {
      if (this.reachedVertexPoint() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
        if (this.speedY < 0) {
          this.isFalling = true;
        } else {
          this.isFalling = false;
        }
      }
    }, 1000 / 25);
  }


  /**
   * Returns `true` if the object should keep moving vertically.
   * Always returns `true` for {@link ThrowableObject} (bottles fly freely);
   * for all others, delegates to {@link isAboveGround}.
   * @returns {boolean}
   */
  reachedVertexPoint() {
    if (this instanceof ThrowableObject) {
      return true;
    } else {
      return this.isAboveGround();
    }
  }


  /**
   * Returns `true` if the object is above the ground threshold (y < 200).
   * Always returns `true` for {@link ThrowableObject} instances.
   * @returns {boolean}
   */
  isAboveGround() {
    if (this instanceof ThrowableObject) {
      return true;
    } else {
      return this.y < 200;
    }
  }


  /**
   * Returns `true` if this object's hitbox overlaps with another movable object's hitbox.
   * All four sides are checked using the objects' offset values.
   * @param {MovableObject} mo - The other object to test against.
   * @returns {boolean}
   */
  isColliding(mo) {
    return (
      this.x + this.width - this.offset.right > mo.x + mo.offset.left &&
      this.y + this.height - this.offset.bottom > mo.y + mo.offset.top &&
      this.x + this.offset.left < mo.x + mo.width - mo.offset.right &&
      this.y + this.offset.top < mo.y + mo.height - mo.offset.bottom
    );
  }


  /**
   * Reduces the object's energy by 1 and clamps it to 0.
   * Records `lastHit` only if energy is still above 0 after the hit.
   */
  hit() {
    this.energy -= 1;
    if (this.energy < 0) {
      this.energy = 0;
    } else {
      this.lastHit = new Date().getTime();
    }
  }


  /**
   * Returns `true` if the object was hit within the last second.
   * Used to trigger hurt animations and prevent repeated damage.
   * @returns {boolean}
   */  
  isHurt() {
    let timepassed = new Date().getTime() - this.lastHit;
    timepassed = timepassed / 1000;
    return timepassed < 1;
  }


  /**
   * Default animation loop stub that syncs the camera to this object's position.
   * Overridden by subclasses with their own animation logic.
   */  
  animate() {
    setInterval(() => {
      this.world.camera_x = -this.x + 100;
    }, 1000 / 10);
  }


  /**
   * Returns `true` if the object's energy has reached exactly 0.
   * @returns {boolean}
   */  
  isDead() {
    return this.energy == 0;
  }


  /**
   * Moves the object to the right by `speed` pixels and sets `otherDirection` to `false`.
   */
  moveRight() {
    this.otherDirection = false;
    this.x += this.speed;
  }


  /**
   * Moves the object to the left by `speed` pixels and sets `otherDirection` to `true`.
   */
  moveLeft() {
    this.otherDirection = true;
    this.x -= this.speed;
  }


  /**
   * Moves the object to the right using the absolute value of `speed`,
   * without changing the facing direction. Used for endboss retreat movement.
   */  
  moveBack() {
    this.otherDirection = false; 
    this.x += Math.abs(this.speed);
  }


  /**
   * Makes the object jump by setting `speedY` to 30 and playing the jump sound.
   */  
  jump() {
    this.speedY = 30;
    this.world.playSound(this.world.jumpAudio);
  }


  /**
   * Advances the animation by one frame from the given image array.
   * Supports fractional `frameSpeed` values for slower animations —
   * the frame only advances once the internal counter reaches 1.
   * @param {string[]} images - Ordered array of image paths forming the animation.
   * @param {number} [frameSpeed=1] - How fast to advance frames; values below 1 slow the animation.
   */  
  playAnimation(images, frameSpeed = 1) {
    this.animationFrameCounter = (this.animationFrameCounter || 0) + frameSpeed;
    if (this.animationFrameCounter >= 1) {
      this.currentImage++;
      this.animationFrameCounter = 0;
    }
    let i = this.currentImage % images.length;
    let path = images[i];
    this.img = this.imageCache[path];
  }
}