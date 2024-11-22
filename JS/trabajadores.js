var workerCount = 0; // Contador global de trabajadores

let currentEditingId; // Variable global para almacenar el ID del trabajador que se está editando


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

    fetch("http://localhost:3000/empleados")

        .then((respuesta) => {

            if (!respuesta.ok) {

                throw new Error("Error al cargar los trabajadores");

            }

            return respuesta.json();

        })

        .then((usuarios) => {

            const contenedor = document.getElementById("worker-cards-container");

            contenedor.innerHTML = ""; // Limpiar contenedor antes de agregar nuevos trabajadores

            usuarios.forEach((usuario) => {

                const div = document.createElement("div");

                div.classList.add("worker-card");

                div.id = `worker-card-${usuario.id}`;

                div.innerHTML = `

                  <span class="delete-icon" id="delete-${usuario.id}" onclick="deleteWorker(${usuario.id})">✖</span>

                  <img src="worker.png" class="profile-pic" id="profile-pic-${usuario.id}">

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

            workerCount = usuarios.length; // Actualiza


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
        apellidos: name,

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

        shoWorkers();  // Actualiza la lista de trabajadores

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


// Función para cerrar el modal

function closeModal() {

    document.getElementById("edit-modal").style.display = "none";

}


// Función para abrir el modal de edición

function editWorker(id) {

    // Obtener los datos del usuario

    const name = document.getElementById(`worker-name-${id}`).innerText;

    const email = document.getElementById(`worker-email-${id}`).innerText;

    const phone = document.getElementById(`worker-phone-${id}`).innerText;

    const address = document.getElementById(`worker-address-${id}`).innerText;


    // Llenar el modal con la información del usuario

    document.getElementById("edit-name").value = name;

    document.getElementById("edit-email").value = email;

    document.getElementById("edit-phone").value = phone;

    document.getElementById("edit-address").value = address;


    // Guardar el ID del trabajador que se está editando

    currentEditingId = id;


    // Mostrar el modal

    document.getElementById("edit-modal").style.display = "block";

}


// Función para guardar los cambios

function saveChanges() {

    const name = document.getElementById("edit-name").value;

    const email = document.getElementById("edit-email").value;

    const phone = document.getElementById("edit-phone").value;

    const address = document.getElementById("edit-address").value;


    // Crear el objeto del trabajador actualizado

    const updatedUser  = {

        nombre: name,

        email: email,

        numTel: phone,

        direccion: address

    };


    // Enviar la solicitud al servidor para actualizar el trabajador

    fetch(`http://localhost:3000/empleados/update/${currentEditingId}`, {

        method: "POST",

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify(updatedUser ) // Asegúrate de que esto sea correcto

    })

    .then(function(response) {

        if (response.ok) {

            return response.json(); // Asegúrate de manejar la respuesta JSON

        } else {

            throw new Error("Error al guardar los cambios.");

        }

    })

    .then(function(data) {

        alert("Cambios guardados.");

        

        // Actualizar la información en la interfaz de usuario

        document.getElementById(`worker-name-${currentEditingId}`).innerText = name;

        document.getElementById(`worker-email-${currentEditingId}`).innerText = email;

        document.getElementById(`worker-phone-${currentEditingId}`).innerText = phone;

        document.getElementById(`worker-address-${currentEditingId}`).innerText = address;


        // Cerrar el modal

        closeModal();

    })

    .catch(function(error) {

        alert(error.message); // Mostrar el error en caso de que algo falle

    });

}


    // Enviar la solicitud al servidor para actualizar el trabajador

    fetch(`http://localhost:3000/empleados/update/${currentEditingId}`, {

        method: "PUT",

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify(updatedUser )

    })

    .then(function(response) {

        if (response.ok) {

            alert("Cambios guardados.");

            

            // Actualizar la información en la interfaz de usuario

            document.getElementById(`worker-name-${currentEditingId}`).innerText = name;

            document.getElementById(`worker-email-${currentEditingId}`).innerText = email;

            document.getElementById(`worker-phone-${currentEditingId}`).innerText = phone;

            document.getElementById(`worker-address-${currentEditingId}`).innerText = address;


            // Cerrar el modal

            closeModal();

        } else {

            throw new Error("Error al guardar los cambios.");

        }

    })

    .catch(function(error) {

        alert(error.message); // Mostrar el error en caso de que algo falle

    });

