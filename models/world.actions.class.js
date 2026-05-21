class WorldActions {
  world;


  /**
   * Runs all collision checks for the current frame:
   * enemies, coins, bottles, and throwable bottles.
   */
  checkCollisions() {
    this.checkCollisionWithEnemy();
    this.checkCollisionWithCoin();
    this.checkCollisionWithBottle();
    this.checkCollisionWithThrowableBottles();
  }


  /**
   * Iterates over all enemies and triggers collision handling
   * if the character overlaps with a living enemy.
   */
  checkCollisionWithEnemy() {
    this.world.level.enemies.forEach((enemy) => {
      if (this.world.character.isColliding(enemy) && enemy.isAlive) {
        this.handleEnemyCollision(enemy);
      }
    });
  }


  /**
   * Routes an enemy collision to the correct handler based on enemy type and character state.
   * - Endboss: delegates to {@link handleEndbossCollision}.
   * - Normal chicken + character falling: kills the enemy.
   * - Normal chicken otherwise: hurts the character.
   * @param {MovableObject} enemy - The enemy the character has collided with.
   */  
  handleEnemyCollision(enemy) {
    if (!this.enemyIsNormalChicken(enemy)) {
      this.handleEndbossCollision(enemy);
    } else if (
      this.world.character.isFalling &&
      this.world.character.isAboveGround()
    ) {
      this.killEnemy(enemy);
    } else {
      this.handleChickenCollision(enemy);
    }
  }


  /**
   * Handles a collision between the character and the endboss.
   * Triggers the endboss attack state and sound if not already hurt or dead,
   * then damages the character.
   * @param {MovableObject} enemy - The endboss enemy instance.
   */  
  handleEndbossCollision(enemy) {
    if (enemy.currentState !== "hurt" && enemy.currentState !== "dead") {
      enemy.changeState("attack");
      this.world.playSound(this.world.endbossAttacksAudio);
    }
    this.hurtCharacterByEnemy(enemy);
  }


  /**
   * Handles a collision between the character and a normal chicken enemy.
   * Damages the character.
   * @param {MovableObject} enemy - The chicken enemy instance.
   */  
  handleChickenCollision(enemy) {
    this.hurtCharacterByEnemy(enemy);
  }


  /**
   * Hurts the character due to an enemy collision and refreshes the energy status bar.
   * @param {MovableObject} enemy - The enemy that caused the damage.
   */  
  hurtCharacterByEnemy(enemy) {
    this.hurtCharacter(enemy);
    this.world.updateStatusbar(
      this.world.statusBarEnergy,
      this.world.character.energy,
      this.world.statusBarEnergy.IMAGES_ENERGY,
    );
  }


  /**
   * Retrieves the endboss (last enemy in the level) and evaluates its
   * state based on distance to the character.
   */  
  checkEndbossState() {
    const endboss =
      this.world.level.enemies[this.world.level.enemies.length - 1];
    if (!endboss || !endboss.isAlive) return;

    const distance = endboss.x - this.world.character.x;
    this.updateEndbossState(endboss, distance);
  }


  /**
   * Updates the endboss behaviour based on its distance to the character.
   * Triggers alert at ≤500px, attack at ≤350px, and stops movement at ≤50px.
   * Skips update if the endboss is hurt, dead, or retreating.
   * @param {MovableObject} endboss - The endboss enemy instance.
   * @param {number} distance - Horizontal distance between the endboss and character in pixels.
   */  
  updateEndbossState(endboss, distance) {
    if (!endboss.isAlive || endboss.currentState === "hurt" || endboss.currentState === "dead") return;
    if (this.world.endbossRetreating) return;
    if (distance < 50) {
      endboss.speed = 0;
      return;
    }

    if (distance <= 350 && !this.world.endbossAttacking) {
      this.letEndbossAttack(endboss);
    } else if (distance <= 500 && !this.world.endbossAlert && !this.world.endbossAttacking) {
      this.letEndbossBeAlert(endboss);
    }
  }


  /**
   * Puts the endboss into the alert state for 1 second,
   * then resets the alert flag.
   * @param {MovableObject} endboss - The endboss enemy instance.
   */  
  letEndbossBeAlert(endboss) {
    this.world.endbossAlert = true;
    endboss.changeState("alert");
    setTimeout(() => {
      this.world.endbossAlert = false;
    }, 1000);
  }


  /**
   * Triggers the endboss attack sequence:
   * charges toward the character at high speed, then retreats
   * and resets to the walk state after ~1.8 seconds.
   * @param {MovableObject} endboss - The endboss enemy instance.
   */  
  letEndbossAttack(endboss) {
    this.world.endbossAttacking = true;
    endboss.speed = 8;
    endboss.changeState("attack");

    setTimeout(async () => {
      if (!endboss.isAlive) return;
      endboss.speed = -10;
      this.world.endbossRetreating = true;
      endboss.changeState("alert");

      await new Promise((resolve) => setTimeout(resolve, 800));

      if (!endboss.isAlive) return;
      endboss.speed = 0;
      this.world.endbossAttacking = false;
      this.world.endbossAlert = false;
      this.world.endbossRetreating = false;
      endboss.changeState("walk");
    }, 1000);
  }


  /**
   * Plays the splash animation on a throwable object over 10 frames at 100ms intervals.
   * Exits early if the object has no splash images defined.
   * @param {ThrowableObject} throwableObject - The bottle to animate.
   */  
  playSplashAnimation(throwableObject) {
    if (!throwableObject?.IMAGES_SPLASHING) return;
    let counter = 0;
    const interval = setInterval(() => {
      throwableObject.playAnimation(throwableObject.IMAGES_SPLASHING);
      if (++counter >= 10) clearInterval(interval);
    }, 100);
  }


  /**
   * Kills an enemy: stops movement, snaps it to the ground, plays the death animation
   * and sound, and optionally triggers a splash animation on the throwable object.
   * @param {MovableObject} enemy - The enemy to kill.
   * @param {ThrowableObject} [ThrowableObject] - The bottle that caused the kill, if any.
   * @returns {Promise<void>}
   */  
  async killEnemy(enemy, ThrowableObject) {
    enemy.speed = 0;
    enemy.y = 480 - enemy.height;
    enemy.isAlive = false;
    enemy.playAnimation(enemy.IMAGES_DEAD);
    this.world.playSound(this.world.chickenDeadAudio);

    this.playSplashAnimation(ThrowableObject);
  }


  /**
   * Determines whether an enemy is a normal chicken (as opposed to the endboss).
   * Uses the `number` property: normal chickens have a non-negative number.
   * @param {MovableObject} enemy - The enemy to check.
   * @returns {boolean} `true` if the enemy is a normal chicken.
   */  
  enemyIsNormalChicken(enemy) {
    return enemy.number >= 0;
  }


  /**
   * Checks whether the character is colliding with any coin in the level.
   * On collision: plays a sound, increments the coin counter by 12.5%,
   * updates the coin status bar, and removes the coin from the level.
   */  
  checkCollisionWithCoin() {
    this.world.level.coins.forEach((coin) => {
      if (!this.world.character.isColliding(coin)) return;
      this.world.playSound(this.world.earnedCoinAudio);
      this.world.collectedCoins += 12.5;
      this.world.statusBarCoins.setPercentage(this.world.collectedCoins, this.world.statusBarCoins.IMAGES_COINS,);
      const index = this.world.level.coins.findIndex(
        (c) => c.number === coin.number,
      );
      if (index !== -1) this.world.level.coins.splice(index, 1);
    });
  }


  /**
   * Checks whether the character is colliding with any ground bottle in the level.
   * On collision: plays a sound, removes the bottle from the level,
   * increments the bottle inventory, and updates the bottle status bar.
   */  
  checkCollisionWithBottle() {
    this.world.level.bottles.forEach((bottle) => {
      if (!this.world.character.isColliding(bottle)) return;
      this.world.playSound(this.world.earnedBottleAudio);

      const index = this.world.level.bottles.findIndex((b) => b.number === bottle.number,);
      if (index !== -1) {
        this.world.level.bottles.splice(index, 1);
        this.world.bottlesLeft++;
        this.world.updateStatusbar(this.world.statusBarBottles, this.world.bottlesLeft * 20, this.world.statusBarBottles.IMAGES_BOTTLES,);
      }
    });
  }


  /**
   * Damages the character if at least 1 second has passed since the last hit.
   * Plays the hurt sound and records the attacking enemy number.
   * @param {MovableObject} enemy - The enemy causing the damage.
   */  
  hurtCharacter(enemy) {
    const timeSinceLastHit = Date.now() - this.world.character.lastHit;
    if (timeSinceLastHit < 1000) return;

    this.world.character.hit();
    this.world.playSound(this.world.hurtAudio);
    this.currentEnemy = enemy.number;
  }


  /**
   * Checks whether the D key is pressed and a bottle can be thrown,
   * then throws one and suppresses further input until the key is released.
   */
  checkThrowObjects() {
    if (this.world.keyboard.D && this.canThrowBottle()) {
      this.throwBottle();
      this.world.keyboard.D = false;
    }
  }


  /**
   * Determines whether the character is allowed to throw a bottle.
   * Requires at least one bottle in inventory and that the last thrown bottle
   * has already fallen below y=240 (preventing spam).
   * @returns {boolean} `true` if throwing is currently permitted.
   */  
  canThrowBottle() {
    if (this.world.bottlesLeft < 1) return false;
    let lastBottle =
      this.world.throwableObjects[this.world.throwableObjects.length - 1];
    if (lastBottle && lastBottle.y <= 240) return false;
    return true;
  }


  /**
   * Creates and launches a new {@link ThrowableObject} from the character's position,
   * in the character's current facing direction.
   * Decrements the bottle inventory, updates the status bar, and plays the throw sound.
   */  
  throwBottle() {
    let bottle = new ThrowableObject(this.world.character.x + 100, this.world.character.y + 100, this.world.character.otherDirection, this.world.bottleNumber,);
    bottle.world = this.world;
    this.world.throwableObjects.push(bottle);
    this.world.bottleNumber++;
    this.world.bottlesLeft--;

    this.world.updateStatusbar( this.world.statusBarBottles, this.world.bottlesLeft * 20, this.world.statusBarBottles.IMAGES_BOTTLES,);

    this.world.playSound(this.world.throwBottleAudio);
  }


  /**
   * Checks each throwable bottle for a collision with the endboss.
   */
  checkCollisionWithThrowableBottles() {
    this.world.throwableObjects.forEach((bottle) => {
      this.checkCollisionWithEndboss(bottle);
    });
  }


  /**
   * Checks whether a specific thrown bottle has collided with the endboss.
   * Triggers {@link hurtEndboss} if a hit is detected and the endboss is not already being hit.
   * @param {ThrowableObject} bottle - The thrown bottle to test.
   */  
  checkCollisionWithEndboss(bottle) {
    this.world.level.enemies.forEach((enemy) => {
      if (!this.enemyIsNormalChicken(enemy) && enemy.isAlive) {
        if (bottle.isColliding(enemy) && !enemy.isHitting) {
          this.hurtEndboss(enemy, bottle);
        }
      }
    });
  }


  /**
   * Applies damage to the endboss from a bottle hit:
   * reduces energy, updates the endboss status bar, removes the bottle,
   * and enforces a 500ms hit cooldown. Triggers {@link killEndboss} if energy reaches 0.
   * @param {MovableObject} enemy - The endboss being hit.
   * @param {ThrowableObject} bottle - The bottle that hit the endboss.
   */  
  hurtEndboss(enemy, bottle) {
    enemy.isHitting = true;
    enemy.hit();
    this.world.updateStatusbar(this.world.statusBarEndboss, enemy.energy, this.world.statusBarEndboss.IMAGES_ENDBOSS,);
    const index = this.world.throwableObjects.indexOf(bottle);
    if (index !== -1) {
      this.world.throwableObjects.splice(index, 1);
    }

    setTimeout(() => {
      enemy.isHitting = false;
    }, 500);

    if (enemy.energy <= 0) {
      this.killEndboss(enemy, bottle);
    }
  }


  /**
   * Handles the endboss death sequence:
   * plays the death sound, stops movement, runs the dying animation frame by frame,
   * shows the win screen after the animation completes.
   * @param {MovableObject} enemy - The endboss to kill.
   * @param {ThrowableObject} bottle - The bottle that delivered the killing blow.
   */
  killEndboss(enemy, bottle) {
    this.world.playSound(this.world.endbossDeadAudio);
    enemy.isAlive = false;
    enemy.speed = 0;
    enemy.currentState = "dead";
    this.playSplashAnimation(bottle);

    clearInterval(enemy.animation);
    enemy.currentImage = 0;
    enemy.animation = setInterval(() => {
      enemy.playAnimation(enemy.IMAGES_DYING);
      if (enemy.currentImage >= enemy.IMAGES_DYING.length - 1) {
        clearInterval(enemy.animation);
        enemy.img = enemy.imageCache[enemy.IMAGES_DEAD[0]];
      }
    }, 300);

    setTimeout(
      () => {
        this.world.showGameOverScreen("won");
      },
      enemy.IMAGES_DYING.length * 300 + 500,
    );
  }
}