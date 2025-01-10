const sqlite3 = require('sqlite3').verbose();

function validarUsuario(tipo, nombre, contrasena, callback) {
  // Crear la conexión a la base de datos 'usuarios.db'
  let db = new sqlite3.Database('usuarios.db');

  const query = tipo === 'admin' 
    ? `SELECT * FROM TablaAdmin WHERE nombre = ? AND contrasena = ?`
    : `SELECT * FROM TablaUsuario WHERE nombre = ? AND contrasena = ?`;

  // Ejecutar la consulta
  db.get(query, [nombre, contrasena], (err, row) => {
    if (err) {
      console.error("Error al consultar la base de datos:", err.message);
      callback(false);
    } else {
      callback(!!row);  // Devuelve true si se encontró un registro
    }
  });

  // No cerrar la base de datos al final, manejar la conexión después de recibir la respuesta
}

// Ejemplo de uso
validarUsuario('admin', 'juan', 'admin', (esValido) => {
  console.log(esValido ? "Usuario válido." : "Credenciales incorrectas.");
});
