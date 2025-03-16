class Firstscene extends Phaser.Scene {
    constructor() {
        super({ key: "Firstscene" });
        this.isPaused = false; // Estado de pausa
        this.isMusicPlaying = false; 
        this.gameStarted = false;
        this.currentPlayer =  localStorage.getItem("currentPlayer") || null;
    }

    preload() {
       
       
        this.input.keyboard.on("keydown-P", this.togglePause, this); 
        this.input.keyboard.on("keydown-M", this.toggleMusic, this); 


        this.load.image('background', '../assets/background.png');
        this.load.image('ground', '../assets/platform.png');
        this.load.image('star', '../assets/strawberry.png');
        this.load.image('ghost', '../assets/ghost.png');
        this.load.image('ghost2', '../assets/ghost4.png');
        this.load.image('ghost3', '../assets/ghost3.png');
        this.load.image('ghost4', '../assets/ghost2.png');
        this.load.image('orange', '../assets/orange.png');
        this.load.image('cherry', '../assets/cherry.png');
        this.load.image('livesIcon', '../assets/lives-icon.png');
        //this.load.spritesheet('death', '../assets/pacman-death.png', { frameWidth: 48, frameHeight: 48 });
        //this.load.spritesheet('pacman', 'assets/pacman_sprite.png', { frameWidth: 50, frameHeight: 49 });
        // Recuperar el personaje seleccionado desde localStorage
        const selectedCharacter = localStorage.getItem("selectedCharacter");

        // Definir la ruta de la imagen según el personaje seleccionado
        let characterImagePath = 'assets/';

        // Dependiendo del personaje seleccionado, asignar el path adecuado
        if (selectedCharacter === 'ms-pacman-full.png') {
            characterImagePath += 'ms-pacman-full.png'; // Si se seleccionó "mspacman.png"
        } else if (selectedCharacter === 'pacman-full.png') {
            characterImagePath += 'pacman-full.png'; // Si se seleccionó "pacman_sprite.png"
        } else {
            characterImagePath += 'pacman-full.png'; // Por defecto si no se encuentra la selección
        }

        // Cargar el sprite adecuado usando la ruta dinámica
        this.load.spritesheet('pacman', characterImagePath, { frameWidth: 48, frameHeight: 48 });

        this.load.bitmapFont('pixel', 'assets/fonts/bitmap/minogram_6x10.png', '../assets/fonts/bitmap/minogram_6x10.xml');

        //audio
        this.load.audio('death', '../assets/audio/death_0.wav');
        this.load.audio('eat', '../assets/audio/eat_fruit.wav');
        this.load.audio('win', '../assets/audio/win.wav');
        this.load.audio('loop', '../assets/audio/level1Song.wav');
        this.load.audio('damage', '../assets/audio/damage.wav');
      
    }



    create() {

        this.getCurrentPlayer;

        this.isPaused = false; // Estado de pausa
        this.isMusicPlaying = false; 
        this.gameStarted = false;


        this.add.image(400, 300, 'background');

        // Crear plataformas
        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();
        this.platforms.create(600, 400, 'ground');
        this.platforms.create(50, 250, 'ground');
        this.platforms.create(750, 220, 'ground');

        this.physics.world.setBounds(35, 25, 730, 550);

        // Crear jugador
        this.player = this.physics.add.sprite(100, 450, 'pacman');
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);
        this.lives=3;

        //vidas
        const vida1=this.add.image(660, 55, 'livesIcon');
        const vida2=this.add.image(690, 55, 'livesIcon');
        const vida3=this.add.image(720, 55, 'livesIcon');
        this.displayLives=[vida1, vida2,vida3];


        // Animaciones del jugador
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('pacman', { start: 0, end: 1 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [{ key: 'pacman', frame: 2 }],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('pacman', { start: 3, end: 4 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'death',
            frames: this.anims.generateFrameNumbers('pacman', { start: 5, end: 16 }),
            frameRate: 6,
            repeat: -0
        });

        // Controles
        this.cursors = this.input.keyboard.createCursorKeys();

        //Sonidos
        this.loopSound=this.sound.add("loop");
        this.loopSound.volume = 0.3;
        this.loopSound.loop = true;
        
            //background
            this.winSound=this.sound.add('win');
            this.loopSound.volume = 1;
            this.eatSound=this.sound.add('eat');
            this.deathSound=this.sound.add('death');
            this.damageSound =this.sound.add('damage');
            this.damageSound.volume = 7;

        // Crear estrellas
        this.stars = this.physics.add.group({
            key: 'star',
            repeat: 9,
            setXY: { x: 50, y: 0, stepX: 75 }
        });

        this.stars.children.iterate(child => {
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        });

        // Bombas
        this.bombs = this.physics.add.group();
        this.cantBombs = 0;

        //Estrella especial
        this.special=this.physics.add.group();
        this.cantSpecial = 0;
        this.isSpecial=false;
        this.specialTime=0;
        this.specialMsg='';


        // Puntuación
        this.score = 0;
        this.gameOver = false;

        this.scoreText = this.add.bitmapText(70, 45, 'pixel', "score: 0", 20);
      
        //Alias
        this.aliasText = this.add.bitmapText(315, 45, 'pixel', "Username: " + this.currentPlayer, 20);

        //timer
        this.timerGlobal=null;
        this.timeRemaining=0;
        this.timerText=this.add.bitmapText(300, 70, 'pixel', "time remaining: ", 20);
        this.timerText.setVisible(false);

        //Pausa
        this.pauseText = this.add.bitmapText(400, 300, 'pixel', "GAME PAUSED", 30).setOrigin(0.5);
        this.pauseText.setVisible(false);

        // Colisiones
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.stars, this.platforms);
        this.physics.add.collider(this.bombs, this.platforms);
        this.physics.add.collider(this.special, this.platforms);
        this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);
        this.physics.add.collider(this.player, this.bombs, this.hitBomb, null, this);
        this.physics.add.collider(this.player, this.special, this.collectSpecial, null, this);

         // Mostrar el mensaje "Press any key to start"
         this.startText = this.add.bitmapText(400, 300, 'pixel', "Press any key to start", 20).setOrigin(0.5);
        
         // Esperar que el jugador presione una tecla para iniciar el juego
         this.input.keyboard.once('keydown', this.startGame, this);

    }

    startGame() {
        if (this.gameStarted) return; // Si ya inició, no hacer nada

        this.gameStarted = true;
        this.startText.destroy(); // Ocultar el mensaje de inicio
        

        this.loopSound.play();
  
    }


    update() {
        if (this.gameOver) {
            return;
        

        }

        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-160);
            this.player.anims.play('left', true);

        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(160);
            this.player.anims.play('right', true);

        } else {
            this.player.setVelocityX(0);
            this.player.anims.play('turn');

        }
        
        

        if (this.cursors.up.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(-330);
        }

        if(this.isSpecial){
            this.timeRemaining=(this.timerGlobal.getRemainingSeconds()).toFixed(3);
            this.timerText.setText("time remaining´: "+ this.timeRemaining);
            this.timerText.setVisible(true);
        }else{
            this.timerText.setVisible(false);
        }
    }

    collectStar(player, star) {
        star.disableBody(true, true);

        // Actualizar puntuación
        this.score += 10;

        this.scoreText.setText("score: " + this.score);

        this.eatSound.play();

        if (this.stars.countActive(true) === 0) {
            // Restaurar estrellas
            this.stars.children.iterate(child => {
                child.enableBody(true, child.x, 0, true, true);
            });

            if(this.cantBombs==4){
                this.win();
            }

            var x = (this.player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
            var bombKey = ['ghost', 'ghost2', 'ghost3', 'ghost4'][this.cantBombs] || 'ghost4';

            var bomb = this.bombs.create(x, 16, bombKey);
            this.cantBombs++;

            bomb.setBounce(1);
            bomb.setCollideWorldBounds(true);
            bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
            bomb.allowGravity = false;
        }

        if(((Math.floor(Math.random()*250))>200 && this.cantSpecial==0) && this.cantBombs>1){
            this.createSpecial('orange');
        }

        if(((Math.floor(Math.random()*450))>430 && this.cantSpecial==1)&& this.cantBombs>=3){
            this.createSpecial('cherry');
        }
    }

    createSpecial(nombre){
        var pos = (this.player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
        var specialItem= this.special.create(pos,16,nombre);
        this.cantSpecial++;
        this.isSpecial=true;

        specialItem.setBounce(1);
        specialItem.setCollideWorldBounds(true);
        specialItem.setVelocity(Phaser.Math.Between(-200, 200), 20);
        specialItem.allowGravity = false;

        var timer= this.time.addEvent({
            delay: 8000,
            callback: ()=>{
                specialItem.disableBody(true, true);
                this.isSpecial=false;
            }
        });

        this.timerGlobal=timer;
    }

    collectSpecial(player, special){
            special.disableBody(true, true);
            this.isSpecial=false;
            this.eatSound.play();
            this.score+=30;
    }
    win() {
        this.physics.pause();
        // Reproducir sonido de victoria
        this.winSound.play();
    
        // Detener todos los sonidos y música
        this.loopSound.stop();
    
        // Eliminar cualquier temporizador activo
        this.time.removeAllEvents();
    
        // Detener cualquier animación activa
        this.tweens.killAll();
        
        // Detener la escena actual


        this.time.delayedCall(5000, () => {
            this.scene.launch("LoadingScene", { score: this.score, lives: this.lives });
            this.lives = 3;
            this.score = 0;

            this.scene.stop('Firstscene');
        });
     
    }


    hitBomb(player, bomb) {
        this.damageSound.play();

        if(this.lives==1){
            this.lives--;
            this.score-=15;
            this.scoreText.setText("score: " + this.score);
            this.displayLives[this.lives].destroy();

            this.physics.pause();
            player.anims.play('death');
            this.loopSound.pause();
            this.gameOver = true;
            this.deathSound.play();

            this.time.delayedCall(3000, () => {
                this.scene.launch("GameoverScene", { score: this.score });
                this.lives = 3;
                this.score = 0;
                this.scene.stop('Firstscene');
            });
            
            
        }else{
            this.lives--;
            this.score-=15;
            this.scoreText.setText("score: " + this.score);
            this.displayLives[this.lives].destroy();
            return;
        }
        
    }

    togglePause() {
        this.isPaused = !this.isPaused;

        if (this.isPaused) {
            this.physics.world.isPaused = true; // Pausar el mundo sin detener la escena
            this.pauseText.setVisible(true);
            this.loopSound.pause(); // Pausar la música
        } else {
            this.physics.world.isPaused = false; // Reanudar el mundo
            this.pauseText.setVisible(false);
            this.loopSound.resume(); // Reanudar la música
        }
    }

    toggleMusic() {

        if (this.isMusicPlaying) {
            this.loopSound.pause(); // Pausa la música
         
        } else {
            this.loopSound.resume(); // Reanuda la música

        }
        this.isMusicPlaying = !this.isMusicPlaying;
    }

}

export default Firstscene;
