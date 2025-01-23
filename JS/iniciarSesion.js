document.addEventListener("DOMContentLoaded", function() {
    const formulario = document.getElementById("myForm");

    formulario.addEventListener("submit", function(e) {
        e.preventDefault();  // Evita que el formulario se envíe de forma tradicional

        const nombre = document.getElementById("usuario").value;
        const contrasena = document.getElementById("contrasena").value;

        fetch('http://localhost:3000/validarUsuario', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nombre, contrasena }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al conectar con la base de datos');
            }
            return response.json();
        })
        .then(result => {
            console.log("Resultado recibido del servidor:", result);

            if (result.success) {
                // Usa los valores del formulario si el servidor no devuelve nombre/contrasena
                const username = result.nombre || nombre; // Usa `nombre` del servidor o el del formulario
                const password = result.contrasena || contrasena; // Usa `contrasena` del servidor o el del formulario

                // Guardar los datos en localStorage
                localStorage.setItem('user', JSON.stringify({
                    username: username,
                    password: password,
                    rol: result.rol
                }));

                // Console log para verificar el usuario guardado
                const usuarioGuardado = JSON.parse(localStorage.getItem('user'));
                console.log("Usuario guardado en localStorage:", usuarioGuardado);

                // Mostrar los datos ingresados
                console.log("Usuario ingresado:", username);
                console.log("Contraseña ingresada:", password);

                if (result.rol === 'admin') {
                    console.log("Admin validado con éxito");
                    window.location.href = 'html/templateAdminPage.html'; // Redirigir al dashboard de admin
                } else if (result.rol === 'usuario') {
                    console.log("Usuario validado con éxito");
                    window.location.href = 'html/templateNotAdminPage.html'; // Redirigir al dashboard de usuario
                }
            } else {
                console.log("Error en el inicio de sesión:", result.message);
                mostrarAlerta(result.message); // Mostrar alerta con el mensaje de error
            }
        })
        .catch(error => {
            console.error("Error en la solicitud al servidor:", error);
            mostrarAlerta("Error al conectarse con el servidor");
        });
    });
});
