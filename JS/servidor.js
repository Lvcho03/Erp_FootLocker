const express = require('express');
const cors = require('cors');
const fs = require('fs');

// Crear la aplicación express
const app = express();
const dataPath = './BD.json'; // Archivo de datos de trabajadores
const idPath = './id.json'; // Archivo para guardar el último ID usado

// Middleware
app.use(cors());
app.use(express.json());

// Función para leer los datos del archivo BD.json
function readData() {
    try {
        const rawData = fs.readFileSync(dataPath);
        return JSON.parse(rawData);
    } catch (err) {
        throw new Error("Error al leer el archivo de datos");
    }
}

// Función para escribir datos en BD.json
function writeData(data) {
    try {
        fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
    } catch (err) {
        throw new Error("Error al escribir en el archivo de datos");
    }
}

// Función para leer el último ID desde id.json
function readId() {
    try {
        const rawId = fs.readFileSync(idPath);
        return JSON.parse(rawId);
    } catch (err) {
        return { idProhibido: 0 }; // Si no existe, inicializa con 0
    }
}

// Función para escribir el último ID en id.json
function writeId(newId) {
    try {
        fs.writeFileSync(idPath, JSON.stringify({ idProhibido: newId }, null, 2));
    } catch (err) {
        throw new Error("Error al escribir el archivo de ID");
    }
}

// Ruta GET para obtener los trabajadores
app.get('/empleados', (req, res) => {
    const data = readData();
    res.json(data.TablaUsuario);
});

// Ruta POST para agregar un nuevo trabajador
app.post('/empleados/add', (req, res) => {
    const newUser = req.body;

    if (!newUser.nombre || !newUser.apellidos || !newUser.email || !newUser.numTel || !newUser.direccion) {
        return res.status(400).json({ message: "Faltan datos del trabajador." });
    }

    // Leer el último id prohibido y los datos actuales
    const idData = readId();
    const data = readData();

    const lastIdInDb = data.TablaUsuario.length > 0 
        ? Math.max(...data.TablaUsuario.map(worker => worker.id)) 
        : 0;

    // Determinar el nuevo ID basado en la comparación
    const newId = Math.max(idData.idProhibido, lastIdInDb) + 1;

    // Crear el nuevo trabajador con el nuevo ID
    const workerToAdd = { id: newId, ...newUser };

    // Agregar el trabajador a la lista
    data.TablaUsuario.push(workerToAdd);

    // Actualizar los archivos
    writeData(data);
    writeId(newId);

    // Responder con el trabajador agregado
    res.status(201).json({ message: "Trabajador agregado", data: workerToAdd });
});

// Ruta POST para eliminar un trabajador por ID
app.post('/empleados/delete', (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.status(400).json({ message: "ID del trabajador es requerido." });
    }

    const data = readData();

    // Buscar y eliminar el trabajador con el ID especificado
    const updatedWorkers = data.TablaUsuario.filter(worker => worker.id !== id);

    if (updatedWorkers.length === data.TablaUsuario.length) {
        return res.status(404).json({ message: "Trabajador no encontrado." });
    }

    // Guardar la lista actualizada
    data.TablaUsuario = updatedWorkers;
    writeData(data);

    // Si el ID eliminado era el mayor, actualizar idProhibido
    const newLastId = updatedWorkers.length > 0 
        ? Math.max(...updatedWorkers.map(worker => worker.id)) 
        : 0;

    writeId(newLastId);

    res.json({ message: "Trabajador eliminado", id });
});

// Iniciar el servidor
const port = 3000;
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
