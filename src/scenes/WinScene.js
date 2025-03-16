export default class WinScene extends Phaser.Scene {
    constructor() {
        super({ key: "WinScene" });
    }

    init(data) {
        this.scoreFinal = data.score || 0; // Recibe el puntaje o usa 0 si no hay dato
    }

    preload(){
    }

    create() {
        // Ocultar el canvas de Phaser mientras se muestra la imagen de Game Over
        document.getElementById("container").style.display = "none";

        // Crear la imagen de Game Over usando DOM
        let winImg = document.createElement("img");
        winImg.src = "../assets/won.png"; // Ruta de la imagen
        winImg.style.position = "absolute";
        winImg.style.top = "40%";
        winImg.style.left = "50%";
        winImg.style.transform = "translate(-50%, -50%)";
        winImg.style.width = "800px"; // Ajusta el tamaño si es necesario
        winImg.style.height = "auto";
        winImg.id = "winScreen";
        
        document.body.appendChild(winImg);

        let scoreText = document.createElement("div");
        scoreText.innerText = `${this.scoreFinal}`;
        scoreText.style.position = "absolute";
        scoreText.style.top = "325px";
        scoreText.style.left = "1050px";
        scoreText.style.transform = "translate(-50%, -50%)";
        scoreText.style.fontSize = "56px";
        scoreText.style.color = "white";
        scoreText.style.textAlign = "center";
        scoreText.style.zIndex = "999";

        document.body.appendChild(scoreText);

        // Esperar que se presione cualquier tecla para volver al juego
        document.addEventListener('keydown', () => {
            // Remover la imagen del DOM si existe
            const winScreen = document.getElementById("winScreen");
            if (winScreen) {
                document.body.removeChild(winScreen);
            }
            // Remover el puntaje del DOM
            if (scoreText) {
                document.body.removeChild(scoreText);
            }

            this.saveScore();

            // Mostrar de nuevo el contenedor principal del juego
            document.getElementById("container").style.display = "block";


            window.location.href = "../index.html";
            this.scene.stop();
    
        });
    }

    saveScore() {
        // Obtener el jugador actual y su puntuación
        const currentPlayerName = localStorage.getItem("currentPlayer");  // Esto debe ser un string, solo el nombre
        const currentScore = this.scoreFinal; // Supón que tienes una forma de obtener el puntaje actual
    
        if (!currentPlayerName) {
            console.error("No hay un jugador seleccionado.");
            return;
        }
    
        // Obtener el array de jugadores desde localStorage, o crear uno vacío si no existe
        let players = JSON.parse(localStorage.getItem("players")) || {};
    
        // Función para formatear la fecha en formato dd-mm-yyyy
        function formatDate(date) {
            const day = ("0" + date.getDate()).slice(-2); // Asegura que el día tenga dos dígitos
            const month = ("0" + (date.getMonth() + 1)).slice(-2); // Asegura que el mes tenga dos dígitos
            const year = date.getFullYear(); // Año en formato de 4 dígitos
            return `${day}-${month}-${year}`; // Retorna la fecha en formato dd-mm-yyyy
        }
    
        // Comprobar si el jugador ya existe en el localStorage
        if (players[currentPlayerName]) {
            // Si existe, comparar la puntuación actual con la puntuación almacenada
            if (currentScore >= players[currentPlayerName].score) {
                // Si la nueva puntuación es mayor, actualizarla
                players[currentPlayerName].score = currentScore;
                players[currentPlayerName].date = formatDate(new Date()); // Actualizar la fecha sin la hora
            }
        } else {
            // Si el jugador no existe, crear un nuevo jugador con la puntuación y la fecha actual
            players[currentPlayerName] = {
                score: currentScore,
                date: formatDate(new Date()) // Guardamos la fecha sin la hora
            };
        }
    
        // Guardar el array de jugadores actualizado en localStorage
        localStorage.setItem("players", JSON.stringify(players));
    }
    
}
