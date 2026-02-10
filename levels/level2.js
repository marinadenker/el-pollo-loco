let level2

/** This function initializes Level 2 */
function initLevel2(){
    
     level2 = new Level([
        new Chicken(0),
        new Chicken(1),
        new Chicken(2),
        new Chicken(3),
        new Chicken(4),
        new Chicken(5),
        new Chicken(6),
        new Chicken(7),
        new BabyChicken(8),
        new BabyChicken(9),
        new BabyChicken(10),
        new BabyChicken(11),
        new BabyChicken(12),
        new BabyChicken(13),
        new BabyChicken(14),
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
        new Bottle(2, 'img/6_salsa_bottle/2_salsa_bottle_on_ground.png'),
    ],
);
}