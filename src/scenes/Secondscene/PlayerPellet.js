export default class PlayerPellet extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'pellet'); // Ahora usa el sprite de pellet del jugador

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

        // Si el proyectil sale de la pantalla, lo desactiva
        if (this.x <= -64) { // Cambiado para que desaparezca al llegar al borde derecho
            this.stop();
        }
    }
}
