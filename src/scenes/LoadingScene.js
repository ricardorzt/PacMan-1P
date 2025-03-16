export default class LoadingScene extends Phaser.Scene {
    constructor() {
        super({ key: "LoadingScene" });
    }

    init(data) {
        this.score = data.score || 0; // Recibe el puntaje o usa 0 si no hay dato
        this.lives = data.lives || 0;
    }

    create() {
        // Ocultar el canvas de Phaser
        document.getElementById("container").style.display = "none";

        // Crear la imagen de carga en el DOM
        let loadingImg = document.createElement("img");
        loadingImg.src = "../assets/loading.png"; 
        loadingImg.style.position = "absolute";
        loadingImg.style.top = "40%";
        loadingImg.style.left = "50%";
        loadingImg.style.transform = "translate(-50%, -50%)";
        loadingImg.style.width = "800px"; 
        loadingImg.style.height = "auto";
        loadingImg.id = "loadingScreen";


        document.body.appendChild(loadingImg);

      
        setTimeout(() => {
   
            if (document.getElementById("loadingScreen")) {
                document.body.removeChild(document.getElementById("loadingScreen"));
            }

   
            document.getElementById("container").style.display = "block";


            
            this.scene.start("Secondscene", { score: this.score, lives: this.lives }); 
            
        }, 3000);
    }
}
