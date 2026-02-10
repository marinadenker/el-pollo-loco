class WorldActions {
  world;

  /**
   * checks collisions with enemies, coins and bottles.
   */
  checkCollisions() {
    this.world.level.enemies.forEach((enemy) => {
      this.checkCollisionWithEnemy(enemy);
    });
    this.world.level.coins.forEach((coin) => {
      this.checkCollisionWithCoin(coin);
    });
    this.world.level.bottles.forEach((bottle) => {
      this.checkCollisionWithBottle(bottle);
    });
  }

  /**
   * checks collisions with character.
   */
  checkCollisionWithEnemy(enemy) {
    if (this.world.character.isColliding(enemy) && enemy.isAlive) {
      // this.world.registerTime();
      if (
        this.world.character.isFalling &&
        this.world.character.isAboveGround() &&
        this.enemyIsNormalChicken(enemy)
      ) {
        this.killEnemy(enemy);
      } else {
        this.hurtCharacter(enemy);
        this.world.updateStatusbar(
          this.world.statusBarEnergy,
          this.world.character.energy,
          world.statusBarEnergy.IMAGES_ENERGY
        );
        this.world.decreaseCoins();
      }
    }
  }

  /**
   * returns whether it is a normal chicken or the endboss.
   */
  enemyIsNormalChicken(enemy) {
    return enemy.number >= 0;
  }

  /**
   * checks collisions with coin.
   */
  checkCollisionWithCoin(coin) {
    if (this.world.character.isColliding(coin)) {
      this.world.coinsCollected += 12.5;
      this.world.statusBarCoins.setPercentage(
        this.world.coinsCollected,
        this.world.statusBarCoins.IMAGES_COINS
      );
      for (let index = 0; index < this.world.coins.length; index++) {
        if (coin.number == this.world.coins[index].number) {
          this.world.coins.splice(index, 1);
        }
      }
      playSound(this.world.CoinsEarnedAudio, 0.1);
    }
  }

  /**
   * checks collisions with bottle on the ground.
   */
  checkCollisionWithBottle(bottle) {
    if (this.world.character.isColliding(bottle)) {
      for (let index = 0; index < this.world.bottles.length; index++) {
        if (bottle.number == this.world.bottles[index].number) {
          this.world.bottles.splice(index, 1);
          playSound(this.world.takeBottleAudio, 0.4);
          this.world.increaseAwailableBottles();
          this.world.updateStatusbar(
            this.world.statusBarBottles,
            this.world.bottlesLeft * 21,
            this.world.statusBarBottles.IMAGES_BOTTLES
          );
        }
      }
    }
  }
}