class Level {
  enemies;
  clouds;
  backgroundObjects;
  coins;
  bottles;
  level_end_x = 2200;

  /**
   * Represents the current level.
   * @constructor
   * @param {array} enemies - Contains all enemies.
   * @param {array} clouds - Contains all clouds.
   * @param {array} backgroundObjects - Contains all backround objects.
   * @param {array} coins - Contains all coins.
   * @param {array} bottles - Contains all bottles.
   */
  constructor(enemies, clouds, backgroundObjects, coins, bottles) {
    this.enemies = enemies;
    this.clouds = clouds;
    this.backgroundObjects = backgroundObjects;
    this.coins = coins;
    this.bottles = bottles;
  }
}