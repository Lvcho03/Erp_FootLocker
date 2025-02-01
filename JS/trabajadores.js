const { json } = require('stream/consumers');

var workerCount = 0; // Contador global de trabajadores
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('/DB/usuarios.db');

// Función para eliminar un trabajador
function deleteWorker(workerId) {
    const url = `http://localhost:3000/deltrabajador/${workerId}`; // URL del endpoint del servidor

    fetch(url, {
        method: 'DELETE', // HTTP DELETE para eliminar el trabajador
        headers: {
            'Content-Type': 'application/json' // Cabecera para indicar que se envía JSON
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al eliminar el trabajador');
        }
        return response.json(); // Procesa la respuesta JSON del servidor
    })
    .then(data => {
        alert('Trabajador eliminado correctamente');
        showWorkers(); // Actualiza la lista de trabajadores en el frontend
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error al eliminar el trabajador.');
    });
}



function showWorkers() {
    fetch('http://localhost:3000/alltrabajadores')
        .then(response => response.json())
        .then(data => {
            const contenedor = document.getElementById("worker-cards-container");
            contenedor.innerHTML = ""; // Limpiar contenedor antes de agregar nuevos trabajadores

            data.forEach((  usuario) => {
                const div = document.createElement("div");
                div.classList.add("worker-card");
                div.id = `worker-card-${usuario.id}`;
                div.innerHTML = `
                  <span class="delete-icon" id="delete-${usuario.id}" onclick="deleteWorker(${usuario.id})">✖</span>
                  <img src="../imagenes/worker.png" class="profile-pic" id="profile-pic-${usuario.id}">
                  <div class="worker-info">
                    <h2 id="worker-name-${usuario.id}">${usuario.n}</h2>
                    <p><strong>Email:</strong> <span id="worker-email-${usuario.id}">${usuario.e}</span></p>
                    <p><strong>Teléfono:</strong> <span id="worker-phone-${usuario.id}">${usuario.nt}</span></p>
                    <p><strong>Dirección:</strong> <span id="worker-address-${usuario.id}">${usuario.d}</span></p>
                    <button class="edicion" id="edit-${usuario.id}" onclick="editWorker(${usuario.id})">Editar</button>
                  </div>
                `;
                contenedor.appendChild(div);
            });
            
            workerCount = data.length; // Actualiza el contador
            updateWorkerCount();
        })
        .catch(error => {
            console.error("Error al cargar los trabajadores:", error);
        });
}



// Función para actualizar el contador de trabajadores
function updateWorkerCount() {
    document.getElementById("worker-count").innerText = `TRABAJADORES ACTUALES: ${workerCount}`;
}

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
        contrasena: 'usuario', // Contraseña fija o predeterminada
        email: email,
        numTel: phone,
        direccion: address,
        nacionalidad: 'España', // Valor predeterminado
        sexo: 'N/A' // Valor predeterminado
    };

    // Configuración de la solicitud
    fetch('http://localhost:3000/addtrabajadores', {  // Cambia 'PORT' por tu puerto y 'your-endpoint' por la ruta del servidor donde se maneja la lógica de añadir trabajador.
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(nuevoUsuario)
    })
    .then(response => response.json())  // Analiza la respuesta como JSON
    .then(data => {
        if (data.success) {
            alert("Trabajador agregado correctamente");
            showWorkers(); // Actualiza la lista de trabajadores en el frontend
        } 
    })
    .catch((error) => {
        console.error("Error en la petición al servidor:", error);
        alert("Error en la petición al servidor.");
    });

    // Limpiar los campos de entrada
    document.getElementById("new-worker-name").value = "";
    document.getElementById("new-worker-email").value = "";
    document.getElementById("new-worker-phone").value = "";
    document.getElementById("new-worker-address").value = "";
}

// Inicializa la aplicación cargando los trabajadores de la base de datos
document.addEventListener("DOMContentLoaded", showWorkers);

// Función para abrir el modal de edición
function editWorker(id) {
    fetch(`http://localhost:3000/editar-trabajador/${id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener los datos del trabajador');
            }
            return response.json();
        })
        .then(data => {
            document.getElementById("edit-name").value = data.nombre;
            document.getElementById("edit-email").value = data.email;
            document.getElementById("edit-phone").value = data.numTel;
            document.getElementById("edit-address").value = data.direccion;

            currentEditingId = id;
            document.getElementById("edit-modal").style.display = "flex";
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// Función para cerrar el modal
function closeModal() {
    document.getElementById("edit-modal").style.display = "none";
}

// Función para guardar los cambios
function saveChanges() {
    const name = document.getElementById("edit-name").value;
    const email = document.getElementById("edit-email").value;
    const phone = document.getElementById("edit-phone").value;
    const address = document.getElementById("edit-address").value;

    fetch(`http://localhost:3000/actualizar-trabajador/${currentEditingId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nombre: name, email: email, numTel: phone, direccion: address })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al guardar los cambios');
        }
        return response.json();
    })
    .then(data => {
        alert("Cambios guardados correctamente.");
        document.getElementById(`worker-name-${currentEditingId}`).innerText = name;
        document.getElementById(`worker-email-${currentEditingId}`).innerText = email;
        document.getElementById(`worker-phone-${currentEditingId}`).innerText = phone;
        document.getElementById(`worker-address-${currentEditingId}`).innerText = address;
        closeModal();
    })
    .catch(error => {
        console.error('Error:', error);
        alert("Error al guardar los cambios.");
    });
}

// Asegúrate de agregar un evento al botón "Guardar" en el modal para llamar a saveChanges
document.getElementById("save-button").addEventListener("click", saveChanges);

