import Conexion from './conexion.js';

async function iniciarSesion() {
    const nombre = document.getElementById('usuario').value;
    const contrasena = document.getElementById('contrasena').value;

    const conexion = new Conexion();
    try {
        const resultado = await conexion.validarUsuario(nombre, contrasena);

        if (resultado.validado) {
            localStorage.setItem("nombreUsuario", resultado.nombre); // Guardamos el nombre real
            localStorage.setItem("rol", resultado.rol); // Guardamos el rol
            console.log(localStorage.getItem("nombreUsuario" , resultado.nombre));
            if (resultado.rol === "admin") {
                window.location.href = "../html/templateAdminPage.html";
            } else {
                window.location.href = "../html/templateUserPage.html";
            }
        } else {
            alert("Usuario o contraseña incorrectos.");
        }
    } catch (error) {
        console.error("Error al iniciar sesión:", error);
    } finally {
        conexion.cerrarConexion();
    }
}
