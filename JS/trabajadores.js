var workerCount = 0; // Contador global de trabajadores
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('workers.db');

// Función para eliminar un trabajador
function deleteWorker(workerId) {
    db.run(`DELETE FROM trabajadores WHERE id = ?`, [workerId], function (err) {
        if (err) {
            console.error("Error al eliminar el trabajador:", err);
            alert("Error al eliminar el trabajador.");
        } else {
            alert("Trabajador eliminado correctamente");
            showWorkers(); // Actualiza la lista de trabajadores en el frontend
        }
    });
}


// Función para mostrar trabajadores iniciales desde la base de datos
function showWorkers() {
    db.all("SELECT * FROM trabajadores", [], (err, rows) => {
        if (err) {
            console.error("Error al cargar los trabajadores:", err);
        } else {
            const contenedor = document.getElementById("worker-cards-container");
            contenedor.innerHTML = ""; // Limpiar contenedor antes de agregar nuevos trabajadores

            rows.forEach((usuario) => {
                const div = document.createElement("div");
                div.classList.add("worker-card");
                div.id = `worker-card-${usuario.id}`;
                div.innerHTML = `
                  <span class="delete-icon" id="delete-${usuario.id}" onclick="deleteWorker(${usuario.id})">✖</span>
                  <img src="../imagenes/worker.png" class="profile-pic" id="profile-pic-${usuario.id}">
                  <div class="worker-info">
                    <h2 id="worker-name-${usuario.id}">${usuario.nombre} </h2>
                    <p><strong>Email:</strong> <span id="worker-email-${usuario.id}">${usuario.email}</span></p>
                    <p><strong>Teléfono:</strong> <span id="worker-phone-${usuario.id}">${usuario.numTel}</span></p>
                    <p><strong>Dirección:</strong> <span id="worker-address-${usuario.id}">${usuario.direccion}</span></p>
                    <button class="edicion" id="edit-${usuario.id}" onclick="editWorker(${usuario.id})">Editar</button>
                  </div>
                `;
                contenedor.appendChild(div);
            });
            workerCount = rows.length; // Actualiza el contador
            updateWorkerCount();
        }
    });
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
        apellidos: name, // Opcional: Cambia esto si tienes un campo para "apellidos"
        contrasena: "usuario", // Contraseña fija o basada en un campo
        email: email,
        numTel: phone,
        direccion: address
    };

    db.run(`INSERT INTO trabajadores (nombre, apellidos, contrasena, email, numTel, direccion) VALUES (?, ?, ?, ?, ?, ?)`, 
    [nuevoUsuario.nombre, nuevoUsuario.apellidos, nuevoUsuario.contrasena, nuevoUsuario.email, nuevoUsuario.numTel, nuevoUsuario.direccion], 
    function (err) {
        if (err) {
            console.error("Error al agregar el trabajador:", err);
            alert("Error al agregar el trabajador.");
        } else {
            alert("Trabajador agregado correctamente");
            showWorkers(); // Actualiza la lista de trabajadores en el frontend
        }
    });

    // Limpiar los campos de entrada
    document.getElementById("new-worker-name").value = "";
    document.getElementById("new-worker-email").value = "";
    document.getElementById("new-worker-phone").value = "";
    document.getElementById("new-worker-address").value = "";
}

// Inicializa la aplicación cargando los trabajadores de la base de datos
document.addEventListener("DOMContentLoaded", showWorkers);

// Función para cerrar el modal
function closeModal() {
    document.getElementById("edit-modal").style.display = "none";
}

// Función para abrir el modal de edición
function editWorker(id) {
    db.get("SELECT * FROM trabajadores WHERE id = ?", [id], (err, row) => {
        if (err) {
            console.error("Error al obtener los datos del trabajador:", err);
        } else {
            const name = row.nombre;
            const email = row.email;
            const phone = row.numTel;
            const address = row.direccion;

            document.getElementById("edit-name").value = name;
            document.getElementById("edit-email").value = email;
            document.getElementById("edit-phone").value = phone;
            document.getElementById("edit-address").value = address;

            currentEditingId = id;
            document.getElementById("edit-modal").style.display = "block";
        }
    });
}

// Función para guardar los cambios
function saveChanges() {
    const name = document.getElementById("edit-name").value;
    const email = document.getElementById("edit-email").value;
    const phone = document.getElementById("edit-phone").value;
    const address = document.getElementById("edit-address").value;

    const updatedUser = {
        nombre: name,
        email: email,
        numTel: phone,
        direccion: address
    };

    db.run(`UPDATE trabajadores SET nombre = ?, email = ?, numTel = ?, direccion = ? WHERE id = ?`, 
    [updatedUser.nombre, updatedUser.email, updatedUser.numTel, updatedUser.direccion, currentEditingId], 
    function (err) {
        if (err) {
            console.error("Error al guardar los cambios:", err);
            alert("Error al guardar los cambios.");
        } else {
            alert("Cambios guardados.");

            document.getElementById(`worker-name-${currentEditingId}`).innerText = name;
            document.getElementById(`worker-email-${currentEditingId}`).innerText = email;
            document.getElementById(`worker-phone-${currentEditingId}`).innerText = phone;
            document.getElementById(`worker-address-${currentEditingId}`).innerText = address;

            closeModal();
        }
    });
}
