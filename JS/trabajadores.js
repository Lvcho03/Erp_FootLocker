let workerCount = 0; // Contador global de trabajadores


function deleteWorker(workerId) {
    const workerCard = document.getElementById(`worker-card-${workerId}`);
    if (workerCard) {
        workerCard.remove();
        workerCount--;
        updateWorkerCount();
    }
}


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
                console.log("usuario cargado")
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

    const nuevoUsuario = {
        nombre: name,
        apellidos: name, // Aquí usas el nombre para los apellidos, pero podrías querer un campo separado
        contrasena: "usuario", // Esto parece ser fijo; tal vez debería ser un campo también
        email: email,
        numTel: phone,
        direccion: address
    };

    // Enviar la solicitud al servidor
    fetch("http://localhost:3000/add", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(nuevoUsuario) // Enviar los datos como JSON
    })
    .then(function(response) {
        if (response.ok) {
            return response.json(); // Convertir la respuesta del servidor a JSON
        } else {
            throw new Error("Error al agregar el trabajador.");
        }
    })
    .then(function(result) {
        alert("Trabajador agregado correctamente");
        console.log(result);
        // Aquí podrías llamar a la función para actualizar la lista de trabajadores si es necesario
        shoWorkers();  // Asegúrate de que esta función esté definida para mostrar los trabajadores
    })
    .catch(function(error) {
        alert(error.message);  // Mostrar el error en caso de que algo falle
    });

    // Limpiar los campos de entrada
    document.getElementById("new-worker-name").value = "";
    document.getElementById("new-worker-email").value = "";
    document.getElementById("new-worker-phone").value = "";
    document.getElementById("new-worker-address").value = "";
}




// Inicializa la aplicación cargando los trabajadores del JSON
document.addEventListener("DOMContentLoaded", shoWorkers);
