class WorldActions {
  world;

  checkCollisions() {
    this.checkCollisionWithEnemy();
    this.checkCollisionWithCoin();
    this.checkCollisionWithBottle();
    this.checkCollisionWithThrowableBottles();
  }

  checkCollisionWithEnemy() {
    this.world.level.enemies.forEach((enemy) => {
      if (this.world.character.isColliding(enemy) && enemy.isAlive) {
        if (
          this.world.character.isFalling &&
          this.world.character.isAboveGround() &&
          this.enemyIsNormalChicken(enemy)
        ) {
          this.killEnemy(enemy);
        } else if (!this.enemyIsNormalChicken(enemy)) {
          this.hurtCharacter(enemy);
          this.world.updateStatusbar(
            this.world.statusBarEnergy,
            this.world.character.energy,
            this.world.statusBarEnergy.IMAGES_ENERGY,
          );
        } else {
          this.hurtCharacter(enemy);
          this.world.updateStatusbar(
            this.world.statusBarEnergy,
            this.world.character.energy,
            this.world.statusBarEnergy.IMAGES_ENERGY,
          );
        }
      }
    });
  }

  async killEnemy(enemy, ThrowableObject) {
    enemy.speed = 0;
    enemy.y = 480 - enemy.height;
    enemy.isAlive = false;

    enemy.playAnimation(enemy.IMAGES_DEAD);

    if (ThrowableObject && ThrowableObject.IMAGES_SPLASHING) {
      let splashCounter = 0;
      const splashInterval = setInterval(() => {
        ThrowableObject.playAnimation(ThrowableObject.IMAGES_SPLASHING);
        splashCounter++;
        if (splashCounter >= 10) {
          clearInterval(splashInterval);
        }
      }, 100);
    }
  }

  enemyIsNormalChicken(enemy) {
    return enemy.number >= 0;
  }

  checkCollisionWithCoin() {
    this.world.level.coins.forEach((coin) => {
      if (this.world.character.isColliding(coin)) {
        this.world.collectedCoins += 12.5;
        this.world.statusBarCoins.setPercentage(
          this.world.collectedCoins,
          this.world.statusBarCoins.IMAGES_COINS,
        );
        for (let index = 0; index < this.world.coins.length; index++) {
          if (coin.number == this.world.coins[index].number) {
            this.world.coins.splice(index, 1);
          }
        }
      }
    });
  }

  checkCollisionWithBottle() {
    this.world.level.bottles.forEach((bottle) => {
      if (this.world.character.isColliding(bottle)) {
        for (let index = 0; index < this.world.bottles.length; index++) {
          if (bottle.number == this.world.bottles[index].number) {
            this.world.bottles.splice(index, 1);
            this.world.bottlesLeft++;

            this.world.updateStatusbar(
              this.world.statusBarBottles,
              this.world.bottlesLeft * 20,
              this.world.statusBarBottles.IMAGES_BOTTLES,
            );
            break;
          }
        }
      }
    });
  }

  hurtCharacter(enemy) {
    this.world.character.playAnimation(this.world.character.IMAGES_HURT);
    this.world.character.hit();
    if (
      this.world.currentEnemey != enemy.number ||
      currentTime - this.world.character.lastHit > 2000
    ) {
      this.currentEnemey = enemy.number;
    }
  }

  checkThrowObjects() {
    if (this.world.keyboard.D && this.canThrowBottle()) {
      this.throwBottle();
      this.world.keyboard.D = false;
    }
  }

  canThrowBottle() {
    if (this.world.bottlesLeft <= 0) return false;

    if (this.world.throwableObjects.length > 0) {
      let lastBottle =
        this.world.throwableObjects[this.world.throwableObjects.length - 1];
      if (lastBottle.y <= 240) return false;
    }

    return true;
  }

  throwBottle() {
    let bottle = new ThrowableObject(
      this.world.character.x + 100,
      this.world.character.y + 100,
      this.world.character.otherDirection,
      this.world.bottleNumber,
    );

    this.world.throwableObjects.push(bottle);
    this.world.bottleNumber++;
    this.world.bottlesLeft--;

    this.world.updateStatusbar(
      this.world.statusBarBottles,
      this.world.bottlesLeft * 20,
      this.world.statusBarBottles.IMAGES_BOTTLES,
    );
  }

  checkCollisionWithThrowableBottles() {
    this.world.throwableObjects.forEach((bottle) => {
      this.checkCollisionWithEndboss(bottle);
    });
  }

  checkCollisionWithEndboss(bottle) {
    this.world.level.enemies.forEach((enemy) => {
      if (!this.enemyIsNormalChicken(enemy) && enemy.isAlive) {
        if (bottle.isColliding(enemy) && !enemy.isHitting) {
          this.hurtEndboss(enemy, bottle);
        }
      }
    });
  }

  hurtEndboss(enemy, bottle) {
    enemy.isHitting = true; 
    enemy.hit();

    this.world.updateStatusbar(
      this.world.statusBarEndboss,
      enemy.energy,
      this.world.statusBarEndboss.IMAGES_ENDBOSS,
    );

    setTimeout(() => {
      enemy.isHitting = false;
    }, 500);

    if (enemy.energy <= 0) {
      this.killEndboss(enemy, bottle);
    }
  }

  killEndboss(enemy, bottle) {
    enemy.isAlive = false;
    enemy.speed = 0;
    enemy.currentState = "dead";

    if (bottle && bottle.IMAGES_SPLASHING) {
      let splashCounter = 0;
      const splashInterval = setInterval(() => {
        bottle.playAnimation(bottle.IMAGES_SPLASHING);
        splashCounter++;
        if (splashCounter >= 10) clearInterval(splashInterval);
      }, 100);
    }

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
        this.world.exitGame("won", this.world.collectedCoins);
      },
      enemy.IMAGES_DYING.length * 300 + 500,
    );
  }
}
