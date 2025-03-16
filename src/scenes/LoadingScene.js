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
        loadingImg.src = "../assets/loading.png"; // Ruta de la imagen
        loadingImg.style.position = "absolute";
        loadingImg.style.top = "40%";
        loadingImg.style.left = "50%";
        loadingImg.style.transform = "translate(-50%, -50%)";
        loadingImg.style.width = "800px"; // Ajusta el tamaño
        loadingImg.style.height = "auto";
        loadingImg.id = "loadingScreen";

        // Agregar la imagen al `body`
        document.body.appendChild(loadingImg);

        // Esperar 3 segundos y luego cambiar a la siguiente escena
        setTimeout(() => {
            // Remover la imagen del DOM
            if (document.getElementById("loadingScreen")) {
                document.body.removeChild(document.getElementById("loadingScreen"));
            }

            // Mostrar de nuevo el canvas de Phaser
            document.getElementById("container").style.display = "block";


            // Cambiar a la escena del juego
            this.scene.start("Secondscene", { score: this.score, lives: this.lives }); 
            
        }, 3000);
    }
}
