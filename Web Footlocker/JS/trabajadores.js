const workerName = document.getElementById('worker-name-1').innerText;

const workerEmail = document.getElementById('worker-email-1').innerText;

const workerPhone = document.getElementById('worker-phone-1').innerText;

const workerAddress = document.getElementById('worker-address-1').innerText;


// Mostrar los datos en la consola

console.log(`Nombre: ${workerName}`);

console.log(`Email: ${workerEmail}`);

console.log(`Teléfono: ${workerPhone}`);

console.log(`Dirección: ${workerAddress}`);


// Función para eliminar un trabajador

function deleteWorker(workerId) {

    const workerCard = document.getElementById(`worker-card-${workerId}`);

    if (workerCard) {

        workerCard.remove();

    }

}




// Función para eliminar un trabajador
function deleteWorker(workerId) {
    const workerCard = document.getElementById(`worker-card-${workerId}`);
  
    if (workerCard) {
        workerCard.remove();
    }
}




// Función para habilitar el modo de edición

function editWorker(workerId) {

    // Mostrar los campos de entrada

    document.getElementById(`edit-name-${workerId}`).style.display = 'block';

    document.getElementById(`edit-email-${workerId}`).style.display = 'block';

    document.getElementById(`edit-phone-${workerId}`).style.display = 'block';

    document.getElementById(`edit-address-${workerId}`).style.display = 'block';

    

    // Llenar los campos de entrada con los valores actuales

    document.getElementById(`edit-name-${workerId}`).value = document.getElementById(`worker-name-${workerId}`).innerText;

    document.getElementById(`edit-email-${workerId}`).value = document.getElementById(`worker-email-${workerId}`).innerText;

    document.getElementById(`edit-phone-${workerId}`).value = document.getElementById(`worker-phone-${workerId}`).innerText;

    document.getElementById(`edit-address-${workerId}`).value = document.getElementById(`worker-address-${workerId}`).innerText;


    // Ocultar el botón de modificar y mostrar el botón de confirmar

    document.getElementById(`edit-${workerId}`).style.display = 'none';

    document.getElementById(`confirm-${workerId}`).style.display = 'block';

}


// Función para confirmar la edición

function confirmEdit(workerId) {

    // Obtener los nuevos valores de los campos de entrada

    const newName = document.getElementById(`edit-name-${workerId}`).value;

    const newEmail = document.getElementById(`edit-email-${workerId}`).value;

    const newPhone = document.getElementById(`edit-phone-${workerId}`).value;

    const newAddress = document.getElementById(`edit-address-${workerId}`).value;


    // Actualizar los valores en la tarjeta del trabajador

    document.getElementById(`worker-name-${workerId}`).innerText = newName;

    document.getElementById(`worker-email-${workerId}`).innerText = newEmail;

    document.getElementById(`worker-phone-${workerId}`).innerText = newPhone;

    document.getElementById(`worker-address-${workerId}`).innerText = newAddress;


    // Ocultar los campos de entrada

    document.getElementById(`edit-name-${workerId}`).style.display = 'none';

    document.getElementById(`edit-email-${workerId}`).style.display = 'none';

    document.getElementById(`edit-phone-${workerId}`).style.display = 'none';

    document.getElementById(`edit-address-${workerId}`).style.display = 'none';


    // Mostrar el botón de modificar y ocultar el botón de confirmar

    document.getElementById(`edit-${workerId}`).style.display = 'block';

    document.getElementById(`confirm-${workerId}`).style.display = 'none';

}


// Función para agregar un nuevo trabajador

function addWorker() {

    workerCount++; // Incrementar el contador de trabajadores


    // Obtener los valores del formulario

    const name = document.getElementById('new-worker-name').value;

    const email = document.getElementById('new-worker-email').value;

    const phone = document.getElementById('-newworker-phone').value;

    const address = document.getElementById('new-worker-address').value;


    // Crear una nueva tarjeta de trabajador

    const newWorkerCard = 'worker-card';
}
