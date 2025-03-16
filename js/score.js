/*document.addEventListener("DOMContentLoaded", function () {
    loadScores();
});
*/
function showScore() {
    // Ocultar el canvas y el menú, mostrar la sección de puntajes
    canvas.style.display = "none";
    document.getElementById("scoreSection").style.display = "flex";
    document.getElementById("menu").style.display = "none";

    // Cargar los puntajes
    loadScores();
}

function loadScores() {
    const players = JSON.parse(localStorage.getItem("players")) || {};

    // Convertir el objeto de jugadores en un array para ordenarlos
    const scoresArray = Object.keys(players).map(playerName => {
        return {
            name: playerName,
            score: players[playerName].score,
            date: players[playerName].date
        };
    });

    // Ordenar los puntajes de mayor a menor
    scoresArray.sort((a, b) => b.score - a.score);

    // Mostrar los puntajes en la tabla
    const scoreTableBody = document.getElementById("scoreTableBody");
    scoreTableBody.innerHTML = "";  // Limpiar la tabla antes de agregar nuevos puntajes

    // Agregar cada jugador y su puntaje a la tabla
    scoresArray.forEach(player => {
        const row = document.createElement("tr");

        const nameCell = document.createElement("td");
        nameCell.textContent = player.name;
        row.appendChild(nameCell);

        const dateCell = document.createElement("td");
        dateCell.textContent = player.date;
        row.appendChild(dateCell);

        const scoreCell = document.createElement("td");
        scoreCell.textContent = player.score;
        row.appendChild(scoreCell);

        scoreTableBody.appendChild(row);  // Agregar la fila a la tabla
    });
}


function closeScore() {
    document.getElementById("scoreSection").style.display = "none";

    
    document.getElementById("menu").style.display = "flex"; // Mostrar el menú
    const canvas = document.getElementById("gameCanvas");
    canvas.style.display = "block";
}
