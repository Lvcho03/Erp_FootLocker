

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
          if (result.success) {
              if (result.rol === 'admin') {
                  console.log("Admin validado con éxito");
                  window.location.href = 'html/templateAdminPage.html';  // Redirigir al dashboard de admin
              } else if (result.rol === 'usuario') {
                  console.log("Usuario validado con éxito");
                  window.location.href = 'html/templateNotAdminPage.html';  // Redirigir al dashboard de usuario
              }
          } else {
              console.log("Error en el inicio de sesión:", result.message);
              mostrarAlerta(result.message);
          }
      })
      .catch(error => {
          console.error("Error en la solicitud al servidor:", error);
          mostrarAlerta("Error al conectarse con el servidor");
      });
  });
});
