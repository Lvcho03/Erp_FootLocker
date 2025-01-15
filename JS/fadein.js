


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







