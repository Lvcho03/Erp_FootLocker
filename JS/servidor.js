const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const Conexion = require('./conexion');  // Importamos la clase Conexion desde conexion.js

const app = express();
const port = 3000;

// Middleware para la lectura de datos de formularios
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Conexión a la base de datos SQLite
const db = new sqlite3.Database('./DB/usuarios.db', (err) => {
  if (err) {
    console.error("Error al conectar a la base de datos:", err.message);
  } else {
    console.log("Conectado a la base de datos.");

    // Llamar a la función para crear tablas si no existen
    crearYPoblarBaseDeDatos();
  }
});

// Función para crear las tablas y poblarlas con datos si es necesario
function crearYPoblarBaseDeDatos() {
  db.serialize(() => {
    // Eliminar tablas si ya existen para evitar duplicados
    db.run('DROP TABLE IF EXISTS TablaAdmin');
    db.run('DROP TABLE IF EXISTS TablaUsuario');

    // Crear tablas de administrador y usuario
    db.run(`CREATE TABLE IF NOT EXISTS TablaAdmin (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      contrasena TEXT NOT NULL
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS TablaUsuario (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      contrasena TEXT,
      email TEXT,
      numTel TEXT,
      direccion TEXT,
      nacionalidad TEXT,
      sexo TEXT
    )`);

    // Eliminar los datos previos antes de insertar
    db.run(`DELETE FROM TablaAdmin`);
    db.run(`DELETE FROM TablaUsuario`);

    // Insertar datos en TablaAdmin
    db.run(`INSERT INTO TablaAdmin (nombre, contrasena) VALUES ('juan', 'admin')`);
    db.run(`INSERT INTO TablaAdmin (nombre, contrasena) VALUES ('admin2', 'adminpass')`);

    // Insertar datos en TablaUsuario
    const usuarios = [
      { nombre: 'pepe Capo Gonzalez', contrasena: 'usuario', email: 'pcaogon@gmail.com', numTel: '682646493', direccion: 'calle Aragón nº4', nacionalidad: 'Española', sexo: 'Masculino' },
      { nombre: 'carlota Matirnez Martinez', contrasena: null, email: 'carmarmar@gmail.com', numTel: '686358765', direccion: 'calle Aragón nº5', nacionalidad: 'Española', sexo: 'Femenino' },
      { nombre: 'alejandro Benito Camelo', contrasena: 'usuario', email: 'estadaki@gmail.com', numTel: '687654327', direccion: 'calle Aragón nº7', nacionalidad: 'Española', sexo: 'Masculino' },
      { nombre: 'asAS', contrasena: null, email: 'asAS', numTel: 'asAS', direccion: 'asa', nacionalidad: 'Desconocida', sexo: 'Otro' }
    ];

    usuarios.forEach(user => {
      db.run(`INSERT INTO TablaUsuario (nombre, contrasena, email, numTel, direccion, nacionalidad, sexo) 
              VALUES (?, ?, ?, ?, ?, ?, ?)`,
              [user.nombre, user.contrasena, user.email, user.numTel, user.direccion, user.nacionalidad, user.sexo]);
    });
  });
}



// Ruta para validar usuario
app.post('/validarUsuario', async (req, res) => {
  const { nombre, contrasena } = req.body;
  
  try {
    const conexion = new Conexion();
    const result = await conexion.validarUsuario(nombre, contrasena);
    conexion.cerrarConexion();
    
    if (result.validado) {
      res.json({ success: true, message: "Usuario validado", admin: result.admin });
    } else {
      res.json({ success: false, message: "Usuario no validado" });
    }
  } catch (error) {
    console.error("Error al validar usuario:", error);
    res.json({ success: false, message: "Error al validar usuario" });
  }
});

// Levantar servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
