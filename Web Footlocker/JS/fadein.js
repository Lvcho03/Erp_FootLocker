// formulario.js

function mostrarFormulario() {
    document.getElementById('contenedor-form').style.display = 'block';
}

function cerrarFormulario(event) {
    if (event) event.stopPropagation(); // Evitar cerrar al hacer clic en el modal
    document.getElementById('contenedor-form').style.display = 'none';
}

// Espera que la página se cargue completamente
window.addEventListener('load', function() {
    const titulo = document.getElementById('titulo');
    
    // Agrega la clase 'mostrar' después de un breve retraso
    setTimeout(() => {
        titulo.classList.add('mostrar');
    }, 500); // Aparece después de 0.5 segundos
});
