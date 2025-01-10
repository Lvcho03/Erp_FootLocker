const sqlite3 = require('sqlite3').verbose();

class Conexion {
  constructor() {
    // Conectar a la base de datos SQLite
    this.db = new sqlite3.Database('./DB/usuarios.db', (err) => {
      if (err) {
        console.error("Error al conectar a la base de datos:", err.message);
      } else {
        console.log("Conectado a la base de datos.");
      }
    });
  }

  // Método para validar si un usuario existe en la base de datos
  validarUsuario(nombre, contrasena) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM TablaUsuario WHERE nombre = ? AND contrasena = ?';
      this.db.get(query, [nombre, contrasena], (err, row) => {
        if (err) {
          console.error("Error al consultar la base de datos:", err.message);
          reject(false);
        } else {
          resolve(row ? { validado: true, admin: false } : { validado: false });
        }
      });
    });
  }

  // Método para cerrar la conexión con la base de datos
  cerrarConexion() {
    return new Promise((resolve, reject) => {
      this.db.close((err) => {
        if (err) {
          console.error("Error al cerrar la base de datos:", err.message);
          reject(false);
        } else {
          console.log("Conexión cerrada con éxito.");
          resolve(true);
        }
      });
    });
  }
}

module.exports = Conexion;
