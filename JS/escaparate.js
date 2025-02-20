function volver() {
    let usuarioGuardado = JSON.parse(localStorage.getItem("user")); // Obtener el objeto user

    if (usuarioGuardado && usuarioGuardado.rol) { // Verificar que exista y tenga rol
        if (usuarioGuardado.rol === "admin") {
            window.location.href = "../html/templateAdminPage.html"; // Redirige al admin
        } else {
            window.location.href = "../html/templateNotAdminPage.html"; // Redirige a usuario normal
        }
    } else {
        console.error("No se encontró información del usuario en localStorage.");
    }
}


document.addEventListener("DOMContentLoaded", function() {
    // Recuperar el usuario almacenado en localStorage
    const usuarioGuardado = JSON.parse(localStorage.getItem('user'));

    if (usuarioGuardado && usuarioGuardado.username) {
        // Mostrar el nombre en el span
        document.getElementById('miCuenta').innerHTML = '<i class="fas fa-user me-2"></i> ' + usuarioGuardado.username;
    } else {
        console.error("No se encontró información del usuario en localStorage.");
    }
});


document.addEventListener("DOMContentLoaded", function() {
    // Recuperar el rol desde el localStorage

    const user = JSON.parse(localStorage.getItem('user'));

    // Mostrar o esconder elementos dependiendo del rol
    if (user.rol === 'admin') {

        // Puedes mostrar un botón o sección exclusiva para admin
        document.getElementById('adminSection').style.display = 'none'; // Muestra la sección
    } 
});
