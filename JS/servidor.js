import express from 'express';
import sqlite3 from 'sqlite3';
import bodyParser from 'body-parser';
import cors from 'cors';  
import Conexion from './conexion.js';  // Asegúrate de ajustar la ruta correcta a 'conexion.js'

const app = express();
const port = 3000;

// Middleware para la lectura de datos de formularios
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configura CORS para permitir solicitudes desde `http://localhost:5500`
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Conexión a la base de datos SQLite
const db = new sqlite3.Database('./DB/usuarios.db', async (err) => {
  if (err) {
    console.error("Error al conectar a la base de datos:", err.message);
  } else {
    console.log("Conectado a la base de datos.");
    await crearYPoblarBaseDeDatos();  
  }
});

// Función para crear las tablas y poblarlas con datos si es necesario
async function crearYPoblarBaseDeDatos() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run('DROP TABLE IF EXISTS TablaAdmin');
      db.run('DROP TABLE IF EXISTS TablaUsuario');

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

      db.run(`DELETE FROM TablaAdmin`);
      db.run(`DELETE FROM TablaUsuario`);

      const usuarios = [
        { nombre: 'juan', contrasena: 'admin' },
        { nombre: 'admin2', contrasena: 'adminpass' }
      ];

      usuarios.forEach(user => {
        db.run(`INSERT INTO TablaAdmin (nombre, contrasena) VALUES (?, ?)`, [user.nombre, user.contrasena]);
      });

      const usuariosTablaUsuario = [
        { nombre: 'pepe Capo Gonzalez', contrasena: 'usuario', email: 'pcaogon@gmail.com', numTel: '682646493', direccion: 'calle Aragón nº4', nacionalidad: 'Española', sexo: 'Masculino' },
        { nombre: 'carlota Matirnez Martinez', contrasena: null, email: 'carmarmar@gmail.com', numTel: '686358765', direccion: 'calle Aragón nº5', nacionalidad: 'Española', sexo: 'Femenino' },
        { nombre: 'alejandro Benito Camelo', contrasena: 'usuario', email: 'estadaki@gmail.com', numTel: '687654327', direccion: 'calle Aragón nº7', nacionalidad: 'Española', sexo: 'Masculino' },
        { nombre: 'asAS', contrasena: null, email: 'asAS', numTel: 'asAS', direccion: 'asa', nacionalidad: 'Desconocida', sexo: 'Otro' }
      ];

      usuariosTablaUsuario.forEach(user => {
        db.run(`INSERT INTO TablaUsuario (nombre, contrasena, email, numTel, direccion, nacionalidad, sexo) VALUES (?, ?, ?, ?, ?, ?, ?)`, [user.nombre, user.contrasena, user.email, user.numTel, user.direccion, user.nacionalidad, user.sexo]);
      });

      resolve();
    });
  });
}

// Instancia de la clase Conexion
const conexion = new Conexion();

app.post('/validarUsuario', async (req, res) => {
  try {
    const { nombre, contrasena } = req.body;
    const result = await conexion.validarUsuario(nombre, contrasena);

    if (result.validado) {
      res.json({ success: true, rol: result.rol });
    } else {
      res.json({ success: false, message: "Usuario o administrador no válido" });
    }
  } catch (error) {
    console.error("Error en la validación:", error);
    res.status(500).json({ success: false, message: "Error al conectar con la base de datos" });
  }
});

app.post('/cerrarSesion', async (req, res) => {
  try {
    await conexion.cerrarConexion();
    res.json({ success: true, message: "Sesión cerrada con éxito" });
  } catch (error) {
    console.error("Error al cerrar la sesión:", error);
    res.status(500).json({ success: false, message: "Error al cerrar la sesión" });
  }
});

app.get('/obtenerNombreUsuario', async (req, res) => {
  try {
    if (req.session.usuarioId) {
      const usuarioId = req.session.usuarioId;
      const usuario = await conexion.obtenerUsuarioPorId(usuarioId);

      if (usuario) {
        res.json({ success: true, nombre: usuario.nombre });
      } else {
        res.json({ success: false, message: "Usuario no encontrado" });
      }
    } else {
      res.json({ success: false, message: "No se ha iniciado sesión" });
    }
  } catch (error) {
    console.error("Error al obtener el nombre del usuario:", error);
    res.status(500).json({ success: false, message: "Error en la conexión con la base de datos" });
  }
});



// Levantar servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
