const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('usuarios.db');

db.serialize(() => {
  // Eliminar el archivo y crear la base de datos desde cero
  db.run('DROP TABLE IF EXISTS TablaAdmin');
  db.run('DROP TABLE IF EXISTS TablaUsuario');

  // Crear tablas nuevamente con PRIMARY KEY AUTOINCREMENT
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

db.close();
console.log("Base de datos creada y poblada con éxito.");
