import express from 'express';
import sqlite3 from 'sqlite3';
import bodyParser from 'body-parser';
import cors from 'cors';  
import Conexion from './conexion.js';  // Asegúrate de ajustar la ruta correcta a 'conexion.js'
const router = express.Router();  // Define el enrutador
const app = express();
const PORT = process.env.PORT || 3000;  // Puerto donde el servidor escuchará

// Middleware
app.use(cors());
app.use(express.json());

// Configura CORS para permitir solicitudes desde `http://localhost:5500`
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS','DELETE','PUT'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Conexión a la base de datos SQLite
const db = new sqlite3.Database('./DB/usuarios.db', async (err) => {
  if (err) {
    console.error("Error al conectar a la base de datos:", err.message);
  } else {
    console.log("Conectado a la base de datos.");
   // await crearYPoblarBaseDeDatos();  
  }
});
/*
async function crearYPoblarBaseDeDatos() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.serialize(() => {
        db.run('DROP TABLE IF EXISTS TablaAdmin');
        db.run('DROP TABLE IF EXISTS TablaUsuario');
        db.run('DROP TABLE IF EXISTS Clientes');
        db.run('DROP TABLE IF EXISTS Productos');
        db.run('DROP TABLE IF EXISTS Ventas');
      
        db.run(`CREATE TABLE IF NOT EXISTS TablaAdmin (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          n TEXT NOT NULL,  -- nombre
          c TEXT NOT NULL   -- contrasena
        )`);
      
        db.run(`CREATE TABLE IF NOT EXISTS TablaUsuario (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          n TEXT NOT NULL,  -- nombre
          c TEXT,           -- contrasena
          e TEXT,           -- email
          nt TEXT,          -- numTel
          d TEXT,           -- direccion
          na TEXT,          -- nacionalidad
          s TEXT            -- sexo
        )`);
      
        db.run(`CREATE TABLE IF NOT EXISTS Clientes (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          n VARCHAR(50),    -- nombre
          a VARCHAR(50),    -- apellido
          t VARCHAR(15),    -- telefono
          e VARCHAR(100),   -- email
          na VARCHAR(50),   -- nacionalidad
          s CHAR(1)         -- sexo
        )`);
      
        db.run(`CREATE TABLE IF NOT EXISTS Productos (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          m VARCHAR(50),    -- marca
          mo VARCHAR(50),   -- modelo
          p DECIMAL(10,2),  -- precio
          st INT            -- stock
        )`);
      
        db.run(`CREATE TABLE IF NOT EXISTS Ventas (
          id_v INTEGER PRIMARY KEY AUTOINCREMENT,  -- id_venta
          id_c INT,        -- id_cliente
          id_p INT,        -- id_producto
          f DATE,          -- fecha
          fp VARCHAR(50),  -- forma_pago
          c INT,           -- cantidad
          FOREIGN KEY (id_c) REFERENCES Clientes(id),
          FOREIGN KEY (id_p) REFERENCES Productos(id)
        )`);
      });

      db.run(`DELETE FROM TablaAdmin`);
      db.run(`DELETE FROM TablaUsuario`);
      db.run(`DELETE FROM Clientes`);
      db.run(`DELETE FROM Productos`);
      db.run(`DELETE FROM Ventas`);

      // Insertar datos en TablaAdmin
      const usuarios = [
        { nombre: 'juan', contrasena: 'admin' },
        { nombre: 'admin2', contrasena: 'adminpass' }
      ];

      usuarios.forEach(user => {
        db.run(`INSERT INTO TablaAdmin (n, c) VALUES (?, ?)`, [user.nombre, user.contrasena]);
      });

      // Insertar datos en TablaUsuario
      const usuariosTablaUsuario = [
        { nombre: 'pepe Capo Gonzalez', contrasena: 'usuario', email: 'pcaogon@gmail.com', numTel: '682646493', direccion: 'calle Aragón nº4', nacionalidad: 'Española', sexo: 'Masculino' },
        { nombre: 'carlota Matirnez Martinez', contrasena: null, email: 'carmarmar@gmail.com', numTel: '686358765', direccion: 'calle Aragón nº5', nacionalidad: 'Española', sexo: 'Femenino' },
        { nombre: 'alejandro Benito Camelo', contrasena: 'usuario', email: 'estadaki@gmail.com', numTel: '687654327', direccion: 'calle Aragón nº7', nacionalidad: 'Española', sexo: 'Masculino' },
        { nombre: 'asAS', contrasena: null, email: 'asAS', numTel: 'asAS', direccion: 'asa', nacionalidad: 'Desconocida', sexo: 'Otro' }
      ];

      usuariosTablaUsuario.forEach(user => {
        db.run(`INSERT INTO TablaUsuario (n, c, e, n, d, na, s) VALUES (?, ?, ?, ?, ?, ?, ?)`, [user.nombre, user.contrasena, user.email, user.numTel, user.direccion, user.nacionalidad, user.sexo]);
      });

      // Insertar datos en la tabla Clientes
      const clientes = [
        { nombre: 'Juan', apellido: 'Pérez', telefono: '123456789', email: 'juan.perez@example.com', nacionalidad: 'Argentina', sexo: 'M' },
        { nombre: 'Ana', apellido: 'García', telefono: '234567890', email: 'ana.garcia@example.com', nacionalidad: 'Chile', sexo: 'F' },
        { nombre: 'Carlos', apellido: 'López', telefono: '345678901', email: 'carlos.lopez@example.com', nacionalidad: 'Perú', sexo: 'M' },
        { nombre: 'Sofía', apellido: 'Martínez', telefono: '456789012', email: 'sofia.martinez@example.com', nacionalidad: 'Colombia', sexo: 'F' },
        { nombre: 'David', apellido: 'Fernández', telefono: '567890123', email: 'david.fernandez@example.com', nacionalidad: 'México', sexo: 'M' },
        { nombre: 'Laura', apellido: 'Rodríguez', telefono: '678901234', email: 'laura.rodriguez@example.com', nacionalidad: 'Ecuador', sexo: 'F' },
        { nombre: 'Luis', apellido: 'Gómez', telefono: '789012345', email: 'luis.gomez@example.com', nacionalidad: 'Bolivia', sexo: 'M' },
        { nombre: 'Isabel', apellido: 'Hernández', telefono: '890123456', email: 'isabel.hernandez@example.com', nacionalidad: 'Venezuela', sexo: 'F' },
        { nombre: 'Javier', apellido: 'Martínez', telefono: '901234567', email: 'javier.martinez@example.com', nacionalidad: 'Guatemala', sexo: 'M' },
        { nombre: 'Carla', apellido: 'Sánchez', telefono: '123456780', email: 'carla.sanchez@example.com', nacionalidad: 'Uruguay', sexo: 'F' },
        { nombre: 'Marco', apellido: 'Pérez', telefono: '234567891', email: 'marco.perez@example.com', nacionalidad: 'Paraguay', sexo: 'M' },
        { nombre: 'Estefanía', apellido: 'Gutiérrez', telefono: '345678902', email: 'estefania.gutierrez@example.com', nacionalidad: 'Bolivia', sexo: 'F' },
        { nombre: 'Santiago', apellido: 'Ortiz', telefono: '456789013', email: 'santiago.ortiz@example.com', nacionalidad: 'Panamá', sexo: 'M' },
        { nombre: 'Carolina', apellido: 'López', telefono: '567890134', email: 'carolina.lopez@example.com', nacionalidad: 'Costa Rica', sexo: 'F' },
        { nombre: 'Matías', apellido: 'Vargas', telefono: '678901245', email: 'matias.vargas@example.com', nacionalidad: 'Honduras', sexo: 'M' },
        { nombre: 'Andrea', apellido: 'Ramírez', telefono: '789012356', email: 'andrea.ramirez@example.com', nacionalidad: 'Nicaragua', sexo: 'F' },
        { nombre: 'Fernando', apellido: 'Rivera', telefono: '890123467', email: 'fernando.rivera@example.com', nacionalidad: 'El Salvador', sexo: 'M' },
        { nombre: 'Lucía', apellido: 'Pérez', telefono: '901234578', email: 'lucia.perez@example.com', nacionalidad: 'República Dominicana', sexo: 'F' },
        { nombre: 'Daniel', apellido: 'García', telefono: '123456791', email: 'daniel.garcia@example.com', nacionalidad: 'Cuba', sexo: 'M' },
        { nombre: 'María', apellido: 'Martínez', telefono: '234567892', email: 'maria.martinez@example.com', nacionalidad: 'Puerto Rico', sexo: 'F' },
        { nombre: 'Alejandro', apellido: 'Hernández', telefono: '345678903', email: 'alejandro.hernandez@example.com', nacionalidad: 'República Dominicana', sexo: 'M' },
        { nombre: 'Sandra', apellido: 'Sánchez', telefono: '456789014', email: 'sandra.sanchez@example.com', nacionalidad: 'Honduras', sexo: 'F' },
        { nombre: 'Jorge', apellido: 'Ortiz', telefono: '567890125', email: 'jorge.ortiz@example.com', nacionalidad: 'Nicaragua', sexo: 'M' },
        { nombre: 'Patricia', apellido: 'Vargas', telefono: '678901236', email: 'patricia.vargas@example.com', nacionalidad: 'Panamá', sexo: 'F' },
        { nombre: 'Ricardo', apellido: 'Ramírez', telefono: '789012347', email: 'ricardo.ramirez@example.com', nacionalidad: 'Costa Rica', sexo: 'M' },
        { nombre: 'Claudia', apellido: 'Rivera', telefono: '890123458', email: 'claudia.rivera@example.com', nacionalidad: 'El Salvador', sexo: 'F' },
        { nombre: 'Héctor', apellido: 'Pérez', telefono: '901234569', email: 'hector.perez@example.com', nacionalidad: 'Guatemala', sexo: 'M' },
        { nombre: 'Ana', apellido: 'García', telefono: '123456792', email: 'ana.garcia@example.com', nacionalidad: 'Colombia', sexo: 'F' },
        { nombre: 'Carlos', apellido: 'López', telefono: '234567893', email: 'carlos.lopez@example.com', nacionalidad: 'Venezuela', sexo: 'M' },
        { nombre: 'Sofía', apellido: 'Martínez', telefono: '345678904', email: 'sofia.martinez@example.com', nacionalidad: 'Bolivia', sexo: 'F' },
        { nombre: 'David', apellido: 'Fernández', telefono: '456789015', email: 'david.fernandez@example.com', nacionalidad: 'Argentina', sexo: 'M' },
        { nombre: 'Laura', apellido: 'Rodríguez', telefono: '567890126', email: 'laura.rodriguez@example.com', nacionalidad: 'Uruguay', sexo: 'F' },
        { nombre: 'Luis', apellido: 'Gómez', telefono: '678901237', email: 'luis.gomez@example.com', nacionalidad: 'Honduras', sexo: 'M' },
        { nombre: 'Isabel', apellido: 'Hernández', telefono: '789012348', email: 'isabel.hernandez@example.com', nacionalidad: 'Nicaragua', sexo: 'F' },
        { nombre: 'Javier', apellido: 'Martínez', telefono: '890123459', email: 'javier.martinez@example.com', nacionalidad: 'Panamá', sexo: 'M' },
        { nombre: 'Carla', apellido: 'Sánchez', telefono: '901234560', email: 'carla.sanchez@example.com', nacionalidad: 'Costa Rica', sexo: 'F' },
        { nombre: 'Marco', apellido: 'Pérez', telefono: '123456793', email: 'marco.perez@example.com', nacionalidad: 'Bolivia', sexo: 'M' },
        { nombre: 'Estefanía', apellido: 'Gutiérrez', telefono: '234567894', email: 'estefania.gutierrez@example.com', nacionalidad: 'Colombia', sexo: 'F' },
        { nombre: 'Santiago', apellido: 'Ortiz', telefono: '345678905', email: 'santiago.ortiz@example.com', nacionalidad: 'Venezuela', sexo: 'M' },
        { nombre: 'Carolina', apellido: 'López', telefono: '456789016', email: 'carolina.lopez@example.com', nacionalidad: 'Argentina', sexo: 'F' },
        { nombre: 'Matías', apellido: 'Vargas', telefono: '567890127', email: 'matias.vargas@example.com', nacionalidad: 'Uruguay', sexo: 'M' },
        { nombre: 'Andrea', apellido: 'Ramírez', telefono: '678901238', email: 'andrea.ramirez@example.com', nacionalidad: 'Chile', sexo: 'F' },
        { nombre: 'Fernando', apellido: 'Rivera', telefono: '789012349', email: 'fernando.rivera@example.com', nacionalidad: 'Paraguay', sexo: 'M' },
        { nombre: 'Lucía', apellido: 'Pérez', telefono: '890123461', email: 'lucia.perez@example.com', nacionalidad: 'Perú', sexo: 'F' },
        { nombre: 'Daniel', apellido: 'García', telefono: '901234572', email: 'daniel.garcia@example.com', nacionalidad: 'El Salvador', sexo: 'M' },
        { nombre: 'María', apellido: 'Martínez', telefono: '123456794', email: 'maria.martinez@example.com', nacionalidad: 'Guatemala', sexo: 'F' },
        { nombre: 'Alejandro', apellido: 'Hernández', telefono: '234567895', email: 'alejandro.hernandez@example.com', nacionalidad: 'Honduras', sexo: 'M' },
        { nombre: 'Sandra', apellido: 'Sánchez', telefono: '345678906', email: 'sandra.sanchez@example.com', nacionalidad: 'Nicaragua', sexo: 'F' },
        { nombre: 'Jorge', apellido: 'Ortiz', telefono: '456789017', email: 'jorge.ortiz@example.com', nacionalidad: 'Panamá', sexo: 'M' },
        { nombre: 'Patricia', apellido: 'Vargas', telefono: '567890138', email: 'patricia.vargas@example.com', nacionalidad: 'Costa Rica', sexo: 'F' },
        { nombre: 'Ricardo', apellido: 'Ramírez', telefono: '678901239', email: 'ricardo.ramirez@example.com', nacionalidad: 'El Salvador', sexo: 'M' },
        { nombre: 'Claudia', apellido: 'Rivera', telefono: '789012350', email: 'claudia.rivera@example.com', nacionalidad: 'Guatemala', sexo: 'F' },
        { nombre: 'Héctor', apellido: 'Pérez', telefono: '890123462', email: 'hector.perez@example.com', nacionalidad: 'Honduras', sexo: 'M' }
      ];
      

      clientes.forEach(cliente => {
        db.run(`INSERT INTO Clientes (n, a, t, e, na, s) VALUES (?, ?, ?, ?, ?, ?)`, [cliente.nombre, cliente.apellido, cliente.telefono, cliente.email, cliente.nacionalidad, cliente.sexo]);
      });

      // Insertar datos en la tabla Productos (Zapatillas)
      const productos = [
        { marca: 'Nike', modelo: 'Air Max', precio: 120.00, stock: 145 },
        { marca: 'Adidas', modelo: 'UltraBoost', precio: 150.00, stock: 158 },
        { marca: 'Puma', modelo: 'RS-X', precio: 110.00, stock: 102 },
        { marca: 'Reebok', modelo: 'Classic Leather', precio: 100.00, stock: 190 },
        { marca: 'New Balance', modelo: 'Fresh Foam', precio: 130.00, stock: 185 },
        { marca: 'Asics', modelo: 'GEL-Contend', precio: 115.00, stock: 112 },
        { marca: 'Under Armour', modelo: 'HOVR Phantom', precio: 140.00, stock: 134 },
        { marca: 'Converse', modelo: 'Chuck Taylor', precio: 70.00, stock: 151 },
        { marca: 'Vans', modelo: 'Old Skool', precio: 80.00, stock: 157 },
        { marca: 'Fila', modelo: 'Disruptor II', precio: 90.00, stock: 108 },
        { marca: 'Mizuno', modelo: 'Wave Rider', precio: 125.00, stock: 133 },
        { marca: 'Saucony', modelo: 'Kinvara', precio: 135.00, stock: 180 },
        { marca: 'Brooks', modelo: 'Ghost', precio: 140.00, stock: 169 },
        { marca: 'Hoka One One', modelo: 'Clifton', precio: 150.00, stock: 155 },
        { marca: 'Jordan', modelo: 'Air Jordan 1', precio: 200.00, stock: 194 },
        { marca: 'Nike', modelo: 'Blazer', precio: 100.00, stock: 118 },
        { marca: 'Adidas', modelo: 'Stan Smith', precio: 85.00, stock: 134 },
        { marca: 'Puma', modelo: 'Cali', precio: 95.00, stock: 191 },
        { marca: 'Reebok', modelo: 'Nano X', precio: 130.00, stock: 120 },
        { marca: 'New Balance', modelo: '997H', precio: 110.00, stock: 192 },
        { marca: 'Asics', modelo: 'GEL-Kayano', precio: 160.00, stock: 194 },
        { marca: 'Under Armour', modelo: 'Charged Bandit', precio: 120.00, stock: 180 },
        { marca: 'Converse', modelo: 'One Star', precio: 75.00, stock: 185 },
        { marca: 'Vans', modelo: 'Sk8-Hi', precio: 85.00, stock: 152 },
        { marca: 'Fila', modelo: 'Ray Tracer', precio: 105.00, stock: 153 },
        { marca: 'Mizuno', modelo: 'Rebula', precio: 140.00, stock: 161 },
        { marca: 'Saucony', modelo: 'Ride', precio: 120.00, stock: 177 },
        { marca: 'Brooks', modelo: 'Adrenaline GTS', precio: 130.00, stock: 185 },
        { marca: 'Hoka One One', modelo: 'Bondi', precio: 160.00, stock: 190 }
    ];
    
      productos.forEach(producto => {
        db.run(`INSERT INTO Productos (m, mo, p, st) VALUES (?, ?, ?, ?)`,
          [producto.marca, producto.modelo, producto.precio, producto.stock]);
      });
      

 // Insertar datos en la tabla Ventas (120 registros)
 const ventas = [
  { id_cliente: 34, id_producto: 6, fecha: '2022-06-15', forma_pago: 'Efectivo', cantidad: 2 },
  { id_cliente: 23, id_producto: 12, fecha: '2019-08-20', forma_pago: 'Tarjeta', cantidad: 4 },
  { id_cliente: 52, id_producto: 3, fecha: '2021-11-10', forma_pago: 'Tarjeta', cantidad: 3 },
  { id_cliente: 45, id_producto: 18, fecha: '2020-03-08', forma_pago: 'Efectivo', cantidad: 5 },
  { id_cliente: 12, id_producto: 9, fecha: '2018-07-25', forma_pago: 'Efectivo', cantidad: 1 },
  { id_cliente: 37, id_producto: 21, fecha: '2019-09-16', forma_pago: 'Tarjeta', cantidad: 4 },
  { id_cliente: 29, id_producto: 7, fecha: '2023-05-02', forma_pago: 'Efectivo', cantidad: 2 },
  { id_cliente: 11, id_producto: 17, fecha: '2017-12-30', forma_pago: 'Tarjeta', cantidad: 3 },
  { id_cliente: 33, id_producto: 13, fecha: '2016-02-28', forma_pago: 'Efectivo', cantidad: 1 },
  { id_cliente: 21, id_producto: 20, fecha: '2024-04-12', forma_pago: 'Tarjeta', cantidad: 5 },
  { id_cliente: 10, id_producto: 16, fecha: '2019-01-19', forma_pago: 'Efectivo', cantidad: 2 },
  { id_cliente: 20, id_producto: 2, fecha: '2023-07-08', forma_pago: 'Tarjeta', cantidad: 4 },
  { id_cliente: 35, id_producto: 15, fecha: '2020-09-05', forma_pago: 'Efectivo', cantidad: 3 },
  { id_cliente: 18, id_producto: 19, fecha: '2021-03-11', forma_pago: 'Tarjeta', cantidad: 5 },
  { id_cliente: 50, id_producto: 23, fecha: '2018-11-17', forma_pago: 'Efectivo', cantidad: 1 },
  { id_cliente: 3, id_producto: 8, fecha: '2017-01-23', forma_pago: 'Tarjeta', cantidad: 2 },
  { id_cliente: 40, id_producto: 22, fecha: '2022-10-06', forma_pago: 'Efectivo', cantidad: 4 },
  { id_cliente: 15, id_producto: 24, fecha: '2019-04-29', forma_pago: 'Tarjeta', cantidad: 3 },
  { id_cliente: 27, id_producto: 1, fecha: '2024-08-15', forma_pago: 'Efectivo', cantidad: 5 },
  { id_cliente: 8, id_producto: 11, fecha: '2021-12-23', forma_pago: 'Tarjeta', cantidad: 1 },
  { id_cliente: 43, id_producto: 5, fecha: '2016-05-09', forma_pago: 'Efectivo', cantidad: 2 },
  { id_cliente: 14, id_producto: 25, fecha: '2018-09-12', forma_pago: 'Tarjeta', cantidad: 4 },
  { id_cliente: 51, id_producto: 14, fecha: '2023-01-30', forma_pago: 'Efectivo', cantidad: 3 },
  { id_cliente: 46, id_producto: 26, fecha: '2020-06-20', forma_pago: 'Tarjeta', cantidad: 5 },
  { id_cliente: 39, id_producto: 29, fecha: '2019-11-07', forma_pago: 'Efectivo', cantidad: 1 },
  { id_cliente: 32, id_producto: 27, fecha: '2022-12-25', forma_pago: 'Tarjeta', cantidad: 2 },
  { id_cliente: 25, id_producto: 28, fecha: '2017-03-03', forma_pago: 'Efectivo', cantidad: 4 },
  { id_cliente: 4, id_producto: 10, fecha: '2024-01-17', forma_pago: 'Tarjeta', cantidad: 3 },
  { id_cliente: 9, id_producto: 3, fecha: '2018-10-05', forma_pago: 'Efectivo', cantidad: 5 },
  { id_cliente: 36, id_producto: 6, fecha: '2020-08-23', forma_pago: 'Tarjeta', cantidad: 1 },
  { id_cliente: 44, id_producto: 13, fecha: '2023-09-01', forma_pago: 'Efectivo', cantidad: 2 },
  { id_cliente: 30, id_producto: 18, fecha: '2021-05-12', forma_pago: 'Tarjeta', cantidad: 4 },
  { id_cliente: 22, id_producto: 8, fecha: '2017-07-28', forma_pago: 'Efectivo', cantidad: 3 },
  { id_cliente: 7, id_producto: 7, fecha: '2024-02-19', forma_pago: 'Tarjeta', cantidad: 5 },
  { id_cliente: 28, id_producto: 12, fecha: '2016-11-04', forma_pago: 'Efectivo', cantidad: 1 },
  { id_cliente: 13, id_producto: 19, fecha: '2023-04-27', forma_pago: 'Tarjeta', cantidad: 2 },
  { id_cliente: 5, id_producto: 23, fecha: '2020-12-14', forma_pago: 'Efectivo', cantidad: 4 },
  { id_cliente: 26, id_producto: 1, fecha: '2022-08-03', forma_pago: 'Tarjeta', cantidad: 3 },
  { id_cliente: 42, id_producto: 17, fecha: '2019-02-25', forma_pago: 'Efectivo', cantidad: 5 },
  { id_cliente: 16, id_producto: 9, fecha: '2024-03-09', forma_pago: 'Tarjeta', cantidad: 1 },
  { id_cliente: 31, id_producto: 15, fecha: '2017-06-18', forma_pago: 'Efectivo', cantidad: 2 },
  { id_cliente: 19, id_producto: 21, fecha: '2021-10-29', forma_pago: 'Tarjeta', cantidad: 4 },
  { id_cliente: 38, id_producto: 2, fecha: '2020-05-06', forma_pago: 'Efectivo', cantidad: 3 },
  { id_cliente: 48, id_producto: 25, fecha: '2018-08-22', forma_pago: 'Tarjeta', cantidad: 5 },
  { id_cliente: 41, id_producto: 14, fecha: '2023-12-24', forma_pago: 'Efectivo', cantidad: 1 },
  { id_cliente: 49, id_producto: 24, fecha: '2021-09-15', forma_pago: 'Tarjeta', cantidad: 2 },
  { id_cliente: 6, id_producto: 5, fecha: '2017-04-11', forma_pago: 'Efectivo', cantidad: 4 },
  { id_cliente: 47, id_producto: 22, fecha: '2024-07-20', forma_pago: 'Tarjeta', cantidad: 3 },
  { id_cliente: 17, id_producto: 10, fecha: '2019-03-27', forma_pago: 'Efectivo', cantidad: 5 },
  { id_cliente: 1, id_producto: 16, fecha: '2022-10-08', forma_pago: 'Tarjeta', cantidad: 1 },
  { id_cliente: 2, id_producto: 5, fecha: '2023-06-14', forma_pago: 'Efectivo', cantidad: 2 },
  { id_cliente: 20, id_producto: 25, fecha: '2018-12-19', forma_pago: 'Tarjeta', cantidad: 4 },
  { id_cliente: 24, id_producto: 29, fecha: '2020-01-22', forma_pago: 'Efectivo', cantidad: 3 },
  { id_cliente: 41, id_producto: 7, fecha: '2024-11-03', forma_pago: 'Tarjeta', cantidad: 5 },
  { id_cliente: 38, id_producto: 23, fecha: '2019-07-21', forma_pago: 'Efectivo', cantidad: 1 },
  { id_cliente: 50, id_producto: 2, fecha: '2022-05-30', forma_pago: 'Tarjeta', cantidad: 2 },
  { id_cliente: 3, id_producto: 28, fecha: '2017-08-06', forma_pago: 'Efectivo', cantidad: 4 },
  { id_cliente: 12, id_producto: 19, fecha: '2021-01-19', forma_pago: 'Tarjeta', cantidad: 3 },
  { id_cliente: 13, id_producto: 3, fecha: '2020-09-15', forma_pago: 'Efectivo', cantidad: 5 },
  { id_cliente: 26, id_producto: 20, fecha: '2018-03-22', forma_pago: 'Tarjeta', cantidad: 1 },
  { id_cliente: 35, id_producto: 22, fecha: '2024-01-27', forma_pago: 'Efectivo', cantidad: 2 },
  { id_cliente: 45, id_producto: 8, fecha: '2019-11-08', forma_pago: 'Tarjeta', cantidad: 4 },
  { id_cliente: 43, id_producto: 12, fecha: '2022-07-29', forma_pago: 'Efectivo', cantidad: 3 },
  { id_cliente: 49, id_producto: 6, fecha: '2020-02-17', forma_pago: 'Tarjeta', cantidad: 5 },
  { id_cliente: 51, id_producto: 1, fecha: '2023-09-11', forma_pago: 'Efectivo', cantidad: 1 },
  { id_cliente: 33, id_producto: 24, fecha: '2017-10-19', forma_pago: 'Tarjeta', cantidad: 2 },
  { id_cliente: 18, id_producto: 9, fecha: '2024-06-01', forma_pago: 'Efectivo', cantidad: 4 },
  { id_cliente: 22, id_producto: 11, fecha: '2019-02-03', forma_pago: 'Tarjeta', cantidad: 3 },
  { id_cliente: 29, id_producto: 7, fecha: '2021-07-14', forma_pago: 'Efectivo', cantidad: 5 },
  { id_cliente: 10, id_producto: 14, fecha: '2020-10-26', forma_pago: 'Tarjeta', cantidad: 1 },
  { id_cliente: 20, id_producto: 18, fecha: '2018-05-15', forma_pago: 'Efectivo', cantidad: 2 },
  { id_cliente: 9, id_producto: 21, fecha: '2023-08-20', forma_pago: 'Tarjeta', cantidad: 4 },
  { id_cliente: 25, id_producto: 23, fecha: '2021-04-07', forma_pago: 'Efectivo', cantidad: 3 },
  { id_cliente: 34, id_producto: 2, fecha: '2016-06-24', forma_pago: 'Tarjeta', cantidad: 5 },
  { id_cliente: 36, id_producto: 19, fecha: '2022-09-18', forma_pago: 'Efectivo', cantidad: 1 },
  { id_cliente: 14, id_producto: 5, fecha: '2019-12-31', forma_pago: 'Tarjeta', cantidad: 2 },
  { id_cliente: 51, id_producto: 28, fecha: '2024-04-23', forma_pago: 'Efectivo', cantidad: 4 },
  { id_cliente: 20, id_producto: 9, fecha: '2017-11-13', forma_pago: 'Tarjeta', cantidad: 3 },
  { id_cliente: 39, id_producto: 27, fecha: '2023-03-04', forma_pago: 'Efectivo', cantidad: 5 },
  { id_cliente: 11, id_producto: 22, fecha: '2020-08-09', forma_pago: 'Tarjeta', cantidad: 1 },
  { id_cliente: 15, id_producto: 1, fecha: '2021-06-27', forma_pago: 'Efectivo', cantidad: 2 },
  { id_cliente: 6, id_producto: 26, fecha: '2018-10-17', forma_pago: 'Tarjeta', cantidad: 4 },
  { id_cliente: 30, id_producto: 11, fecha: '2024-02-02', forma_pago: 'Efectivo', cantidad: 3 },
  { id_cliente: 43, id_producto: 17, fecha: '2019-05-29', forma_pago: 'Tarjeta', cantidad: 5 },
  { id_cliente: 48, id_producto: 29, fecha: '2023-07-11', forma_pago: 'Efectivo', cantidad: 1 },
  { id_cliente: 38, id_producto: 6, fecha: '2020-12-22', forma_pago: 'Tarjeta', cantidad: 2 },
  { id_cliente: 14, id_producto: 21, fecha: '2017-08-30', forma_pago: 'Efectivo', cantidad: 4 },
  { id_cliente: 2, id_producto: 27, fecha: '2021-04-19', forma_pago: 'Tarjeta', cantidad: 3 },
  { id_cliente: 3, id_producto: 18, fecha: '2019-10-16', forma_pago: 'Efectivo', cantidad: 5 },
  { id_cliente: 23, id_producto: 4, fecha: '2024-08-28', forma_pago: 'Tarjeta', cantidad: 1 },
  { id_cliente: 35, id_producto: 10, fecha: '2018-09-13', forma_pago: 'Efectivo', cantidad: 2 },
  { id_cliente: 7, id_producto: 13, fecha: '2023-05-04', forma_pago: 'Tarjeta', cantidad: 4 },
  { id_cliente: 42, id_producto: 3, fecha: '2020-11-19', forma_pago: 'Efectivo', cantidad: 3 },
  { id_cliente: 33, id_producto: 5, fecha: '2017-02-26', forma_pago: 'Tarjeta', cantidad: 5 },
  { id_cliente: 25, id_producto: 24, fecha: '2024-03-15', forma_pago: 'Efectivo', cantidad: 1 },
  { id_cliente: 10, id_producto: 8, fecha: '2019-06-08', forma_pago: 'Tarjeta', cantidad: 2 },
  { id_cliente: 50, id_producto: 29, fecha: '2023-10-27', forma_pago: 'Efectivo', cantidad: 4 },
  { id_cliente: 44, id_producto: 14, fecha: '2021-08-22', forma_pago: 'Tarjeta', cantidad: 3 },
  { id_cliente: 41, id_producto: 6, fecha: '2016-01-31', forma_pago: 'Efectivo', cantidad: 5 },
  { id_cliente: 15, id_producto: 19, fecha: '2024-09-20', forma_pago: 'Tarjeta', cantidad: 1 },
  { id_cliente: 34, id_producto: 25, fecha: '2017-05-11', forma_pago: 'Efectivo', cantidad: 2 },
  { id_cliente: 5, id_producto: 22, fecha: '2020-04-14', forma_pago: 'Tarjeta', cantidad: 4 },
  { id_cliente: 27, id_producto: 7, fecha: '2023-08-16', forma_pago: 'Efectivo', cantidad: 3 },
  { id_cliente: 18, id_producto: 3, fecha: '2018-12-20', forma_pago: 'Tarjeta', cantidad: 5 },
  { id_cliente: 48, id_producto: 23, fecha: '2021-02-24', forma_pago: 'Efectivo', cantidad: 1 },
  { id_cliente: 41, id_producto: 1, fecha: '2022-07-17', forma_pago: 'Tarjeta', cantidad: 2 },
  { id_cliente: 50, id_producto: 15, fecha: '2017-09-09', forma_pago: 'Efectivo', cantidad: 4 },
  { id_cliente: 29, id_producto: 6, fecha: '2024-06-25', forma_pago: 'Tarjeta', cantidad: 3 },
  { id_cliente: 36, id_producto: 27, fecha: '2019-03-06', forma_pago: 'Efectivo', cantidad: 5 },
  { id_cliente: 14, id_producto: 20, fecha: '2020-10-18', forma_pago: 'Tarjeta', cantidad: 1 },
  { id_cliente: 51, id_producto: 13, fecha: '2023-01-13', forma_pago: 'Efectivo', cantidad: 2 },
  { id_cliente: 30, id_producto: 29, fecha: '2018-06-26', forma_pago: 'Tarjeta', cantidad: 4 },
  { id_cliente: 20, id_producto: 1, fecha: '2024-09-09', forma_pago: 'Efectivo', cantidad: 3 },
  { id_cliente: 33, id_producto: 23, fecha: '2017-12-22', forma_pago: 'Tarjeta', cantidad: 5 },
  { id_cliente: 27, id_producto: 2, fecha: '2023-02-01', forma_pago: 'Efectivo', cantidad: 1 },
  { id_cliente: 43, id_producto: 26, fecha: '2019-11-27', forma_pago: 'Tarjeta', cantidad: 2 },
  { id_cliente: 7, id_producto: 9, fecha: '2020-07-14', forma_pago: 'Efectivo', cantidad: 4 },
  { id_cliente: 50, id_producto: 5, fecha: '2024-01-23', forma_pago: 'Tarjeta', cantidad: 3 },
  { id_cliente: 15, id_producto: 17, fecha: '2018-08-02', forma_pago: 'Efectivo', cantidad: 5 },
  { id_cliente: 8, id_producto: 20, fecha: '2021-11-12', forma_pago: 'Tarjeta', cantidad: 1 },
  { id_cliente: 42, id_producto: 14, fecha: '2023-06-30', forma_pago: 'Efectivo', cantidad: 2 },
  { id_cliente: 31, id_producto: 8, fecha: '2019-07-18', forma_pago: 'Tarjeta', cantidad: 4 },
  { id_cliente: 20, id_producto: 12, fecha: '2020-05-19', forma_pago: 'Efectivo', cantidad: 3 },
  { id_cliente: 39, id_producto: 22, fecha: '2018-02-10', forma_pago: 'Tarjeta', cantidad: 5 },
  { id_cliente: 18, id_producto: 5, fecha: '2024-12-05', forma_pago: 'Efectivo', cantidad: 1 },
  { id_cliente: 4, id_producto: 28, fecha: '2021-03-31', forma_pago: 'Tarjeta', cantidad: 2 },
  { id_cliente: 2, id_producto: 6, fecha: '2017-10-29', forma_pago: 'Efectivo', cantidad: 4 },
  { id_cliente: 13, id_producto: 15, fecha: '2023-09-13', forma_pago: 'Tarjeta', cantidad: 3 },
  { id_cliente: 27, id_producto: 9, fecha: '2019-01-06', forma_pago: 'Efectivo', cantidad: 5 },
  { id_cliente: 35, id_producto: 29, fecha: '2020-08-30', forma_pago: 'Tarjeta', cantidad: 1 },
  { id_cliente: 23, id_producto: 10, fecha: '2021-06-04', forma_pago: 'Efectivo', cantidad: 2 },
  { id_cliente: 30, id_producto: 17, fecha: '2018-11-21', forma_pago: 'Tarjeta', cantidad: 4 },
  { id_cliente: 51, id_producto: 3, fecha: '2023-04-07', forma_pago: 'Efectivo', cantidad: 3 },
  { id_cliente: 19, id_producto: 26, fecha: '2017-12-03', forma_pago: 'Tarjeta', cantidad: 5 },
  { id_cliente: 12, id_producto: 24, fecha: '2024-08-17', forma_pago: 'Efectivo', cantidad: 1 },
  { id_cliente: 5, id_producto: 7, fecha: '2021-09-23', forma_pago: 'Tarjeta', cantidad: 2 },
  { id_cliente: 43, id_producto: 19, fecha: '2018-04-02', forma_pago: 'Efectivo', cantidad: 4 },
  { id_cliente: 50, id_producto: 21, fecha: '2020-12-20', forma_pago: 'Tarjeta', cantidad: 3 },
  { id_cliente: 15, id_producto: 13, fecha: '2017-02-16', forma_pago: 'Efectivo', cantidad: 5 },
  { id_cliente: 29, id_producto: 1, fecha: '2024-05-05', forma_pago: 'Tarjeta', cantidad: 1 },
  { id_cliente: 20, id_producto: 25, fecha: '2021-07-27', forma_pago: 'Efectivo', cantidad: 2 },
  { id_cliente: 39, id_producto: 16, fecha: '2019-09-11', forma_pago: 'Tarjeta', cantidad: 4 },
  { id_cliente: 18, id_producto: 29, fecha: '2023-01-16', forma_pago: 'Efectivo', cantidad: 3 },
  { id_cliente: 4, id_producto: 23, fecha: '2020-03-06', forma_pago: 'Tarjeta', cantidad: 5 },
  { id_cliente: 2, id_producto: 20, fecha: '2018-07-19', forma_pago: 'Efectivo', cantidad: 1 },
  { id_cliente: 13, id_producto: 8, fecha: '2021-11-15', forma_pago: 'Tarjeta', cantidad: 2 },
  { id_cliente: 27, id_producto: 11, fecha: '2019-08-04', forma_pago: 'Efectivo', cantidad: 4 },
  { id_cliente: 35, id_producto: 2, fecha: '2023-06-28', forma_pago: 'Tarjeta', cantidad: 3 },
  { id_cliente: 23, id_producto: 19, fecha: '2018-03-25', forma_pago: 'Efectivo', cantidad: 5 },
  { id_cliente: 30, id_producto: 25, fecha: '2020-11-16', forma_pago: 'Tarjeta', cantidad: 1 },
  { id_cliente: 51, id_producto: 7, fecha: '2024-07-06', forma_pago: 'Efectivo', cantidad: 2 },
  { id_cliente: 19, id_producto: 29, fecha: '2017-09-01', forma_pago: 'Tarjeta', cantidad: 4 },
  { id_cliente: 12, id_producto: 6, fecha: '2023-02-21', forma_pago: 'Efectivo', cantidad: 3 },
  { id_cliente: 5, id_producto: 17, fecha: '2021-04-14', forma_pago: 'Tarjeta', cantidad: 5 },
  { id_cliente: 43, id_producto: 1, fecha: '2020-01-12', forma_pago: 'Efectivo', cantidad: 1 },
  { id_cliente: 50, id_producto: 26, fecha: '2018-08-30', forma_pago: 'Tarjeta', cantidad: 2 },
  { id_cliente: 15, id_producto: 9, fecha: '2024-05-17', forma_pago: 'Efectivo', cantidad: 4 },
  { id_cliente: 29, id_producto: 23, fecha: '2019-11-28', forma_pago: 'Tarjeta', cantidad: 3 },
  { id_cliente: 20, id_producto: 18, fecha: '2021-08-13', forma_pago: 'Efectivo', cantidad: 1 },
  { id_cliente: 39, id_producto: 7, fecha: '2017-12-31', forma_pago: 'Tarjeta', cantidad: 5 },
  { id_cliente: 18, id_producto: 5, fecha: '2023-04-18', forma_pago: 'Efectivo', cantidad: 2 },
  { id_cliente: 4, id_producto: 26, fecha: '2020-09-10', forma_pago: 'Tarjeta', cantidad: 3 },
  { id_cliente: 2, id_producto: 15, fecha: '2018-02-25', forma_pago: 'Efectivo', cantidad: 4 },
  { id_cliente: 13, id_producto: 10, fecha: '2021-06-13', forma_pago: 'Tarjeta', cantidad: 5 },
  { id_cliente: 27, id_producto: 3, fecha: '2019-10-24', forma_pago: 'Efectivo', cantidad: 1 },
  { id_cliente: 35, id_producto: 25, fecha: '2023-09-05', forma_pago: 'Tarjeta', cantidad: 2 },
  { id_cliente: 23, id_producto: 16, fecha: '2018-05-15', forma_pago: 'Efectivo', cantidad: 4 },
  { id_cliente: 30, id_producto: 12, fecha: '2020-01-29', forma_pago: 'Tarjeta', cantidad: 3 },
  { id_cliente: 51, id_producto: 29, fecha: '2024-03-23', forma_pago: 'Efectivo', cantidad: 5 },
  { id_cliente: 19, id_producto: 28, fecha: '2017-07-04', forma_pago: 'Tarjeta', cantidad: 1 },
  { id_cliente: 12, id_producto: 1, fecha: '2023-11-06', forma_pago: 'Efectivo', cantidad: 2 },
  { id_cliente: 5, id_producto: 24, fecha: '2021-01-23', forma_pago: 'Tarjeta', cantidad: 3 },
  { id_cliente: 43, id_producto: 21, fecha: '2020-06-08', forma_pago: 'Efectivo', cantidad: 4 },
  { id_cliente: 50, id_producto: 14, fecha: '2018-11-21', forma_pago: 'Tarjeta', cantidad: 5 },
  { id_cliente: 15, id_producto: 5, fecha: '2024-10-04', forma_pago: 'Efectivo', cantidad: 1 },
  { id_cliente: 29, id_producto: 8, fecha: '2019-03-15', forma_pago: 'Tarjeta', cantidad: 2 },
  { id_cliente: 20, id_producto: 27, fecha: '2021-12-30', forma_pago: 'Efectivo', cantidad: 4 },
  { id_cliente: 39, id_producto: 5, fecha: '2017-04-18', forma_pago: 'Tarjeta', cantidad: 3 },
  { id_cliente: 18, id_producto: 14, fecha: '2023-08-20', forma_pago: 'Efectivo', cantidad: 5 },
  { id_cliente: 4, id_producto: 23, fecha: '2020-07-09', forma_pago: 'Tarjeta', cantidad: 1 },
  { id_cliente: 2, id_producto: 6, fecha: '2018-09-25', forma_pago: 'Efectivo', cantidad: 4 },
  { id_cliente: 13, id_producto: 10, fecha: '2021-07-16', forma_pago: 'Tarjeta', cantidad: 5 },
  { id_cliente: 27, id_producto: 3, fecha: '2019-01-27', forma_pago: 'Efectivo', cantidad: 1 },
  { id_cliente: 35, id_producto: 25, fecha: '2023-12-05', forma_pago: 'Tarjeta', cantidad: 2 },
  { id_cliente: 23, id_producto: 16, fecha: '2018-06-28', forma_pago: 'Efectivo', cantidad: 4 },
  { id_cliente: 30, id_producto: 12, fecha: '2020-05-30', forma_pago: 'Tarjeta', cantidad: 3 },
  { id_cliente: 51, id_producto: 29, fecha: '2024-05-18', forma_pago: 'Efectivo', cantidad: 5 },
  { id_cliente: 19, id_producto: 28, fecha: '2017-01-16', forma_pago: 'Tarjeta', cantidad: 1 },
  { id_cliente: 12, id_producto: 1, fecha: '2023-09-12', forma_pago: 'Efectivo', cantidad: 2 },
  { id_cliente: 5, id_producto: 24, fecha: '2021-02-08', forma_pago: 'Tarjeta', cantidad: 3 },
  { id_cliente: 43, id_producto: 21, fecha: '2020-11-18', forma_pago: 'Efectivo', cantidad: 4 },
  { id_cliente: 50, id_producto: 14, fecha: '2018-05-13', forma_pago: 'Tarjeta', cantidad: 5 },
  { id_cliente: 15, id_producto: 5, fecha: '2024-06-15', forma_pago: 'Efectivo', cantidad: 1 },
  { id_cliente: 29, id_producto: 8, fecha: '2019-08-02', forma_pago: 'Tarjeta', cantidad: 2 },
  { id_cliente: 20, id_producto: 27, fecha: '2021-01-23', forma_pago: 'Efectivo', cantidad: 4 },
  { id_cliente: 39, id_producto: 5, fecha: '2017-10-19', forma_pago: 'Tarjeta', cantidad: 3 },
  { id_cliente: 18, id_producto: 14, fecha: '2023-03-14', forma_pago: 'Efectivo', cantidad: 5 },
  { id_cliente: 4, id_producto: 23, fecha: '2020-02-20', forma_pago: 'Tarjeta', cantidad: 1 },
  { id_cliente: 2, id_producto: 6, fecha: '2018-11-12', forma_pago: 'Efectivo', cantidad: 4 },
  { id_cliente: 13, id_producto: 10, fecha: '2021-12-04', forma_pago: 'Tarjeta', cantidad: 5 },
  { id_cliente: 27, id_producto: 3, fecha: '2019-06-23', forma_pago: 'Efectivo', cantidad: 1 },
  { id_cliente: 35, id_producto: 25, fecha: '2024-02-11', forma_pago: 'Tarjeta', cantidad: 2 },
  { id_cliente: 23, id_producto: 16, fecha: '2018-10-07', forma_pago: 'Efectivo', cantidad: 4 },
  { id_cliente: 30, id_producto: 12, fecha: '2020-08-19', forma_pago: 'Tarjeta', cantidad: 3 },
  { id_cliente: 51, id_producto: 29, fecha: '2024-09-02', forma_pago: 'Efectivo', cantidad: 5 },
  { id_cliente: 19, id_producto: 28, fecha: '2017-05-27', forma_pago: 'Tarjeta', cantidad: 1 },
  { id_cliente: 12, id_producto: 1, fecha: '2023-02-01', forma_pago: 'Efectivo', cantidad: 2 },
  { id_cliente: 5, id_producto: 24, fecha: '2021-03-31', forma_pago: 'Tarjeta', cantidad: 3 },
  { id_cliente: 43, id_producto: 21, fecha: '2020-09-27', forma_pago: 'Efectivo', cantidad: 4 },
  { id_cliente: 50, id_producto: 14, fecha: '2018-02-20', forma_pago: 'Tarjeta', cantidad: 5 },
  { id_cliente: 15, id_producto: 5, fecha: '2024-03-12', forma_pago: 'Efectivo', cantidad: 1 },
  { id_cliente: 29, id_producto: 8, fecha: '2019-04-29', forma_pago: 'Tarjeta', cantidad: 2 },
  { id_cliente: 20, id_producto: 27, fecha: '2021-10-01', forma_pago: 'Efectivo', cantidad: 4 },
  { id_cliente: 39, id_producto: 5, fecha: '2017-08-12', forma_pago: 'Tarjeta', cantidad: 3 },
  { id_cliente: 18, id_producto: 14, fecha: '2023-06-10', forma_pago: 'Efectivo', cantidad: 5 },
  { id_cliente: 4, id_producto: 23, fecha: '2020-04-29', forma_pago: 'Tarjeta', cantidad: 1 },
  { id_cliente: 2, id_producto: 6, fecha: '2018-06-06', forma_pago: 'Efectivo', cantidad: 4 },
  { id_cliente: 13, id_producto: 10, fecha: '2021-08-21', forma_pago: 'Tarjeta', cantidad: 5 },
  { id_cliente: 27, id_producto: 3, fecha: '2019-07-15', forma_pago: 'Efectivo', cantidad: 1 },
  { id_cliente: 35, id_producto: 25, fecha: '2023-11-15', forma_pago: 'Tarjeta', cantidad: 2 },
  { id_cliente: 23, id_producto: 16, fecha: '2018-09-26', forma_pago: 'Efectivo', cantidad: 4 },
  { id_cliente: 30, id_producto: 12, fecha: '2020-03-13', forma_pago: 'Tarjeta', cantidad: 3 },
  { id_cliente: 51, id_producto: 29, fecha: '2024-06-09', forma_pago: 'Efectivo', cantidad: 5 },
  { id_cliente: 19, id_producto: 28, fecha: '2017-11-29', forma_pago: 'Tarjeta', cantidad: 1 },
  { id_cliente: 12, id_producto: 1, fecha: '2023-08-04', forma_pago: 'Efectivo', cantidad: 2 },
  { id_cliente: 5, id_producto: 24, fecha: '2021-05-19', forma_pago: 'Tarjeta', cantidad: 3 },
  { id_cliente: 43, id_producto: 21, fecha: '2020-10-22', forma_pago: 'Efectivo', cantidad: 4 },
  { id_cliente: 50, id_producto: 14, fecha: '2018-04-02', forma_pago: 'Tarjeta', cantidad: 5 },
  { id_cliente: 15, id_producto: 5, fecha: '2024-09-21', forma_pago: 'Efectivo', cantidad: 1 },
  { id_cliente: 29, id_producto: 8, fecha: '2019-02-05', forma_pago: 'Tarjeta', cantidad: 2 },
  { id_cliente: 20, id_producto: 27, fecha: '2021-04-28', forma_pago: 'Efectivo', cantidad: 4 },
  { id_cliente: 39, id_producto: 5, fecha: '2017-06-21', forma_pago: 'Tarjeta', cantidad: 3 },
  { id_cliente: 18, id_producto: 14, fecha: '2023-10-11', forma_pago: 'Efectivo', cantidad: 5 },
  { id_cliente: 4, id_producto: 23, fecha: '2020-05-25', forma_pago: 'Tarjeta', cantidad: 1 },
  { id_cliente: 2, id_producto: 6, fecha: '2018-12-01', forma_pago: 'Efectivo', cantidad: 4 },
  { id_cliente: 13, id_producto: 10, fecha: '2021-10-18', forma_pago: 'Tarjeta', cantidad: 5 },
  { id_cliente: 27, id_producto: 3, fecha: '2019-05-16', forma_pago: 'Efectivo', cantidad: 1 },
  { id_cliente: 35, id_producto: 25, fecha: '2023-01-20', forma_pago: 'Tarjeta', cantidad: 2 },
  { id_cliente: 23, id_producto: 16, fecha: '2018-07-05', forma_pago: 'Efectivo', cantidad: 4 },
  { id_cliente: 30, id_producto: 12, fecha: '2020-06-11', forma_pago: 'Tarjeta', cantidad: 3 },
  { id_cliente: 51, id_producto: 29, fecha: '2024-01-15', forma_pago: 'Efectivo', cantidad: 5 },
  { id_cliente: 19, id_producto: 28, fecha: '2017-03-16', forma_pago: 'Tarjeta', cantidad: 1 },
  { id_cliente: 12, id_producto: 1, fecha: '2023-12-13', forma_pago: 'Efectivo', cantidad: 2 },
  { id_cliente: 5, id_producto: 24, fecha: '2021-11-03', forma_pago: 'Tarjeta', cantidad: 3 },
  { id_cliente: 43, id_producto: 21, fecha: '2020-08-15', forma_pago: 'Efectivo', cantidad: 4 },
  { id_cliente: 50, id_producto: 14, fecha: '2018-10-12', forma_pago: 'Tarjeta', cantidad: 5 },
  { id_cliente: 15, id_producto: 5, fecha: '2024-02-02', forma_pago: 'Efectivo', cantidad: 1 },
  { id_cliente: 29, id_producto: 8, fecha: '2019-07-12', forma_pago: 'Tarjeta', cantidad: 2 },
  { id_cliente: 20, id_producto: 27, fecha: '2021-06-27', forma_pago: 'Efectivo', cantidad: 4 },
  { id_cliente: 39, id_producto: 5, fecha: '2017-09-19', forma_pago: 'Tarjeta', cantidad: 3 },
  { id_cliente: 18, id_producto: 14, fecha: '2023-05-06', forma_pago: 'Efectivo', cantidad: 5 },
  { id_cliente: 4, id_producto: 23, fecha: '2020-01-09', forma_pago: 'Tarjeta', cantidad: 1 },
  { id_cliente: 2, id_producto: 6, fecha: '2018-05-03', forma_pago: 'Efectivo', cantidad: 4 },
  { id_cliente: 13, id_producto: 10, fecha: '2021-09-20', forma_pago: 'Tarjeta', cantidad: 5 },
  { id_cliente: 27, id_producto: 3, fecha: '2019-02-13', forma_pago: 'Efectivo', cantidad: 1 },
  { id_cliente: 35, id_producto: 25, fecha: '2023-08-23', forma_pago: 'Tarjeta', cantidad: 2 },
  { id_cliente: 23, id_producto: 16, fecha: '2018-11-18', forma_pago: 'Efectivo', cantidad: 4 },
  { id_cliente: 30, id_producto: 12, fecha: '2020-09-24', forma_pago: 'Tarjeta', cantidad: 3 },
  { id_cliente: 51, id_producto: 29, fecha: '2024-04-06', forma_pago: 'Efectivo', cantidad: 5 },
  { id_cliente: 19, id_producto: 28, fecha: '2017-12-21', forma_pago: 'Tarjeta', cantidad: 1 },
  { id_cliente: 12, id_producto: 1, fecha: '2023-07-30', forma_pago: 'Efectivo', cantidad: 2 },
  { id_cliente: 5, id_producto: 24, fecha: '2021-08-15', forma_pago: 'Tarjeta', cantidad: 3 },
  { id_cliente: 43, id_producto: 21, fecha: '2020-02-01', forma_pago: 'Efectivo', cantidad: 4 },
  { id_cliente: 50, id_producto: 14, fecha: '2018-12-22', forma_pago: 'Tarjeta', cantidad: 5 },
  { id_cliente: 15, id_producto: 5, fecha: '2024-07-27', forma_pago: 'Efectivo', cantidad: 1 },
  { id_cliente: 29, id_producto: 8, fecha: '2019-03-19', forma_pago: 'Tarjeta', cantidad: 2 },
  { id_cliente: 20, id_producto: 27, fecha: '2021-11-05', forma_pago: 'Efectivo', cantidad: 4 },
  { id_cliente: 39, id_producto: 5, fecha: '2017-05-30', forma_pago: 'Tarjeta', cantidad: 3 },
  { id_cliente: 18, id_producto: 14, fecha: '2023-09-01', forma_pago: 'Efectivo', cantidad: 5 },
  { id_cliente: 4, id_producto: 23, fecha: '2020-06-15', forma_pago: 'Tarjeta', cantidad: 1 },
  { id_cliente: 2, id_producto: 6, fecha: '2018-09-14', forma_pago: 'Efectivo', cantidad: 4 },
  { id_cliente: 13, id_producto: 10, fecha: '2021-05-27', forma_pago: 'Tarjeta', cantidad: 5 },
  { id_cliente: 27, id_producto: 3, fecha: '2019-08-21', forma_pago: 'Efectivo', cantidad: 1 },
  { id_cliente: 35, id_producto: 25, fecha: '2023-03-03', forma_pago: 'Tarjeta', cantidad: 2 },
  { id_cliente: 23, id_producto: 16, fecha: '2018-02-17', forma_pago: 'Efectivo', cantidad: 4 },
  { id_cliente: 30, id_producto: 12, fecha: '2020-05-08', forma_pago: 'Tarjeta', cantidad: 3 },
  { id_cliente: 51, id_producto: 29, fecha: '2024-08-13', forma_pago: 'Efectivo', cantidad: 5 },
  { id_cliente: 19, id_producto: 28, fecha: '2017-09-05', forma_pago: 'Tarjeta', cantidad: 1 },
  { id_cliente: 12, id_producto: 1, fecha: '2023-10-17', forma_pago: 'Efectivo', cantidad: 2 },
  { id_cliente: 5, id_producto: 24, fecha: '2021-04-07', forma_pago: 'Tarjeta', cantidad: 3 },
  { id_cliente: 43, id_producto: 21, fecha: '2020-03-30', forma_pago: 'Efectivo', cantidad: 4 },
  { id_cliente: 50, id_producto: 14, fecha: '2018-08-24', forma_pago: 'Tarjeta', cantidad: 5 },
  { id_cliente: 15, id_producto: 5, fecha: '2024-05-22', forma_pago: 'Efectivo', cantidad: 1 },
  { id_cliente: 29, id_producto: 8, fecha: '2019-11-06', forma_pago: 'Tarjeta', cantidad: 2 },
  { id_cliente: 20, id_producto: 27, fecha: '2021-07-23', forma_pago: 'Efectivo', cantidad: 4 },
  { id_cliente: 39, id_producto: 5, fecha: '2017-11-11', forma_pago: 'Tarjeta', cantidad: 3 },
  { id_cliente: 18, id_producto: 14, fecha: '2023-04-19', forma_pago: 'Efectivo', cantidad: 5 },
  { id_cliente: 4, id_producto: 23, fecha: '2020-11-10', forma_pago: 'Tarjeta', cantidad: 1 },
  { id_cliente: 2, id_producto: 6, fecha: '2018-10-01', forma_pago: 'Efectivo', cantidad: 4 },
  { id_cliente: 13, id_producto: 10, fecha: '2021-03-14', forma_pago: 'Tarjeta', cantidad: 5 },
  { id_cliente: 27, id_producto: 3, fecha: '2019-01-30', forma_pago: 'Efectivo', cantidad: 1 },
  { id_cliente: 35, id_producto: 25, fecha: '2023-07-13', forma_pago: 'Tarjeta', cantidad: 2 },
  { id_cliente: 23, id_producto: 16, fecha: '2018-05-23', forma_pago: 'Efectivo', cantidad: 4 },
  { id_cliente: 30, id_producto: 12, fecha: '2020-12-12', forma_pago: 'Tarjeta', cantidad: 3 },
  { id_cliente: 51, id_producto: 29, fecha: '2024-03-17', forma_pago: 'Efectivo', cantidad: 5 },
  { id_cliente: 19, id_producto: 28, fecha: '2017-02-24', forma_pago: 'Tarjeta', cantidad: 1 },
  { id_cliente: 12, id_producto: 1, fecha: '2023-09-04', forma_pago: 'Efectivo', cantidad: 2 },
  { id_cliente: 5, id_producto: 24, fecha: '2021-02-20', forma_pago: 'Tarjeta', cantidad: 3 },
  { id_cliente: 43, id_producto: 21, fecha: '2020-07-03', forma_pago: 'Efectivo', cantidad: 4 },
  { id_cliente: 50, id_producto: 14, fecha: '2018-03-15', forma_pago: 'Tarjeta', cantidad: 5 },
  { id_cliente: 15, id_producto: 5, fecha: '2024-01-23', forma_pago: 'Efectivo', cantidad: 1 },
  { id_cliente: 29, id_producto: 8, fecha: '2019-06-08', forma_pago: 'Tarjeta', cantidad: 2 },
  { id_cliente: 20, id_producto: 27, fecha: '2021-09-30', forma_pago: 'Efectivo', cantidad: 4 },
  { id_cliente: 39, id_producto: 5, fecha: '2017-04-27', forma_pago: 'Tarjeta', cantidad: 3 },
  { id_cliente: 18, id_producto: 14, fecha: '2023-02-26', forma_pago: 'Efectivo', cantidad: 5 },
  { id_cliente: 4, id_producto: 23, fecha: '2020-08-22', forma_pago: 'Tarjeta', cantidad: 1 },
  { id_cliente: 2, id_producto: 6, fecha: '2018-11-13', forma_pago: 'Efectivo', cantidad: 4 },
  { id_cliente: 13, id_producto: 10, fecha: '2021-07-31', forma_pago: 'Tarjeta', cantidad: 5 },
  { id_cliente: 27, id_producto: 3, fecha: '2019-03-01', forma_pago: 'Efectivo', cantidad: 1 },
  { id_cliente: 35, id_producto: 25, fecha: '2023-05-28', forma_pago: 'Tarjeta', cantidad: 2 },
  { id_cliente: 23, id_producto: 16, fecha: '2018-06-10', forma_pago: 'Efectivo', cantidad: 4 },
  { id_cliente: 30, id_producto: 12, fecha: '2020-04-01', forma_pago: 'Tarjeta', cantidad: 3 },
  { id_cliente: 51, id_producto: 29, fecha: '2024-07-14', forma_pago: 'Efectivo', cantidad: 5 },
  { id_cliente: 19, id_producto: 28, fecha: '2017-07-14', forma_pago: 'Tarjeta', cantidad: 1 },
  { id_cliente: 12, id_producto: 1, fecha: '2023-03-29', forma_pago: 'Efectivo', cantidad: 2 },
  { id_cliente: 5, id_producto: 24, fecha: '2021-06-01', forma_pago: 'Tarjeta', cantidad: 3 },
  { id_cliente: 43, id_producto: 21, fecha: '2020-11-30', forma_pago: 'Efectivo', cantidad: 4 },
  { id_cliente: 50, id_producto: 14, fecha: '2018-09-29', forma_pago: 'Tarjeta', cantidad: 5 },
  { id_cliente: 15, id_producto: 5, fecha: '2024-03-05', forma_pago: 'Efectivo', cantidad: 1 },
  { id_cliente: 29, id_producto: 8, fecha: '2019-01-14', forma_pago: 'Tarjeta', cantidad: 2 },
  { id_cliente: 20, id_producto: 27, fecha: '2021-12-18', forma_pago: 'Efectivo', cantidad: 4 },
  { id_cliente: 39, id_producto: 5, fecha: '2017-08-27', forma_pago: 'Tarjeta', cantidad: 3 },
  { id_cliente: 18, id_producto: 14, fecha: '2023-01-31', forma_pago: 'Efectivo', cantidad: 5 },
  { id_cliente: 4, id_producto: 23, fecha: '2020-10-18', forma_pago: 'Tarjeta', cantidad: 1 },
  { id_cliente: 2, id_producto: 6, fecha: '2018-07-21', forma_pago: 'Efectivo', cantidad: 4 },
  { id_cliente: 13, id_producto: 10, fecha: '2021-12-12', forma_pago: 'Tarjeta', cantidad: 5 },
  { id_cliente: 27, id_producto: 3, fecha: '2019-09-17', forma_pago: 'Efectivo', cantidad: 1 },
  { id_cliente: 35, id_producto: 25, fecha: '2023-06-16', forma_pago: 'Tarjeta', cantidad: 2 },
  { id_cliente: 23, id_producto: 16, fecha: '2018-04-14', forma_pago: 'Efectivo', cantidad: 4 },
  { id_cliente: 30, id_producto: 12, fecha: '2020-07-22', forma_pago: 'Tarjeta', cantidad: 3 },
  { id_cliente: 51, id_producto: 29, fecha: '2024-10-08', forma_pago: 'Efectivo', cantidad: 5 },
  { id_cliente: 19, id_producto: 28, fecha: '2017-01-10', forma_pago: 'Tarjeta', cantidad: 1 },
  { id_cliente: 12, id_producto: 1, fecha: '2023-05-24', forma_pago: 'Efectivo', cantidad: 2 },
  { id_cliente: 5, id_producto: 24, fecha: '2021-09-02', forma_pago: 'Tarjeta', cantidad: 3 },
  { id_cliente: 43, id_producto: 21, fecha: '2020-12-27', forma_pago: 'Efectivo', cantidad: 4 },
  { id_cliente: 50, id_producto: 14, fecha: '2018-11-06', forma_pago: 'Tarjeta', cantidad: 5 },
  { id_cliente: 15, id_producto: 5, fecha: '2024-04-11', forma_pago: 'Efectivo', cantidad: 1 }]



ventas.forEach(venta => {
  db.run(`INSERT INTO Ventas (id_c, id_p, f, fp, c) VALUES (?, ?, ?, ?, ?)`, [venta.id_cliente, venta.id_producto, venta.fecha, venta.forma_pago, venta.cantidad]);
});


      resolve();
    });
  });
}
*/


