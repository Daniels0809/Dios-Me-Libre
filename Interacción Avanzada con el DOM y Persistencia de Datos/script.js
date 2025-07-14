// Evento guardar datos en el Local Storage
document.getElementById('saveButton').addEventListener('click', () => {
    const nameInput = document.getElementById('name');
    const ageInput = document.getElementById('age');

    if (!nameInput || !ageInput) {
        console.error("Los elementos del formulario no existen");
        return;
    }

    const name = nameInput.value.trim();
    const age = parseInt(ageInput.value);

    if (name && !isNaN(age)) {
        localStorage.setItem('userName', name);
        localStorage.setItem('userAge', age);
        displayData();
    } else {
        alert('Por favor, ingresa un nombre válido y una edad numérica.');
    }
});

// Función para mostrar los datos almacenados
function displayData() {
    const name = localStorage.getItem('userName');
    const age = localStorage.getItem('userAge');
    const outputDiv = document.querySelector('.output');

    if (name && age) {
        outputDiv.textContent = `Hola ${name}, tienes ${age} años.`;
    } else {
        outputDiv.textContent = `No hay datos almacenados.`;
    }
}

// Mostrar contador de interacciones al cargar
function showInteractionCountOnLoad() {
    const count = sessionStorage.getItem('interactionCount') || 0;
    const interactionDiv = document.getElementById('interactionCountDisplay');
    interactionDiv.textContent = `Interacciones en esta sesión: ${count}`;
}

// Inicializar contador de interacciones en Session Storage
if (!sessionStorage.getItem('interactionCount')) {
    sessionStorage.setItem('interactionCount', 0);
}

// Actualizar contador de interacciones
function updateInteractionCount() {
    let count = parseInt(sessionStorage.getItem('interactionCount'));
    count++;
    sessionStorage.setItem('interactionCount', count);

    const interactionDiv = document.getElementById('interactionCountDisplay');
    interactionDiv.textContent = `Interacciones en esta sesión: ${count}`;
}

// Asignar eventos al contador
document.getElementById('saveButton').addEventListener('click', updateInteractionCount);
document.getElementById('clearButton').addEventListener('click', updateInteractionCount);

// Evento para limpiar los datos del Local Storage
document.getElementById('clearButton').addEventListener('click', () => {
    localStorage.clear();
    displayData();
});

// Al cargar la página
window.onload = () => {
    displayData();
    showInteractionCountOnLoad();
    
};
