function showCredits() {
    // Ocultar el menú y el canvas
    document.getElementById("menu").style.display = "none";
    canvas.style.display = "none";
    document.getElementById("dragDropArea").style.display = "none";
    
    // Mostrar la sección de créditos
    document.getElementById("creditsSection").style.display = "flex";
}
function closeCredits() {
    // Ocultar la sección de créditos
    document.getElementById("creditsSection").style.display = "none";
    document.getElementById("menu").style.display = "flex"; // Mostrar el menú
    const canvas = document.getElementById("gameCanvas");
    canvas.style.display = "block"; }