// Instancia de la clase Conexion
const conexion = new Conexion();

// Ruta para validar usuario y administrador
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
    console.error("Error en validación:", error);
    res.status(500).json({ success: false, message: "Error en validación del usuario" });
  }
});



// Rutas para agregar y eliminar zapatillas
app.post('/agregarProducto', (req, res) => {
    const { marca, modelo, precio,stock } = req.body;

    if (!marca || !modelo || !precio || !stock) {
        return res.status(400).json({ message: "Faltan datos de la zapatilla." });
    }

    // Insertar la nueva zapatilla en la base de datos
    const sql = 'INSERT INTO Productos ( m, mo,p, st) VALUES (?, ?, ?, ?)';

    db.run(sql, [marca, modelo, precio, stock], function(err) {
        if (err) {
            console.error('Error al agregar zapatilla:', err);
            return res.status(500).json({ message: "Error al agregar zapatilla." });
        }

        res.status(200).json({ message: "Zapatilla agregada correctamente", id: this.lastID });
    });
});

app.put('/actualizar-producto/:id', (req, res) => {
  const productoId = req.params.id;
  const { marca, modelo, precio, stock } = req.body;

  db.run(`UPDATE Productos SET m = ?, mo = ?, p = ?, st = ? WHERE id = ?`,
      [marca, modelo, precio, stock, productoId],
      function (err) {
          if (err) {
              console.error(err);
              res.status(500).send("Error al actualizar el producto");
          } else {
              res.json({ message: "Producto actualizado correctamente" });
          }
      }
  );
});



