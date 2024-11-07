function mostrarFormulario() {
    const contenedorForm = document.getElementById("contenedor-form");
    contenedorForm.classList.add("in"); // añade la clase `in` para hacerlo visible
}

function cerrarFormulario(event) {
    if (event) event.stopPropagation();
    document.getElementById("contenedor-form").classList.remove("in");
}


document.addEventListener("DOMContentLoaded", function() {
    const titulo = document.getElementById("titulo");
    titulo.style.opacity = "1";
    titulo.style.transform = "translateX(0)";
})

var esBoolean = true; // Inicializa como true para permitir mostrar la alerta

function mostrarAlerta(mensaje) {
    const alerta = document.getElementById("alerta");
    const mensajeAlerta = document.getElementById("mensajeAlerta");
    const btn = document.getElementById("boton");
    mensajeAlerta.textContent = mensaje; // Asignar el mensaje al span
    btn.style.display ="flex"
    alerta.style.display = "flex"; // Mostrar la alerta como flex
    alerta.classList.remove("oculto"); // Quitar la clase "oculto" para permitir el fade out
    esBoolean = false; // Cambia a false porque la alerta está visible
    console.log(esBoolean);
}

// Función para cerrar la alerta
function cerrarAlerta() {
    const alerta = document.getElementById("alerta");
    const btn = document.getElementById("boton");
    // Aplicar la clase "oculto" para iniciar el fade out
    alerta.classList.add("oculto");
    
    // Esperar a que la transición de opacidad termine antes de cambiar esBoolean
    alerta.addEventListener('transitionend', () => {
        alerta.style.display = "none"; // Establecer display a none después de ocultar
        btn.style.display = "none";
        esBoolean = true; // Cambia a true porque la alerta está oculta
        console.log(esBoolean);
    }, { once: true }); // Asegurarse de que el listener se ejecute solo una vez
}

// Para validar al enviar el formulario
document.getElementById("myForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Evitar recargar la página

    const conexion = new Conexion();
    const usuario = document.getElementById("usuario").value;
    const contrasena = document.getElementById("contrasena").value;

    // Cargar los datos antes de intentar validar
    conexion.cargarDatos().then(() => {
        const usuarioValido = conexion.validarUsuario(usuario, contrasena);
        const adminValido = conexion.validarAdmin(usuario, contrasena);

        if (adminValido) {
            window.location.href = "templateAdminPage.html";
            cerrarFormulario(); // Cerrar el formulario si es necesario
        } else if (usuarioValido) {
            window.location.href = "templateNotAdminPage.html";
        } else {
            mostrarAlerta("Usuario o contraseña incorrectos. Por favor, intenta de nuevo.");
        }
    }).catch(error => {
        console.error("Error al cargar los datos:", error);
        mostrarAlerta("Hubo un error al cargar los datos. Por favor, intenta de nuevo.");
    });
});









