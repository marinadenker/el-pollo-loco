let level1;

/** This function initializes Level 1 */
function initLevel(){
    
     level1 = new Level([
        new Chicken(0),
        new Chicken(1),
        new Chicken(2),
        new Endboss()
    ], [
        new Cloud(0),
        new Cloud(500),
        new Cloud(1000),
        new Cloud(1500),
        new Cloud(2000),
        new Cloud(2500),
        new Cloud(3000)
    ], [
        
        new BackgroundObject('img/5_background/layers/air.png', 720 * -1, 0),
        new BackgroundObject('img/5_background/layers/3_third_layer/2.png', 720 * -1, 0),
        new BackgroundObject('img/5_background/layers/2_second_layer/2.png', 720 * -1, 0),
        new BackgroundObject('img/5_background/layers/1_first_layer/2.png', 720 * -1, 0),

        new BackgroundObject('img/5_background/layers/air.png', 0, 0),
        new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 720 * 0, 0),
        new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 720 * 0, 0),
        new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 720 * 0, 0),

        new BackgroundObject('img/5_background/layers/air.png', 720 * 1, 0),
        new BackgroundObject('img/5_background/layers/3_third_layer/2.png', 720 * 1, 0),
        new BackgroundObject('img/5_background/layers/2_second_layer/2.png', 720 * 1, 0),
        new BackgroundObject('img/5_background/layers/1_first_layer/2.png', 720 * 1, 0),
        
        new BackgroundObject('img/5_background/layers/air.png', 720 * 2, 0),
        new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 720 * 2, 0),
        new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 720 * 2, 0),
        new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 720 * 2, 0),

        new BackgroundObject('img/5_background/layers/air.png', 720 * 3, 0),
        new BackgroundObject('img/5_background/layers/3_third_layer/2.png', 720 * 3, 0),
        new BackgroundObject('img/5_background/layers/2_second_layer/2.png', 720 * 3, 0),
        new BackgroundObject('img/5_background/layers/1_first_layer/2.png', 720 * 3, 0)
    ], 
    [
        new Coin(0),
        new Coin(1),
        new Coin(2),
        new Coin(3),
        new Coin(4),
        new Coin(5),
        new Coin(6),
        new Coin(7)
    ],
      [
        new Bottle(0, 'img/6_salsa_bottle/1_salsa_bottle_on_ground.png'),
        new Bottle(1, 'img/6_salsa_bottle/1_salsa_bottle_on_ground.png'),
        new Bottle(2, 'img/6_salsa_bottle/1_salsa_bottle_on_ground.png'),
        new Bottle(3, 'img/6_salsa_bottle/2_salsa_bottle_on_ground.png'),
        new Bottle(4, 'img/6_salsa_bottle/2_salsa_bottle_on_ground.png')
    ],
);
}