app.get("/allProducto", (req, res) => {
  db.all("SELECT * FROM Productos", [], (err, rows) => {
      if (err) {
          return res.status(500).send({ error: "Error al obtener productos" });
      }
      res.json(rows);
  });
});

app.delete('/eliminarProducto/:id', (req, res) => {
  const { id } = req.params;

  if (!id) {
      return res.status(400).json({ message: "ID de la zapatilla es requerido." });
  }

  const sql = 'DELETE FROM Productos WHERE id = ?';
  db.run(sql, [id], function(err) {
      if (err) {
          console.error('Error al eliminar zapatilla:', err);
          return res.status(500).json({ message: "Error al eliminar zapatilla." });
      }

      if (this.changes === 0) {
          return res.status(404).json({ message: "Zapatilla no encontrada." });
      }

      res.json({ message: "Zapatilla eliminada correctamente", id });
  });
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

// Ruta para listar trabajadores
app.get('/alltrabajadores', (req, res) => {
  db.all("SELECT * FROM TablaUsuario", [], (err, rows) => {
      if (err) {
          console.error(err);
      } else {
          res.json(rows);
      }
  });
});

// Ruta para agregar un trabajador
app.post('/addtrabajadores', (req, res) => {
  const { nombre, apellidos, contrasena, email, numTel, direccion } = req.body;
  db.run(`INSERT INTO TablaUsuario (n, c, e, nt, d, na, s) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [nombre, apellidos, contrasena, email, numTel, direccion],
      function (err) {
          if (err) {
              console.error(err);
          } else {
              res.json({ message: "Trabajador agregado correctamente" });
          }
      }
  );
});

// Ruta para eliminar un trabajador
app.delete('/deltrabajador/:id', (req, res) => {
  const workerId = req.params.id;
  db.run(`DELETE FROM TablaUsuario WHERE id = ?`, [workerId], function (err) {
      if (err) {
          console.error(err);
          res.status(500).send("Error al eliminar el trabajador");
      } else {
          res.json({ message: "Trabajador eliminado correctamente" });
      }
  });
});

// Ruta para abrir el modal (obtener los datos del trabajador)
app.get('/editar-trabajador/:id', (req, res) => {
  const workerId = req.params.id;
  
  db.get("SELECT * FROM TablaUsuario WHERE id = ?", [workerId], (err, row) => {
    if (err) {
      console.error("Error al obtener los datos del trabajador:", err);
      res.status(500).send("Error al obtener los datos del trabajador");
    } else if (!row) {
      res.status(404).send("Trabajador no encontrado");
    } else {
      res.json(row);
    }
  });
});

// Ruta para actualizar un trabajador
app.put('/actualizar-trabajador/:id', (req, res) => {
  const workerId = req.params.id;
  const { nombre, email, numTel, direccion } = req.body;

  db.run(`UPDATE TablaUsuario SET n = ?, e = ?, nt = ?, d = ? WHERE id = ?`,
      [nombre, email, numTel, direccion, workerId],
      function (err) {
          if (err) {
              console.error(err);
              res.status(500).send("Error al actualizar el trabajador");
          } else {
              res.json({ message: "Trabajador actualizado correctamente" });
          }
      }
  );
});




app.post('/crearventa', (req, res) => {
  const { idCliente, formaPago, fecha, productos } = req.body;

  db.serialize(() => {
    db.run("BEGIN TRANSACTION", (err) => {
      if (err) {
        console.error("Error al iniciar la transacción:", err.message);
        return res.status(500).json({ success: false, message: "Error al iniciar la transacción." });
      }
    });

    try {
      let totalVenta = 0;
      productos.forEach((producto) => {
        const { idProducto, cantidad, precio } = producto;
        totalVenta += precio;

        // Insertar en la tabla Ventas
        db.run(
          `INSERT INTO Ventas (id_c, id_p, f, fp, c, t) VALUES (?, ?, ?, ?, ?, ?)`,
          [idCliente, idProducto, fecha, formaPago, cantidad, totalVenta],
          function (err) {
            if (err) {
              throw new Error(`Error al insertar en Ventas: ${err.message}`);
            }
            console.log(`Venta registrada: ${this.lastID}`);
          }
        );

        // Actualizar el stock en la tabla Productos
        db.run(
          `UPDATE Productos SET st = st - ? WHERE id = ? AND st >= ?`,
          [cantidad, idProducto, cantidad],
          function (err) {
            if (err) {
              throw new Error(`Error al actualizar el stock: ${err.message}`);
            }
            console.log(`Stock actualizado para producto ID: ${idProducto}`);
          }
        );
      });

      // Confirmar la transacción
      db.run("COMMIT", (err) => {
        if (err) {
          console.error("Error al confirmar la transacción:", err.message);
          return res.status(500).json({ success: false, message: "Error al confirmar la transacción." });
        }
        res.json({ success: true, message: "Venta registrada y stock actualizado correctamente.", total: totalVenta });
      });
    } catch (error) {
      console.error("Error durante la transacción:", error.message);

      // Revertir la transacción
      db.run("ROLLBACK", (err) => {
        if (err) {
          console.error("Error al revertir la transacción:", err.message);
        }
        res.status(500).json({ success: false, message: "Error al registrar la venta." });
      });
    }
  });
});




app.get('/ventas', (req, res) => {
  const query = `
      SELECT 
          p.mo as producto,
          SUM(v.c) as total_ventas
      FROM Ventas v
      JOIN Productos p ON v.id_p = p.id
      GROUP BY p.mo
  `;

  db.all(query, (error, results) => {
      if (error) {
          return res.status(500).json({ message: "Error al obtener datos del servidor.", error });
      }
      
      if (results.length === 0) {
          return res.status(404).json({ message: "No se encontraron resultados." });
      }

      res.json(results);
  });
});

// Ruta para obtener marcas únicas
app.get('/marcas', (req, res) => {
  db.all('SELECT DISTINCT m FROM Productos', (error, results) => {
      if (error) {
          console.error('Error al consultar las marcas:', error);
          return res.status(500).json({ error: 'Error interno del servidor' });
      }
      res.json(results.map(row => row.m));  // Enviar las marcas como respuesta
  });
});


app.get('/ventasMensuales', (req, res) => {
  const query = `
      SELECT DISTINCT
          strftime('%Y-%m', v.f) as mes,
          p.m as marca,
          SUM(v.c) as total_ventas
      FROM Ventas v
      JOIN Productos p ON v.id_p = p.id
      GROUP BY mes, p.m
      ORDER BY mes, p.m;
  `;

  db.all(query, (error, results) => {
      if (error) {
          return res.status(500).json({ message: "Error al obtener datos del servidor.", error });
      }
      res.json(results);
  });
});






// Ruta para obtener las diferencias de ventas por producto
app.get('/diferenciasVentas', (req, res) => {
  const query = `
      SELECT 
          p.m as producto,
          SUM(c) as total_ventas
      FROM Ventas v
      JOIN Productos p ON v.id_p = p.id
      GROUP BY p.m
  `;
  
  db.all(query, (error, results) => {
      if (error) {
          console.error("Error al obtener datos del servidor:", error);
          return res.status(500).json({ message: "Error al obtener datos del servidor.", error });
      }

      if (results.length === 0) {
          console.warn("No se encontraron resultados.");
          return res.status(404).json({ message: "No se encontraron resultados." });
      }

      // Formatear los resultados: asegurarse que producto sea texto y total_ventas sea numérico
      const formattedResults = results.map(item => {
          return [item.producto, parseFloat(item.total_ventas)];
      });

      res.json(formattedResults);
  });
});



app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

// Ruta para filtrar productos
app.get('/filtrarProductos', (req, res) => {
  const { precio, marca, sort } = req.query;

  let query = 'SELECT * FROM Productos WHERE 1=1';
  const params = [];

  // Filtrar por precio
  if (precio) {
      const [min, max] = precio.split('-').map(Number);
      query += ' AND p BETWEEN ? AND ?';
      params.push(min, max);
  }

  // Filtrar por marca
  if (marca) {
      query += ' AND m IN (' + marca.map(() => '?').join(',') + ')';
      params.push(...marca);
  }

  // Ordenar por modelo
  if (sort === 'asc') {
      query += ' ORDER BY mo ASC';
  } else if (sort === 'desc') {
      query += ' ORDER BY mo DESC';
  }

  db.all(query, params, (err, rows) => {
      if (err) {
          console.error('Error al filtrar productos:', err);
          return res.status(500).json({ error: 'Error al filtrar productos' });
      }
      res.json(rows);
  });
});