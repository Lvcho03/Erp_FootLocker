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

document.addEventListener("DOMContentLoaded", function() {
    const titulo = document.getElementById("txtPresentacion");
    titulo.style.opacity = "1";
    titulo.style.transform = "translateX(0)";
})


var esBoolean = true; // Inicializa como true para permitir mostrar la alerta

function mostrarAlerta(mensaje) {
    const alerta = document.getElementById("alerta");
    const mensajeAlerta = document.getElementById("mensajeAlerta");
    const btn = document.getElementById("boton");
    mensajeAlerta.textContent = mensaje; 
    btn.style.display ="flex"
    alerta.style.display = "flex"; 
    alerta.classList.remove("oculto"); 
    esBoolean = false; 
    console.log(esBoolean);
}

// Función para cerrar la alerta
function cerrarAlerta() {
    const alerta = document.getElementById("alerta");
    const btn = document.getElementById("boton");
   
    alerta.classList.add("oculto");
    
    alerta.addEventListener('transitionend', () => {
        alerta.style.display = "none"; 
        btn.style.display = "none";
        esBoolean = true; 
        console.log(esBoolean);
    }, { once: true }); 
}

// En el submit del formulario, para cargar datos y validar usuario/admin
document.getElementById("myForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const conexion = new Conexion();
    const usuario = document.getElementById("usuario").value;
    const contrasena = document.getElementById("contrasena").value;

    // Cargar los datos antes de intentar validar
    conexion.cargarDatos().then(() => {
        const usuarioValido = conexion.validarUsuario(usuario, contrasena);
        const adminValido = conexion.validarAdmin(usuario, contrasena);

        if (adminValido) {
            window.location.href = "../html/templateAdminPage.html"; // Redirigir a la página de administrador
            cerrarFormulario(); 
            
        } else if (usuarioValido) {
            window.location.href = "../html/templateNotAdminPage.html"; // Redirigir a la página de usuario
        } else {
            mostrarAlerta("Usuario o contraseña incorrectos. Por favor, intenta de nuevo.");
        }

        localStorage.setItem("nombreUsuario", usuario);

    }).catch(error => {
        console.error("Error al cargar los datos:", error);
        mostrarAlerta("Hubo un error al cargar los datos. Por favor, intenta de nuevo.");
    });
});









