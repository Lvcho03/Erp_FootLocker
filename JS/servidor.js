import express from 'express';
import sqlite3 from 'sqlite3';
import bodyParser from 'body-parser';
import cors from 'cors';  
import Conexion from './conexion.js';  // Asegúrate de ajustar la ruta correcta a 'conexion.js'

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
    await crearYPoblarBaseDeDatos();  
  }
});

async function crearYPoblarBaseDeDatos() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run('DROP TABLE IF EXISTS TablaAdmin');
      db.run('DROP TABLE IF EXISTS TablaUsuario');
      db.run('DROP TABLE IF EXISTS Clientes');
      db.run('DROP TABLE IF EXISTS Productos');
      db.run('DROP TABLE IF EXISTS Ventas');

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

      db.run(`CREATE TABLE IF NOT EXISTS Clientes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre VARCHAR(50),
        apellido VARCHAR(50),
        telefono VARCHAR(15),
        email VARCHAR(100),
        nacionalidad VARCHAR(50),
        sexo CHAR(1)
      )`);

      db.run(`CREATE TABLE IF NOT EXISTS Productos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        marca VARCHAR(50),
        modelo VARCHAR(50),
        precio DECIMAL(10,2),
        stock INT
      )`);

      db.run(`CREATE TABLE IF NOT EXISTS Ventas (
        id_venta INTEGER PRIMARY KEY AUTOINCREMENT,
        id_cliente INT,
        id_producto INT,
        fecha DATE,
        forma_pago VARCHAR(50),
        cantidad INT,
        FOREIGN KEY (id_cliente) REFERENCES Clientes(id),
        FOREIGN KEY (id_producto) REFERENCES Productos(id)
      )`);

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
        db.run(`INSERT INTO TablaAdmin (nombre, contrasena) VALUES (?, ?)`, [user.nombre, user.contrasena]);
      });

      // Insertar datos en TablaUsuario
      const usuariosTablaUsuario = [
        { nombre: 'pepe Capo Gonzalez', contrasena: 'usuario', email: 'pcaogon@gmail.com', numTel: '682646493', direccion: 'calle Aragón nº4', nacionalidad: 'Española', sexo: 'Masculino' },
        { nombre: 'carlota Matirnez Martinez', contrasena: null, email: 'carmarmar@gmail.com', numTel: '686358765', direccion: 'calle Aragón nº5', nacionalidad: 'Española', sexo: 'Femenino' },
        { nombre: 'alejandro Benito Camelo', contrasena: 'usuario', email: 'estadaki@gmail.com', numTel: '687654327', direccion: 'calle Aragón nº7', nacionalidad: 'Española', sexo: 'Masculino' },
        { nombre: 'asAS', contrasena: null, email: 'asAS', numTel: 'asAS', direccion: 'asa', nacionalidad: 'Desconocida', sexo: 'Otro' }
      ];

      usuariosTablaUsuario.forEach(user => {
        db.run(`INSERT INTO TablaUsuario (nombre, contrasena, email, numTel, direccion, nacionalidad, sexo) VALUES (?, ?, ?, ?, ?, ?, ?)`, [user.nombre, user.contrasena, user.email, user.numTel, user.direccion, user.nacionalidad, user.sexo]);
      });

      // Insertar datos en la tabla Clientes
      const clientes = [
        { nombre: 'Juan', apellido: 'Pérez', telefono: '123456789', email: 'juan.perez@example.com', nacionalidad: 'Argentina', sexo: 'M' },
        { nombre: 'Ana', apellido: 'García', telefono: '234567890', email: 'ana.garcia@example.com', nacionalidad: 'Chile', sexo: 'F' },
        { nombre: 'Carlos', apellido: 'López', telefono: '345678901', email: 'carlos.lopez@example.com', nacionalidad: 'Perú', sexo: 'M' },
        { nombre: 'Sofía', apellido: 'Martínez', telefono: '456789012', email: 'sofia.martinez@example.com', nacionalidad: 'Colombia', sexo: 'F' },
        { nombre: 'David', apellido: 'Fernández', telefono: '567890123', email: 'david.fernandez@example.com', nacionalidad: 'México', sexo: 'M' },
        { nombre: 'Laura', apellido: 'Rodríguez', telefono: '678901234', email: 'laura.rodriguez@example.com', nacionalidad: 'Ecuador', sexo: 'F' }
      ];

      clientes.forEach(cliente => {
        db.run(`INSERT INTO Clientes (nombre, apellido, telefono, email, nacionalidad, sexo) VALUES (?, ?, ?, ?, ?, ?)`, [cliente.nombre, cliente.apellido, cliente.telefono, cliente.email, cliente.nacionalidad, cliente.sexo]);
      });

      // Insertar datos en la tabla Productos (Zapatillas)
      const productos = [
        { marca: 'Nike', modelo: 'Air Max', precio: 120.00, stock: 30 },
        { marca: 'Adidas', modelo: 'UltraBoost', precio: 150.00, stock: 25 },
        { marca: 'Puma', modelo: 'RS-X', precio: 110.00, stock: 20 },
        { marca: 'Reebok', modelo: 'Classic Leather', precio: 100.00, stock: 40 },
        { marca: 'New Balance', modelo: 'Fresh Foam', precio: 130.00, stock: 35 },
        { marca: 'Asics', modelo: 'GEL-Contend', precio: 115.00, stock: 30 },
        { marca: 'Under Armour', modelo: 'HOVR Phantom', precio: 140.00, stock: 22 },
        { marca: 'Converse', modelo: 'Chuck Taylor', precio: 70.00, stock: 50 },
        { marca: 'Vans', modelo: 'Old Skool', precio: 80.00, stock: 45 },
        { marca: 'Fila', modelo: 'Disruptor II', precio: 90.00, stock: 28 },
        { marca: 'Mizuno', modelo: 'Wave Rider', precio: 125.00, stock: 25 },
        { marca: 'Saucony', modelo: 'Kinvara', precio: 135.00, stock: 20 },
        { marca: 'Brooks', modelo: 'Ghost', precio: 140.00, stock: 15 },
        { marca: 'Hoka One One', modelo: 'Clifton', precio: 150.00, stock: 18 },
        { marca: 'Jordan', modelo: 'Air Jordan 1', precio: 200.00, stock: 10 },
        { marca: 'Nike', modelo: 'Blazer', precio: 100.00, stock: 25 },
        { marca: 'Adidas', modelo: 'Stan Smith', precio: 85.00, stock: 35 },
        { marca: 'Puma', modelo: 'Cali', precio: 95.00, stock: 30 },
        { marca: 'Reebok', modelo: 'Nano X', precio: 130.00, stock: 20 },
        { marca: 'New Balance', modelo: '997H', precio: 110.00, stock: 40 },
        { marca: 'Asics', modelo: 'GEL-Kayano', precio: 160.00, stock: 12 },
        { marca: 'Under Armour', modelo: 'Charged Bandit', precio: 120.00, stock: 25 },
        { marca: 'Converse', modelo: 'One Star', precio: 75.00, stock: 30 },
        { marca: 'Vans', modelo: 'Sk8-Hi', precio: 85.00, stock: 35 },
        { marca: 'Fila', modelo: 'Ray Tracer', precio: 105.00, stock: 20 },
        { marca: 'Mizuno', modelo: 'Rebula', precio: 140.00, stock: 18 },
        { marca: 'Saucony', modelo: 'Ride', precio: 120.00, stock: 22 },
        { marca: 'Brooks', modelo: 'Adrenaline GTS', precio: 130.00, stock: 15 },
        { marca: 'Hoka One One', modelo: 'Bondi', precio: 160.00, stock: 10 }
      ];
      
      productos.forEach(producto => {
        db.run(`INSERT INTO Productos (marca, modelo, precio, stock) VALUES (?, ?, ?, ?)`,
          [producto.marca, producto.modelo, producto.precio, producto.stock]);
      });
      

 // Insertar datos en la tabla Ventas (120 registros)
