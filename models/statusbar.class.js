class StatusBar extends DrawableObject {
  IMAGES_ENERGY = [
    "img/7_statusbars/1_statusbar/2_statusbar_health/green/0.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/green/20.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/green/40.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/green/60.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/green/80.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/green/100.png",
  ];

  IMAGES_COINS = [
    "img/7_statusbars/1_statusbar/1_statusbar_coin/green/0.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/green/20.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/green/40.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/green/60.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/green/80.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/green/100.png",
  ];

  IMAGES_BOTTLES = [
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/green/0.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/green/20.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/green/40.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/green/60.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/green/80.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/green/100.png",
  ];

  IMAGES_ENDBOSS = [
    "img/7_statusbars/2_statusbar_endboss/green/green0.png",
    "img/7_statusbars/2_statusbar_endboss/green/green20.png",
    "img/7_statusbars/2_statusbar_endboss/green/green40.png",
    "img/7_statusbars/2_statusbar_endboss/green/green60.png",
    "img/7_statusbars/2_statusbar_endboss/green/green80.png",
    "img/7_statusbars/2_statusbar_endboss/green/green100.png",
  ];

  percentage = 100;

  /**
   * Creates a status bar at the given screen position and initialises it for the specified type.
   * @param {"energy"|"coins"|"bottles"|"endboss"} barType - Determines the image set and starting percentage.
   * @param {number} y - Vertical position in screen space (fixed, unaffected by camera).
   * @param {number} x - Horizontal position in screen space (fixed, unaffected by camera).
   */
  constructor(barType, y, x) {
    super();
    this.x = x;
    this.y = y;
    this.width = 150;
    this.height = 40;
    this.getBarType(barType);
  }


  /**
   * Loads the correct image set for the given bar type and sets its initial percentage.
   * - `"energy"` and `"endboss"` start full (100%).
   * - `"coins"` and `"bottles"` start empty (0%).
   * @param {"energy"|"coins"|"bottles"|"endboss"} barType - The type of status bar to initialise.
   */
  getBarType(barType) {
    if (barType == "energy") {
      this.loadImages(this.IMAGES_ENERGY);
      this.setPercentage(100, this.IMAGES_ENERGY);
    } else if (barType == "coins") {
      this.loadImages(this.IMAGES_COINS);
      this.setPercentage(0, this.IMAGES_COINS);
    } else if (barType == "bottles") {
      this.loadImages(this.IMAGES_BOTTLES);
      this.setPercentage(0, this.IMAGES_BOTTLES);
    } else if (barType == "endboss") {
      this.loadImages(this.IMAGES_ENDBOSS);
      this.setPercentage(100, this.IMAGES_ENDBOSS);
    }
  }

  /**
   * Updates the status bar to reflect a new fill percentage
   * by selecting the matching image from the provided array.
   * @param {number} percentage - The current fill value (0–100).
   * @param {string[]} arr - The image set to pick from, ordered lowest to highest fill.
   */
  setPercentage(percentage, arr) {
    this.percentage = percentage;
    let path = arr[this.resolveImageIndex()];
    this.img = this.imageCache[path];
  }


  /**
   * Maps `this.percentage` to one of six image indices (0–5)
   * in steps of 20%, where 0 = empty and 5 = full.
   * @returns {number} Index between 0 and 5.
   */
  resolveImageIndex() {
    if (this.percentage >= 100) {
      return 5;
    } else if (this.percentage >= 80) {
      return 4;
    } else if (this.percentage >= 60) {
      return 3;
    } else if (this.percentage >= 40) {
      return 2;
    } else if (this.percentage >= 20) {
      return 1;
    } else {
      return 0;
    }
  }
}