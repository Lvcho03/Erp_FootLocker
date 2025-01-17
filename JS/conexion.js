import sqlite3 from 'sqlite3';
class Conexion {
  constructor() {
    this.db = new sqlite3.Database('./DB/usuarios.db', (err) => {
      if (err) {
        console.error("Error al conectar a la base de datos:", err.message);
      } else {
        console.log("Conectado2 a la base de datos.");
      }
    });
  }

  validarUsuario(nombre, contrasena) {
    return new Promise((resolve, reject) => {
      const queryUsuario = 'SELECT * FROM TablaUsuario WHERE n = ? AND c = ?';
      const queryAdmin = 'SELECT * FROM TablaAdmin WHERE n = ? AND c = ?';

      this.db.get(queryUsuario, [nombre, contrasena], (err, rowUsuario) => {
        if (err) {
          console.error("Error al consultar la base de datos (Usuario):", err.message);
          return reject(false);
        }
        if (rowUsuario) {
          return resolve({ validado: true, rol: 'usuario' });
        }

        this.db.get(queryAdmin, [nombre, contrasena], (err, rowAdmin) => {
          if (err) {
            console.error("Error al consultar la base de datos (Admin):", err.message);
            return reject(false);
          }
          if (rowAdmin) {
            return resolve({ validado: true, rol: 'admin' });
          }
          resolve({ validado: false });
        });
      });
    });
  }

  cerrarConexion() {
    return new Promise((resolve, reject) => {
      this.db.close((err) => {
        if (err) {
          console.error("Error al cerrar la base de datos:", err.message);
          return reject(false);
        }
        console.log("Conexión cerrada con éxito.");
        resolve(true);
      });
    });
  }
}

export default Conexion;  // Exportamos la clase Conexion para ser importada en otros módulos