const ventas = [];
for (let i = 1; i <= 120; i++) {
  const id_cliente = Math.floor(Math.random() * 6) + 1; // Clientes del 1 al 6
  const id_producto = Math.floor(Math.random() * 6) + 1; // Productos del 1 al 6
  const year = Math.floor(Math.random() * 10) + 2015; // Años entre 2015 y 2024
  const month = Math.floor(Math.random() * 12); // Meses de 0 a 11
  const day = Math.floor(Math.random() * 28) + 1; // Días del 1 al 28
  const fecha = new Date(year, month, day).toISOString().split('T')[0];
  const forma_pago = Math.random() > 0.5 ? 'Tarjeta' : 'Efectivo';
  const cantidad = Math.floor(Math.random() * 3) + 1; // 1 a 3 unidades

  ventas.push({ id_cliente, id_producto, fecha, forma_pago, cantidad });
}

ventas.forEach(venta => {
  db.run(`INSERT INTO Ventas (id_cliente, id_producto, fecha, forma_pago, cantidad) VALUES (?, ?, ?, ?, ?)`, [venta.id_cliente, venta.id_producto, venta.fecha, venta.forma_pago, venta.cantidad]);
});


      resolve();
    });
  });
}



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
app.post('/agregarZapatilla', (req, res) => {
    const { id, modelo, total_ventas, precio } = req.body;

    if (!id || !modelo || !total_ventas || !precio) {
        return res.status(400).json({ message: "Faltan datos de la zapatilla." });
    }

    // Insertar la nueva zapatilla en la base de datos
    const sql = 'INSERT INTO zapatillas (id, modelo, total_ventas, precio) VALUES (?, ?, ?, ?)';

    db.run(sql, [id, modelo, total_ventas, precio], function(err) {
        if (err) {
            console.error('Error al agregar zapatilla:', err);
            return res.status(500).json({ message: "Error al agregar zapatilla." });
        }

        res.status(200).json({ message: "Zapatilla agregada correctamente", id: this.lastID });
    });
});

