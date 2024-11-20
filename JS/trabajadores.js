let workerCount = 0; // Contador global de trabajadores

// Función para mostrar trabajadores iniciales desde un archivo JSON
function shoWorkers() {
    fetch("BD.json")
        .then((respuesta) => {
            if (!respuesta.ok) {
                throw new Error("Error al cargar el archivo JSON");
            }
            return respuesta.json();
        })
        .then((datos) => {
            console.log("Datos cargados:", datos); // Verifica la estructura
            const usuarios = datos.TablaUsuario; // Accede al array TablaUsuario
        
            const contenedor = document.getElementById("worker-cards-container");
            usuarios.forEach((usuario, index) => {
                const div = document.createElement("div");
                div.classList.add("worker-card");
                div.id = `worker-card-${index}`;
                div.innerHTML = `
                  <span class="delete-icon" id="delete-${index}" onclick="deleteWorker(${index})">✖</span>
                  <img src="worker.png"  class="profile-pic" id="profile-pic-${index}">
                  <div class="worker-info">
                    <h2 id="worker-name-${index}">${usuario.nombre} ${usuario.apellidos}</h2>
                    <p><strong>Email:</strong> <span id="worker-email-${index}">${usuario.email}</span></p>
                    <p><strong>Teléfono:</strong> <span id="worker-phone-${index}">${usuario.numTel}</span></p>
                    <p><strong>Dirección:</strong> <span id="worker-address-${index}">${usuario.direccion}</span></p>
                  </div>
                `;
                contenedor.appendChild(div);
            });
            workerCount = usuarios.length; // Actualiza el contador
            updateWorkerCount();
        })
        .catch((error) => console.error("Error:", error));
}


// Función para actualizar el contador de trabajadores
function updateWorkerCount() {
    document.getElementById("worker-count").innerText = `TRABAJADORES ACTUALES: ${workerCount}`;
}

// Función para agregar un nuevo trabajador
function addWorker() {
    const name = document.getElementById("new-worker-name").value;
    const email = document.getElementById("new-worker-email").value;
    const phone = document.getElementById("new-worker-phone").value;
    const address = document.getElementById("new-worker-address").value;

    if (!name || !email || !phone || !address) {
        alert("Por favor, completa todos los campos.");
        return;
    }

    const contenedor = document.getElementById("worker-cards-container");
    const div = document.createElement("div");
    div.classList.add("worker-card");
    div.id = `worker-card-${workerCount}`;
    div.innerHTML = `
      <span class="delete-icon" id="delete-${workerCount}" onclick="deleteWorker(${workerCount})">✖</span>
      <img src="https://via.placeholder.com/100" alt="Foto de Perfil" class="profile-pic" id="profile-pic-${workerCount}">
      <div class="worker-info">
        <h2 id="worker-name-${workerCount}">${name}</h2>
        <p><strong>Email:</strong> <span id="worker-email-${workerCount}">${email}</span></p>
        <p><strong>Teléfono:</strong> <span id="worker-phone-${workerCount}">${phone}</span></p>
        <p><strong>Dirección:</strong> <span id="worker-address-${workerCount}">${address}</span></p>
      </div>
    `;
    contenedor.appendChild(div);
    workerCount++;
    updateWorkerCount();

    // Limpia los campos de entrada
    document.getElementById("new-worker-name").value = "";
    document.getElementById("new-worker-email").value = "";
    document.getElementById("new-worker-phone").value = "";
    document.getElementById("new-worker-address").value = "";
}

// Función para eliminar un trabajador
function deleteWorker(workerId) {
    const workerCard = document.getElementById(`worker-card-${workerId}`);
    if (workerCard) {
        workerCard.remove();
        workerCount--;
        updateWorkerCount();
    }
}

// Inicializa la aplicación cargando los trabajadores del JSON
document.addEventListener("DOMContentLoaded", shoWorkers);
