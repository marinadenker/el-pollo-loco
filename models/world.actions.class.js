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
        this.handleEnemyCollision(enemy);
      }
    });
  }

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

  handleEndbossCollision(enemy) {
    if (enemy.currentState !== "hurt" && enemy.currentState !== "dead") {
      enemy.changeState("attack");
      this.world.playSound(this.world.endbossAttacksAudio);
    }
    this.hurtCharacterByEnemy(enemy);
  }

  handleChickenCollision(enemy) {
    this.hurtCharacterByEnemy(enemy);
  }

  hurtCharacterByEnemy(enemy) {
    this.hurtCharacter(enemy);
    this.world.updateStatusbar(
      this.world.statusBarEnergy,
      this.world.character.energy,
      this.world.statusBarEnergy.IMAGES_ENERGY,
    );
  }

  checkEndbossState() {
    const endboss =
      this.world.level.enemies[this.world.level.enemies.length - 1];
    if (!endboss || !endboss.isAlive) return;

    const distance = endboss.x - this.world.character.x;
    this.updateEndbossState(endboss, distance);
  }

  updateEndbossState(endboss, distance) {
    if ( !endboss.isAlive || endboss.currentState === "hurt" ||endboss.currentState === "dead")
      return;
    if (this.world.endbossRetreating) return;
    if (distance < 50) {endboss.speed = 0; return;}

    if (distance <= 350 && !this.world.endbossAttacking) {
      this.letEndbossAttack(endboss);
    } else if (distance <= 500 && !this.world.endbossAlert && !this.world.endbossAttacking) {
      this.letEndbossBeAlert(endboss);
    }
  }

  letEndbossBeAlert(endboss) {
    this.world.endbossAlert = true;
    endboss.changeState("alert");
    setTimeout(() => {
      this.world.endbossAlert = false;
    }, 1000);
  }

  letEndbossAttack(endboss) {
    this.world.endbossAttacking = true;
    endboss.speed = 8;
    endboss.changeState("attack");

    setTimeout(() => {
      if (!endboss.isAlive) return;
      endboss.speed = -10;
      this.world.endbossRetreating = true;
      endboss.changeState("alert");

      setTimeout(() => {
        if (!endboss.isAlive) return;
        endboss.speed = 0;
        this.world.endbossAttacking = false;
        this.world.endbossAlert = false;
        this.world.endbossRetreating = false;
      }, 800);
    }, 1000);
  }

  playSplashAnimation(throwableObject) {
    if (!throwableObject?.IMAGES_SPLASHING) return;
    let counter = 0;
    const interval = setInterval(() => {
      throwableObject.playAnimation(throwableObject.IMAGES_SPLASHING);
      if (++counter >= 10) clearInterval(interval);
    }, 100);
  }

  async killEnemy(enemy, ThrowableObject) {
    enemy.speed = 0;
    enemy.y = 480 - enemy.height;
    enemy.isAlive = false;
    enemy.playAnimation(enemy.IMAGES_DEAD);
    this.world.playSound(this.world.chickenDeadAudio);

    this.playSplashAnimation(ThrowableObject);
  }

  enemyIsNormalChicken(enemy) {
    return enemy.number >= 0;
  }

  checkCollisionWithCoin() {
    this.world.level.coins.forEach((coin) => {
      if (this.world.character.isColliding(coin)) {
        this.world.playSound(this.world.earnedCoinAudio);
        this.world.collectedCoins += 12.5;
        this.world.statusBarCoins.setPercentage(
          this.world.collectedCoins,
          this.world.statusBarCoins.IMAGES_COINS,
        );
        const index = this.world.level.coins.findIndex(
          (c) => c.number === coin.number,
        );
        if (index !== -1) this.world.level.coins.splice(index, 1);
      }
    });
  }

  checkCollisionWithBottle() {
    this.world.level.bottles.forEach((bottle) => {
      if (this.world.character.isColliding(bottle)) {
        this.world.playSound(this.world.earnedBottleAudio);

        const index = this.world.level.bottles.findIndex(
          (b) => b.number === bottle.number,
        );
        if (index !== -1) {
          this.world.level.bottles.splice(index, 1);
          this.world.bottlesLeft++;

          this.world.updateStatusbar(
            this.world.statusBarBottles,
            this.world.bottlesLeft * 20,
            this.world.statusBarBottles.IMAGES_BOTTLES,
          );
        }
      }
    });
  }

  hurtCharacter(enemy) {
    const timeSinceLastHit = Date.now() - this.world.character.lastHit;
    if (timeSinceLastHit < 1000) return;

    this.world.character.hit();
    this.world.playSound(this.world.hurtAudio);
    this.currentEnemy = enemy.number;
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

    this.world.playSound(this.world.throwBottleAudio);
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