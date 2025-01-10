document.addEventListener("DOMContentLoaded", function() {
    const formulario = document.getElementById("myForm");
  
    formulario.addEventListener("submit", async function(e) {
      e.preventDefault();  // Evita que el formulario se envíe de forma tradicional
      
      const nombre = document.getElementById("usuario").value;
      const contrasena = document.getElementById("contrasena").value;
  
      try {
        const response = await fetch('http://127.0.0.1:5500/validarUsuario', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ nombre, contrasena }),
        });
  
        const result = await response.json();
        
        if (result.success) {
          console.log("Inicio de sesión exitoso:", result);
          window.CSSStyleSheet
          // Redirigir o mostrar mensaje de éxito
        } else {
          console.log("Error en el inicio de sesión:", result.message);
          // Mostrar mensaje de error
        }
      } catch (error) {
        console.error("Error en la solicitud al servidor:", error);
      }
    });
  });
