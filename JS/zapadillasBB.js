const sqlite3 = require('sqlite3').verbose();

// Función para obtener los datos de la base de datos
function obtenerDatosZapatillas(callback) {
    const db = new sqlite3.Database('./zapatillas.db', (err) => {
        if (err) {
            console.error('Error al conectar a la base de datos:', err.message);
            return callback(err, null);
        }
    });

    const query = `SELECT id, modelo, total_de_ventas, precio FROM zapatillas`;

    db.all(query, [], (err, rows) => {
        if (err) {
            console.error('Error al obtener los datos:', err.message);
            db.close();
            return callback(err, null);
        }

        db.close((err) => {
            if (err) {
                console.error('Error al cerrar la conexión:', err.message);
            }
        });

        const datos = rows.map(row => [row.id, row.modelo, row.total_de_ventas, row.precio]);
        callback(null, datos);
    });
}

// Función para agregar nuevos datos a la tabla
function agregarZapatilla(id, modelo, total_de_ventas, precio, callback) {
    const db = new sqlite3.Database('./zapatillas.db', (err) => {
        if (err) {
            console.error('Error al conectar a la base de datos:', err.message);
            return callback(err);
        }
    });

    const insert = `INSERT INTO zapatillas (id, modelo, total_de_ventas, precio) VALUES (?, ?, ?, ?)`;
    db.run(insert, [id, modelo, total_de_ventas, precio], (err) => {
        if (err) {
            console.error('Error al insertar datos:', err.message);
            return callback(err);
        }
        console.log('Zapatilla agregada correctamente.');
        callback(null);
    });

    db.close((err) => {
        if (err) {
            console.error('Error al cerrar la conexión:', err.message);
        }
    });
}

// Función para eliminar datos de la tabla
function eliminarZapatilla(id, callback) {
    const db = new sqlite3.Database('./zapatillas.db', (err) => {
        if (err) {
            console.error('Error al conectar a la base de datos:', err.message);
            return callback(err);
        }
    });

    const del = `DELETE FROM zapatillas WHERE id = ?`;
    db.run(del, [id], (err) => {
        if (err) {
            console.error('Error al eliminar datos:', err.message);
            return callback(err);
        }
        console.log('Zapatilla eliminada correctamente.');
        callback(null);
    });

    db.close((err) => {
        if (err) {
            console.error('Error al cerrar la conexión:', err.message);
        }
    });
}

/**
 * MOQUEO
 */
// Crear la tabla y poblarla
const db = new sqlite3.Database('./zapatillas.db', (err) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err.message);
    } else {
        console.log('Conectado a la base de datos SQLite3.');
    }
});

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS zapatillas (
        id INTEGER PRIMARY KEY,
        modelo TEXT NOT NULL,
        total_de_ventas INTEGER NOT NULL,
        precio TEXT NOT NULL
    )`);

    const insert = `INSERT INTO zapatillas (id, modelo, total_de_ventas, precio) VALUES (?, ?, ?, ?)`;
    const zapatillas = [
        [1, 'Air Max 90', 1500, '120.00 €'],
        [2, 'Yeezy Boost 350', 2000, '220.00 €'],
        [3, 'Jordan 1 Retro High', 1800, '170.00 €'],
        [4, 'Puma RS-X', 800, '110.00 €'],
        [5, 'Adidas Ultraboost', 1200, '180.00 €']
    ];

    zapatillas.forEach((zapatilla) => {
        db.run(insert, zapatilla, (err) => {
            if (err) {
                console.error('Error al insertar datos:', err.message);
            }
        });
    });
});

db.close((err) => {
    if (err) {
        console.error('Error al cerrar la conexión:', err.message);
    } else {
        console.log('Conexión a la base de datos cerrada.');
    }
});

module.exports = { obtenerDatosZapatillas, agregarZapatilla, eliminarZapatilla };
