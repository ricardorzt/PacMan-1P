export default class EnemyPellet extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'enemy-pellet'); // Ahora usa el nuevo sprite

        this.setScale(0.5);
    }

    fire(x, y) {
        this.body.enable = true;
        this.body.reset(x + 10, y - 20);

        this.setActive(true);
        this.setVisible(true);

        this.setVelocityX(200); // Velocidad de disparo
    }

    stop() {
        this.setActive(false);
        this.setVisible(false);

        this.setVelocityX(0);

        this.body.enable = false;
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);
    
        // Si el proyectil sale de la pantalla
        if (this.x >= 990) {
            this.stop();
            this.scene.sound.play('damage2');
            let secondScene = this.scene.scene.get("Secondscene"); 
    
            if (secondScene.lives > 1) {
                
                secondScene.lives--;
                if(secondScene.score >= 15){
                    secondScene.score -= 15;
                } else{
                    secondScene.score = 0;
                }

                if(secondScene.timer >= 15){
                    secondScene.timer -= 15;
                } else{
                    secondScene.timer = 0;
                }
                
                secondScene.scoreText.setText("Score: " + secondScene.score);
                 
                secondScene.timerText.setText("Time: " + secondScene.timer);
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