let draggedImageId = null;

// Function to allow the dragover
function allowDrop(event) {
    event.preventDefault();
}

// Function to handle the drop of the image
function drop(event) {
    event.preventDefault();
    
    // Get the id of the dragged image
    const data = event.dataTransfer.getData("text");
    const draggedImage = document.getElementById(data);

    // Store the id in the global variable
    draggedImageId = draggedImage.id;

    // Place the image inside the drop zone
    const dropZone = document.querySelector('.drop-zone');

    // Create a new image inside the drop zone
    const img = document.createElement('img');
    img.id = 'draggedImage';
    img.src = draggedImage.src;
    
    // Add the image to the drop area and hide the text
    dropZone.innerHTML = '';  // Remove the text
    dropZone.appendChild(img);  // Add the image

    // Hide the text and display the image
    document.querySelector('.drop-zone p').style.display = 'none';
}

// Function to drag the image
function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function showAlert(message) {
    const alertBox = document.getElementById("alerta");
    const alertMessage = document.getElementById("alertMessage");
    alertMessage.textContent = message;
    alertBox.style.display = "flex";
}

function closeAlert() {
    document.getElementById("alerta").style.display = "none";
}

// Function to select the character after dragging it
function selectPlayer() {
    if (!draggedImageId) {
        showAlert("You must select a character!");
        return;
    }

    // Save the selected character in localStorage
    localStorage.setItem("selectedCharacter", draggedImageId);

    // Hide the character selection area
    document.getElementById("dragDropArea").style.display = "none";

    window.location.href = "../indexJuego.html"; 
}

// Function to go back to the menu
function goBackToMenu() {
    document.getElementById("dragDropArea").style.display = "none"; // Hide character selection area
    document.getElementById("menu").style.display = "flex"; // Show the menu
    const canvas = document.getElementById("gameCanvas");
    canvas.style.display = "block"; 

    // Clear the player name text field
    document.getElementById("playerName").value = ""; 

    // Clear the selection of the select (if any is selected)
    const existingNames = document.getElementById("existingNames");
    existingNames.value = "Select an already registered player"; // Reset the existing player selection
}
