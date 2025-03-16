export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, track) {
        super(scene, 900, track.y, 'pacman'); // Usa Pac-Man

        this.setOrigin(0.5, 1);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.isAlive = true;
        this.isThrowing = false;

        this.sound = scene.sound;
        this.currentTrack = track;

        // Controles
        this.spacebar = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.up = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        this.down = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        // Definir animaciones en la escena
        this.createAnimations(scene);

        this.play('idle',true); // Animación inicial
    }

    createAnimations(scene) {
        // Animación normal (Frame 0)
        scene.anims.create({
            key: 'idle',
            frames: [{ key: 'pacman', frame: 0 }],
            frameRate: 10
        });

        // Animación de lanzar bola (Frame 1)
        scene.anims.create({
            key: 'throw',
            frames: [{ key: 'pacman', frame: 1 }],
            frameRate: 10
        });

    }

    start() {
        this.isAlive = true;
        this.isThrowing = false;

        this.currentTrack = this.scene.tracks[0];
        this.y = this.currentTrack.y;

        this.play('idle', true);
    }

    moveUp() {
        if (this.currentTrack.id === 0)
            {
                this.currentTrack = this.scene.tracks[3];
            }
            else
            {
                this.currentTrack = this.scene.tracks[this.currentTrack.id - 1];
            }
    
            this.y = this.currentTrack.y;
    
           // this.sound.play('move');
    }

    moveDown() {
        if (this.currentTrack.id === 3)
            {
                this.currentTrack = this.scene.tracks[0];
            }
            else
            {
                this.currentTrack = this.scene.tracks[this.currentTrack.id + 1];
            }
    
            this.y = this.currentTrack.y;
    
            //this.sound.play('move');
    }

    throw() {
        this.isThrowing = true;

        this.play('throw'); // Cambia al frame de lanzamiento
        this.scene.sound.play('throw');

        this.scene.time.delayedCall(200, () => {
            this.isThrowing = false;
            this.play('idle'); // Vuelve al frame normal después de lanzar
        });

        // ✅ Disparar proyectil
        this.currentTrack.throwPlayerProjectile(this.x);
    }

    stop() {
        this.isAlive = false;
        this.body.stop();
        this.play('idle'); // Se queda en idle si pierde
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        if (!this.isAlive) {
            return;
        }

        if (Phaser.Input.Keyboard.JustDown(this.up)) {
            this.moveUp();
        } else if (Phaser.Input.Keyboard.JustDown(this.down)) {
            this.moveDown();
        } else if (Phaser.Input.Keyboard.JustDown(this.spacebar) && !this.isThrowing) {
            this.throw();
        }
    }
}
