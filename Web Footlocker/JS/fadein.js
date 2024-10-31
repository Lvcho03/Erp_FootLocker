function mostrarFormulario() {
    const formContainer = document.getElementById('contenedor-form');
    formContainer.classList.add('in');
    formContainer.style.display = 'flex';
}

function cerrarFormulario() {
    const formContainer = document.getElementById('contenedor-form');
    formContainer.classList.remove('in');
    formContainer.style.display = 'none'; // Oculta el contenedor completamente
}