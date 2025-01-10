const Conexion = require('./conexion'); // Importar la clase Conexion

class Zapatillas {
    constructor() {
        this.conexion = new Conexion(); // Instancia de la clase Conexion
    }

    // Cargar los productos desde la base de datos
    cargarProductos() {
        return new Promise((resolve, reject) => {
            // Usar la clase Conexion para cargar los productos
            this.conexion.cargarDatos()
                .then(() => {
                    this.productos = this.conexion.obtenerProductos(); // Obtener productos cargados
                    console.log('Productos cargados:', this.productos);
                    resolve();
                })
                .catch(error => {
                    console.error('Error al cargar los productos:', error);
                    reject(error);
                });
        });
    }

    // Obtener todos los productos
    obtenerProductos() {
        return this.productos; // Retorna los productos cargados
    }

    // Agregar un nuevo producto
    agregarProducto(id, modelo, total_ventas, precio) {
        const query = `INSERT INTO productos (id, modelo, total_ventas, precio) VALUES (?, ?, ?, ?)`;
        this.conexion.db.run(query, [id, modelo, total_ventas, precio], (err) => {
            if (err) {
                console.error('Error al agregar producto:', err.message);
                return;
            }
            console.log('Producto agregado correctamente');
            // Recargar los productos después de agregar uno nuevo
            this.cargarProductos();
        });
    }

    // Eliminar un producto por ID
    eliminarProducto(id) {
        const query = `DELETE FROM productos WHERE id = ?`;
        this.conexion.db.run(query, [id], (err) => {
            if (err) {
                console.error('Error al eliminar producto:', err.message);
                return;
            }
            console.log('Producto eliminado correctamente');
            // Recargar los productos después de eliminar uno
            this.cargarProductos();
        });
    }
}

module.exports = Zapatillas;