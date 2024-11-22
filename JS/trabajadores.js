var workerCount = 0; // Contador global de trabajadores

// Función para eliminar un trabajador
// Función para eliminar un trabajador usando POST
function deleteWorker(workerId) {
    // Enviar la solicitud POST al servidor para eliminar al trabajador
    fetch("http://localhost:3000/empleados/delete", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ id: workerId }) // Enviar el ID del trabajador como JSON
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error("Error al eliminar el trabajador.");
        }
    })
    .then(result => {
        alert("Trabajador eliminado correctamente");
        console.log(result);
        // Llamar a la función para actualizar la lista de trabajadores en la interfaz
        showWorkers();
    })
    .catch(error => {
        alert(error.message);
    });
}

// Función para mostrar trabajadores iniciales desde un archivo JSON
function shoWorkers() {
    fetch("http://localhost:3000/empleados")
        .then((respuesta) => {
            if (!respuesta.ok) {
                throw new Error("Error al cargar los trabajadores");
            }
            return respuesta.json();
        })
        .then((usuarios) => {
            console.log("Datos cargados:", usuarios); // Verifica la estructura
            const contenedor = document.getElementById("worker-cards-container");
            usuarios.forEach((usuario, index) => {
                const div = document.createElement("div");
                div.classList.add("worker-card");
                div.id = `worker-card-${usuario.id}`;
                div.innerHTML = `
                  <span class="delete-icon" id="delete-${usuario.id}" onclick="deleteWorker(${usuario.id})">✖</span>
                  <img src="worker.png" class="profile-pic" id="profile-pic-${usuario.id}">
                  <div class="worker-info">
                    <h2 id="worker-name-${usuario.id}">${usuario.nombre} ${usuario.apellidos}</h2>
                    <p><strong>Email:</strong> <span id="worker-email-${usuario.id}">${usuario.email}</span></p>
                    <p><strong>Teléfono:</strong> <span id="worker-phone-${usuario.id}">${usuario.numTel}</span></p>
                    <p><strong>Dirección:</strong> <span id="worker-address-${usuario.id}">${usuario.direccion}</span></p>
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

    const nuevoUsuario = {
        nombre: name,
        apellidos: name, // Aquí usas el nombre para los apellidos, pero podrías querer un campo separado
        contrasena: "usuario", // Esto parece ser fijo; tal vez debería ser un campo también
        email: email,
        numTel: phone,
        direccion: address
    };

    // Enviar la solicitud al servidor
    fetch("http://localhost:3000/empleados/add", {
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

// Inicializa la aplicación cargando los trabajadores del servidor
document.addEventListener("DOMContentLoaded", shoWorkers);
