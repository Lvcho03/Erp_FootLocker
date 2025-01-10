const sqlite3 = require('sqlite3').verbose();

class Conexion {
    constructor() {
        this.db = new sqlite3.Database('./productos.db', (err) => {
            if (err) {
                console.error('Error al conectar a la base de datos:', err.message);
            } else {
                console.log('Conectado a la base de datos SQLite3.');
            }
        });
        this.usuarios = [];
        this.administradores = [];
        this.productos = []; // Renombrado para reflejar los productos
        this.user = null;
    }

    // Cargar datos desde la base de datos SQLite3
    cargarDatos() {
        return new Promise((resolve, reject) => {
            // Consultar los usuarios
            this.db.all('SELECT * FROM usuarios', [], (err, rows) => {
                if (err) {
                    reject('Error al cargar los usuarios:', err.message);
                    return;
                }
                this.usuarios = rows; // Cargar todos los usuarios
                console.log('Usuarios cargados:', this.usuarios);
                
                // Consultar los administradores
                this.db.all('SELECT * FROM administradores', [], (err, rows) => {
                    if (err) {
                        reject('Error al cargar los administradores:', err.message);
                        return;
                    }
                    this.administradores = rows; // Cargar todos los administradores
                    console.log('Administradores cargados:', this.administradores);
                    
                    // Consultar los productos (zapatillas)
                    this.db.all('SELECT * FROM productos', [], (err, rows) => {
                        if (err) {
                            reject('Error al cargar los productos:', err.message);
                            return;
                        }
                        this.productos = rows; // Cargar todos los productos
                        console.log('Productos cargados:', this.productos);
                        resolve(); // Resolver la promesa cuando se hayan cargado todos los datos
                    });
                });
            });
        });
    }

    // Obtener todos los productos
    obtenerProductos() {
        return this.productos; // Retorna los productos cargados
    }

    // Validar usuario con SQLite3
    validarUsuario(usuario, contrasena) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM usuarios WHERE nombre = ? AND contrasena = ?';
            this.db.get(query, [usuario, contrasena], (err, row) => {
                if (err) {
                    reject('Error al validar el usuario:', err.message);
                    return;
                }
                if (row) {
                    this.user = row; // Asignar usuario encontrado a this.user
                    console.log("Usuario validado:", this.user);
                    resolve(true);
                } else {
                    resolve(false);
                }
            });
        });
    }

    // Validar administrador con SQLite3
    validarAdmin(admin, contrasena) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM administradores WHERE nombre = ? AND contrasena = ?';
            this.db.get(query, [admin, contrasena], (err, row) => {
                if (err) {
                    reject('Error al validar el administrador:', err.message);
                    return;
                }
                if (row) {
                    this.user = row; // Asignar admin encontrado a this.user
                    console.log("Administrador validado:", this.user);
                    resolve(true);
                } else {
                    resolve(false);
                }
            });
        });
    }

    // Devolver el nombre del usuario actual
    devolverNameUsuario() {
        if (!this.user) {
            console.log("Error: this.user es null");
            return null;
        }
        return this.user ? this.user.nombre : null;
    }

    // Cerrar la conexión con la base de datos
    cerrarConexion() {
        this.db.close((err) => {
            if (err) {
                console.error('Error al cerrar la conexión:', err.message);
            } else {
                console.log('Conexión a la base de datos cerrada.');
            }
        });
    }
}

module.exports = Conexion;