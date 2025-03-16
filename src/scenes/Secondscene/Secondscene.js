import Track from './Track.js';
import Player from './Player.js';

export default class Secondscene extends Phaser.Scene {
    constructor() {
        super({ key: "Secondscene" });

        this.player;
        this.tracks;

        this.score;
        this.timer;
    
        this.scoreTimer;
        this.scoreText;
        this.timeText;

        this.currentPlayer =  localStorage.getItem("currentPlayer") || null;

    }

    init(data) {
        this.score = 0;
        this.score = data.score || 0; // Recibe el puntaje o usa 0 si no hay dato
        this.lives = 3;
        this.lives = data.lives || 0;

    }
   

    preload() {      
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

        this.load.spritesheet('ghost-scared', '../assets/ghost-scared-sprite.png', {
            frameWidth: 40,
            frameHeight: 40
        });
        

        // Cargar fantasmas de diferentes colores
        this.load.image('ghost-red', '../assets/red-ghost-right.png');
        this.load.image('ghost-cyan', '../assets/cyan-ghost-right.png');
        this.load.image('ghost-pink', '../assets/pink-ghost-right.png');
        this.load.image('ghost-yellow', '../assets/yellow-ghost-right.png');
        this.load.image('cherry', '../assets/pixel-fruit-cherry.png');
        this.load.image('livesIcon', '../assets/lives-icon.png');

        // Cargar proyectiles (pellets)
        this.load.image('pellet', '../assets/pixel-fruit-apple.png');
        this.load.image('enemy-pellet', '../assets/enemy-pellet.png');

        // Cargar otros elementos del HUD
        //this.load.image('overlay', 'assets/overlay.png');
        this.load.image('gameover', '../assets/game-over.jpg');

        this.load.bitmapFont('pixel', '../assets/fonts/bitmap/minogram_6x10.png', '../assets/fonts/bitmap/minogram_6x10.xml');

           //audio
           this.load.audio('throw','../assets/audio/throw.wav');
           this.load.audio('pain','../assets/audio/pain.wav');
           this.load.audio('death2', '../assets/audio/death_0.wav');
           this.load.audio('eat', '../assets/audio/eat_fruit.wav');
           this.load.audio('win', '../assets/audio/win.wav');
           this.load.audio('loop2', '../assets/audio/level2Song.wav');
           this.load.audio('damage2', '../assets/audio/damage.wav');
           this.load.audio('victory', '../assets/audio/finallyVictory.wav');
    }

    create() {

        this.timer = 0;
        this.isPaused = false; // Estado de pausa
        this.isMusicPlaying = false; 
        this.gameStarted = false;

        this.input.keyboard = this.input.keyboard || this.input.keyboard.createCursorKeys();

        this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P).on("down", () => {
            this.togglePause();
        });
        