app.post('/eliminarZapatilla', (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.status(400).json({ message: "ID de la zapatilla es requerido." });
    }

    // Eliminar la zapatilla de la base de datos
    const sql = 'DELETE FROM zapatillas WHERE id = ?';

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
  db.run(`INSERT INTO TablaUsuario (nombre, contrasena, email, numTel, direccion, nacionalidad, sexo) VALUES (?, ?, ?, ?, ?, ?, ?)`,
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

  db.run(`UPDATE TablaUsuario SET nombre = ?, email = ?, numTel = ?, direccion = ? WHERE id = ?`,
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



app.get('/ventas', (req, res) => {
  const query = `
      SELECT 
          p.modelo as producto,
          SUM(v.cantidad) as total_ventas
      FROM Ventas v
      JOIN Productos p ON v.id_producto = p.id
      GROUP BY p.modelo
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


// Ruta para obtener las ventas mensuales por producto
app.get('/ventasMensuales', (req, res) => {
  const query = `
      SELECT 
          strftime('%Y-%m', fecha) as mes,
          id_producto,
          SUM(CASE WHEN id_producto = 1 THEN cantidad ELSE 0 END) as nike,
          SUM(CASE WHEN id_producto = 2 THEN cantidad ELSE 0 END) as vans,
          SUM(CASE WHEN id_producto = 3 THEN cantidad ELSE 0 END) as converse
      FROM Ventas
      GROUP BY mes, id_producto
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
          p.marca as producto,
          SUM(cantidad) as total_ventas
      FROM Ventas v
      JOIN Productos p ON v.id_producto = p.id
      GROUP BY p.marca
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