import Player from "./Player.js";


export default class Ghost extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, track) {
        // Lista de colores de fantasmas disponibles
        const ghostColors = ['ghost-red', 'ghost-cyan', 'ghost-pink', 'ghost-yellow'];
        const randomGhost = Phaser.Math.RND.pick(ghostColors); // Selecciona un color al azar
        const x = 15; // Posición inicial aleatoria dentro del rango de la pista

        super(scene, x, track.y, randomGhost); // ✅ Usa la imagen correcta del fantasma

        this.setOrigin(0.5, 1);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.body.setSize(50, 50);
        this.body.setOffset(0, 0);

        this.time = scene.time;
        this.sound = scene.sound;

        this.isAlive = true;
        this.isThrowing = false;
        this.speed = 90; // Velocidad aleatoria para cada fantasma

        this.currentTrack = track;
        this.ghostColor = randomGhost; // Almacena el color del fantasma

        // Movimiento inicial
        this.setVelocityX(this.speed);
        this.direction = 1; // 1 = derecha, -1 = izquierda

        this.createAnimations(scene);
    }

    createAnimations(scene) {
        this.anims.create({
            key: 'ghost-scared-anim',
            frames: this.anims.generateFrameNumbers('ghost-scared', { start: 0, end: 1 }), 
            frameRate: 6, 
            repeat: -1 
        });
    }

    start() {
        this.isAlive = true;
        this.isThrowing = false;

        this.y = this.currentTrack.y;
        this.previousAction = 0;

        this.setActive(true);
        this.setVisible(true);

        // Velocidad inicial
        this.setVelocityX(this.speed * this.direction);

        this.chooseEvent = this.time.delayedCall(Phaser.Math.Between(3000, 5000), this.chooseAction, [], this);
        
        
    }

    chooseAction ()
    {
        if(!this.isAlive){
            this.anims.stop();
            this.setTexture(this.ghostColor);
        }
        //  In case it was disabled by a hit
        this.isAlive = true;
        this.body.enable = true;

        this.setVelocityX(0);

        //  0 - 50 = Throw snowball
        //  51 - 60 = Idle
        //  61 - 100 = Walk 
        const t = Phaser.Math.Between(0, 100);

        if (t < 50)
        {
            //  If it threw last time, we don't throw again
            if (this.previousAction === 2)
            {
                this.walk();
            }
            else
            {
                this.throw();
            }
        }
        else if (t > 60)
        {
            this.walk();
        }
        else
        {
            //  If it was idle last time, we don't go idle again
            if (this.previousAction === 1)
            {
                if (t > 55)
                {
                    this.walk();
                }
                else
                {
                    this.throw();
                }
            }
            else
            {
                this.goIdle();
            }
        }
    } 
    walk() {
        if (!this.isAlive) return;

        this.previousAction = 0;

        this.setVelocityX(this.speed * this.direction);

        this.chooseEvent = this.time.delayedCall(Phaser.Math.Between(3000, 6000), this.chooseAction, [], this);
    }

    goIdle ()
    {
        this.previousAction = 1;

//        this.play('snowmanIdle' + this.size, true);

        this.chooseEvent = this.time.delayedCall(Phaser.Math.Between(2000, 4000), this.chooseAction, [], this);
    }

    throw() {
        if (!this.isAlive || this.isThrowing) return;
    
        this.previousAction = 2;
        this.isThrowing = true;
    
    
        this.scene.time.delayedCall(500, () => {
            if (this.isAlive) {
                this.releaseProjectile();
            }
        });
    
        this.scene.time.delayedCall(2000, () => {
            this.isThrowing = false;
        });
    
        this.chooseEvent = this.time.delayedCall(Phaser.Math.Between(2000, 4000), this.chooseAction, [], this);
    }
    

    releaseProjectile() {
        if (!this.isAlive) {
            return;
        }
        this.currentTrack.throwEnemyProjectile(this.x);
    }

    throwComplete ()
    {
        if (!this.isAlive)
        {
            return;
        }

        this.isThrowing = false;

        this.chooseEvent = this.time.delayedCall(Phaser.Math.Between(2000, 4000), this.chooseAction, [], this);
    }


    hit() {
        this.scene.sound.play('pain');
        if (this.chooseEvent) {
            this.chooseEvent.remove();
        }

        this.play('ghost-scared-anim');
    
        this.isAlive = false;
       // this.sound.play('hit-ghost');

        this.body.stop();
        this.body.enable = false;

        const knockback = '-=' + Phaser.Math.Between(100, 200).toString();

        this.scene.tweens.add({
            targets: this,
            x: knockback,
            ease: 'sine.out',
            duration: 1000,
            onComplete: () => {
                if (this.x < 30)
                    {
                        this.x = 10;
                    }
            }
        });

        this.chooseEvent = this.time.delayedCall(Phaser.Math.Between(1000, 3000), this.chooseAction, [], this);
    }

    stop() {
        if (this.chooseEvent) {
            this.chooseEvent.remove();
        }

        this.isAlive = false;
        this.setVelocityX(0);
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        if (this.x >= 880) {
            this.stop();
            let secondScene = this.scene.scene.get("Secondscene"); 
    
            if (secondScene.lives > 1) {
                secondScene.lives--;

                if(secondScene.score >= 20){
                    secondScene.score -= 20;
                } else{
                    secondScene.score = 0;
                }

               if(secondScene.timer >= 20){
                    secondScene.timer -= 20;
                } else{
                    secondScene.timer = 0;
                }
                
                secondScene.timerText.setText("Time: " + secondScene.timer);

                
                secondScene.scoreText.setText("Score: " + secondScene.score);
                if (secondScene.lives >= 0 && secondScene.lives < secondScene.displayLives.length) {
                    secondScene.displayLives[secondScene.lives].destroy();  // Asegúrate de que el índice sea válido
                }
            } else {
                secondScene.lives--;
                if(secondScene.score >= 20){
                    secondScene.score -= 20;
                } else{
                    secondScene.score = 0;
                }

               if(secondScene.timer >= 20){
                    secondScene.timer -= 20;
                } else{
                    secondScene.timer = 0;
                }
                
                secondScene.timerText.setText("Time: " + secondScene.timer);
                
                secondScene.scoreText.setText("Score: " + secondScene.score);
                if (secondScene.lives >= 0 && secondScene.lives < secondScene.displayLives.length) {
                    secondScene.displayLives[secondScene.lives].destroy();  // Asegúrate de que el índice sea válido
                }
                secondScene.gameOver();
            }
        
        }
    }
}