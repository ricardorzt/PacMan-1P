import Firstscene from "./scenes/Firstscene.js"; // Importamos la escena principal


import Secondscene from "./scenes/Secondscene/Secondscene.js"
import PauseScene from "./scenes/PauseScene.js";
import LoadingScene from "./scenes/LoadingScene.js";
import GameoverScene from "./scenes/GameoverScene.js";
import WinScene from "./scenes/WinScene.js";

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: "container",
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    /* type: Phaser.AUTO,
    width: 1024,
    height: 768,
    backgroundColor: '#000',
    parent: "container",
    physics: {
        default: 'arcade',
        arcade: { debug: false }
    }, */
    scene: [Firstscene, Secondscene,PauseScene, LoadingScene, GameoverScene, WinScene] // Mantener solo `Secondscene`

};

const game = new Phaser.Game(config);