        this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M).on("down", () => {
            this.toggleMusic();
        });

        this.physics.world.gravity.y = 0;
        this.scale.setGameSize(1024, 748);


        this.startText = this.add.bitmapText(500, 350, 'pixel', "Press any key to start", 20).setOrigin(0.5);
        this.input.keyboard.once('keydown', this.start, this);


        // Crear las pistas de movimiento con los fantasmas incluidos en Track.js
        this.tracks = [
            new Track(this, 0, 196),
            new Track(this, 1, 376),
            new Track(this, 2, 536),
            new Track(this, 3, 700)
        ];

        const graphics = this.add.graphics();
        graphics.lineStyle(4, 0x3b50ff, 1); 

        for (let i = 0; i < this.tracks.length; i++) {
            let y = this.tracks[i].y - 90; 
            graphics.strokeLineShape(new Phaser.Geom.Line(0, y, 1024, y));
        }

        // Crear el jugador (Pac-Man)
        this.player = new Player(this, this.tracks[0]);

        // UI
        //this.add.image(0, 0, 'overlay').setOrigin(0);
        //this.add.image(16, 0, 'sprites', 'panel-score').setOrigin(0);
        //this.add.image(1024 - 16, 0, 'sprites', 'panel-best').setOrigin(1, 0);

          
        this.displayLives = [];

        // Crear solo las vidas que quedan
        for (let i = 0; i < this.lives; i++) {
            // Aquí, 870, 900, 930 son las posiciones en x, ajusta la distancia entre las vidas
            let vida = this.add.image(870 + (i * 30), 55, 'livesIcon');
            this.displayLives.push(vida);  // Agrega cada vida a la lista
        }

          //Sonidos
          this.loopSound=this.sound.add("loop2");
          this.loopSound.volume = 0.6;
          this.loopSound.loop = true;
          
              //background
              this.winSound=this.sound.add('win');
              this.eatSound=this.sound.add('eat');
              this.deathSound=this.sound.add('death2');
              this.damageSound =this.sound.add('damage2');
              this.damageSound.volume = 8;

        this.scoreText = this.add.bitmapText(140, 45, 'pixel', "Score: " + this.score, 20);
        this.timerText = this.add.bitmapText(40, 45, 'pixel', "Timer: " + this.timer, 20);
 
        //Alias
        this.aliasText = this.add.bitmapText(415, 45, 'pixel', "Username: " + this.currentPlayer, 20);


        //Pausa
        this.pauseText = this.add.bitmapText(500, 350, 'pixel', "GAME PAUSED", 30).setOrigin(0.5);
        this.pauseText.setVisible(false);

    }

    start() {

        this.input.keyboard.removeAllListeners();

        if (this.gameStarted) return; // Si ya inició, no hacer nada

        this.gameStarted = true;
        this.startText.destroy(); // Ocultar el mensaje de inicio
        

        this.loopSound.play(); 
        
        // Animación para ocultar el panel de controles
        this.tweens.add({
            targets: this.infoPanel,
            y: 700,
            alpha: 0,
            duration: 500,
            ease: 'Power2'
        });

        // Iniciar el jugador
        this.player.start();

        // Iniciar las pistas con tiempos diferentes
        this.tracks[0].start(2000, 6000);
        this.tracks[1].start(500, 1000);
        this.tracks[2].start(4000, 7000);
        this.tracks[3].start(6000, 10000);

        this.scoreTimer = this.time.addEvent({
            delay: 1000,
            callback: () => {
                this.score+= 5;
                this.scoreText.setText("Score: " + this.score);
                this.timer++;
                this.timerText.setText("Time: " + this.timer);
                
                if(this.timer === 100){
                    this.win();
                }

            },
            callbackScope: this,
            loop: true
        });
    }

    togglePause() {
        this.isPaused = !this.isPaused;
    
        if (this.isPaused) {
            this.pauseText.setVisible(true);
            this.loopSound.pause(); // Pausar la música
            this.scene.launch("PauseScene"); 
            this.scene.pause();
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

    win(){

        /*this.time.delayedCall(3000, () => {
                // Detener todas las pistas (y por lo tanto, los fantasmas)
            
            });

            this.tracks.forEach((track) => {
                track.stop();
            });*/

            // Detener sonidos
            this.loopSound.pause();
            //this.sound.play('gameover');

            // Detener jugador
            this.player.stop();

            // Detener el contador de puntaje
            this.scoreTimer.destroy();

            this.physics.pause();

            this.sound.play('victory');

        this.time.delayedCall(7000, () => {
            this.scene.launch("WinScene", { score: this.score });
            this.score = 0;
            this.timer = 0;
            this.scene.stop('Secondscene');
        });

    }

    gameOver() {

        //this.add.image(512, 384, 'gameover').setOrigin(0.5, 0.5);

        this.tweens.add({
            targets: this.infoPanel,
            y: 384,
            alpha: 1,
            duration: 500,
            ease: 'Power2'
        });

        // Detener todas las pistas (y por lo tanto, los fantasmas)
        this.tracks.forEach((track) => {
            track.stop();
        });

        // Detener sonidos
        this.loopSound.pause();
        //this.sound.play('gameover');

        // Detener jugador
        this.player.stop();

        // Detener el contador de puntaje
        this.scoreTimer.destroy();

        this.physics.pause();

        this.deathSound.play();

        this.time.delayedCall(3000, () => {
            this.scene.launch("GameoverScene", { score: this.score });
            this.score = 0;
            this.timer = 0;
            this.scene.stop('Secondscene');
        });
    }

   
}
