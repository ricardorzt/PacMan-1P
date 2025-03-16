
export default class PauseScene extends Phaser.Scene {
    constructor() {
        super({ key: "PauseScene" });
    }

    create() {
      

        this.input.keyboard.once("keydown-P", () => {
            let secondScene = this.scene.get("Secondscene");
            this.scene.resume("Secondscene"); 
            secondScene.isPaused = false;
            secondScene.pauseText.setVisible(false);
            secondScene.loopSound.resume();
            this.scene.stop();
        });
    }
}
