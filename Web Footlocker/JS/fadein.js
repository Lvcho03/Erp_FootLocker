

function cerrarFormulario() {
    const formContainer = document.getElementById('contenedor-form');
    formContainer.classList.remove('in');
    formContainer.style.display = 'none'; // Oculta el contenedor completamente
}
function mostrarFormulario() {
    const formContainer = document.getElementById('contenedor-form');
    formContainer.classList.add('in');
    formContainer.classList.add('sombra');
    formContainer.style.display = 'flex';
}