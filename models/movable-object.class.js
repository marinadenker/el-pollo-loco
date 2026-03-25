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

  constructor() {
    super();
    this.loadImage("img/2_character_pepe/2_walk/W-21.png");
  }

  /**
   * Makes the object fall back to the ground when being in the air.
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
   * Returns true if object reaches the highest point or if it is a bottle.
   */
  reachedVertexPoint() {
    if (this instanceof ThrowableObject) {
      return true;
    } else {
      return this.isAboveGround();
    }
  }

  /**
   * Returns true if the element is above the y-coordiante of 200.
   */
  isAboveGround() {
    if (this instanceof ThrowableObject) {
      return true;
    } else {
      return this.y < 200;
    }
  }

  /**
   * returns whether the movable object is colliding with the other object.
   * @param {MovableObject} mo - The movable object.
   */
  isColliding(mo) {
    return (
      this.x + this.width - this.offset.right > mo.x + mo.offset.left &&
      this.y + this.height - this.offset.bottom > mo.y + mo.offset.top &&
      this.x + this.offset.left < mo.x + mo.width - mo.offset.right &&
      this.y + this.offset.top < mo.y + mo.height - mo.offset.bottom
    );
  }

  hit() {
    this.energy -= 1;
    if (this.energy < 0) {
      this.energy = 0;
    } else {
      this.lastHit = new Date().getTime();
    }
  }

  isHurt() {
    let timepassed = new Date().getTime() - this.lastHit;
    timepassed = timepassed / 1000;
    return timepassed < 1;
  }


  /**
   * Handles character animation and camera movement.
   */
  animate() {
    setInterval(() => {
      this.world.camera_x = -this.x + 100;
    }, 1000 / 10);
  }

  isDead() {
    return this.energy == 0;
  }

  /**
   * Moves object to the right.
   */
  moveRight() {
    this.otherDirection = false;
    this.x += this.speed;
  }

  moveLeft() {
    this.otherDirection = true;
    this.x -= this.speed;
  }


  jump() {
    this.speedY = 30;
    this.world.JumpAudio.play();
  }


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