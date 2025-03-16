import Ghost from './Ghost.js';
import PlayerPellet from './PlayerPellet.js'; 
import EnemyPellet from './EnemyPellet.js';   

export default class Track {
    constructor(scene, id, trackY) {
        this.scene = scene;
        this.id = id;
        this.y = trackY;

        this.cherry = scene.physics.add.image(1024, trackY - 10, 'cherry').setOrigin(1, 1);
   

        // ✅ Grupos de proyectiles
        this.playerProjectiles = scene.physics.add.group({
            frameQuantity: 8,
            key: 'sprites',
            frame: 'pellet',
            active: false,
            visible: false,
            classType: PlayerPellet 
        });

        this.enemyProjectiles = scene.physics.add.group({
            frameQuantity: 8,
            key: 'sprites',
            frame: 'enemy-pellet',
            active: false,
            visible: false,
            classType: EnemyPellet 
        });

        // ✅ Colisiones
        this.projectileCollider = scene.physics.add.overlap(this.playerProjectiles, this.enemyProjectiles, this.hitProjectile, null, this);
      

        this.releaseTimer1;
        this.releaseTimer2;
    }

    start(minDelay, maxDelay) {
        const delay1 = Phaser.Math.Between(minDelay, maxDelay);
        
        this.releaseTimer1 = this.scene.time.addEvent({
            delay: delay1,
            callback: () => {
                console.log("👻 Creando y activando primer fantasma en pista", this.id);
                

                this.ghost1 = new Ghost(this.scene, this);
                this.scene.physics.add.existing(this.ghost1);
                this.ghost1.start();

                this.ghost1Collider = this.scene.physics.add.overlap(this.ghost1, this.playerProjectiles, this.hitGhost, null, this);
    
                const delay2 = Phaser.Math.Between(2000, 4000);
                this.releaseTimer2 = this.scene.time.addEvent({
                    delay: delay2,
                    callback: () => {
                        this.ghost2 = new Ghost(this.scene, this);
                        this.scene.physics.add.existing(this.ghost2);
                        this.ghost2.start();
    
                        this.ghost2Collider = this.scene.physics.add.overlap(this.ghost2, this.playerProjectiles, this.hitGhost, null, this);
                    }
                });
            }
        });
    }

    stop() {
        if (this.ghost1) {
            this.ghost1.stop();

        }
    
        if (this.ghost2) {
            this.ghost2.stop();
        }

        for (let projectile of this.playerProjectiles.getChildren()) {
            projectile.stop();
        }

        for (let projectile of this.enemyProjectiles.getChildren()) {
            projectile.stop();
        }

    
        this.releaseTimer1.remove();
        this.releaseTimer2.remove();
       
    }

    hitProjectile(ball1, ball2) {
        ball1.stop();
        ball2.stop();
    }

    hitGhost(ghost, projectile) {
        if (ghost.isAlive && ghost.x > 0) {
            projectile.stop();
            ghost.hit();
        }
    }

    throwPlayerProjectile(x) {
        let projectile = this.playerProjectiles.getFirstDead(false);
        if (projectile) {
            projectile.fire(x, this.y);
        }
    }

    throwEnemyProjectile(x) {
        let projectile = this.enemyProjectiles.getFirstDead(false);
        if (projectile) {
            projectile.fire(x, this.y);
        }
    }
}
