export default class PlayerPellet extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'pellet'); 

        this.setScale(0.5);
    }

    fire(x, y) {
        this.body.enable = true;
        this.body.reset(x + 10, y - 20);

        this.setActive(true);
        this.setVisible(true);

        this.setVelocityX(-600); 
        this.setAccelerationX(-1400); 
    }

    stop() {
        this.setActive(false);
        this.setVisible(false);

        this.setVelocityX(0);
        this.body.enable = false;
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        if (this.x <= -64) { 
            this.stop();
        }
    }
}
