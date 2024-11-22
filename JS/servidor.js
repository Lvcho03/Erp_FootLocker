const express = require('express');
const fs = require('fs');
const cors = require('cors');

// Crear la aplicación express
const app = express();

// Ruta al archivo JSON (base de datos)
const dataPath = './BD.json';

// Middleware para que Express pueda leer JSON en las peticiones POST
app.use(express.json());
app.use(cors());  // Habilitar CORS para permitir solicitudes desde el frontend

// Función para leer los datos del archivo JSON
function readData() {
    try {
        const rawData = fs.readFileSync(dataPath);
        return JSON.parse(rawData);
    } catch (err) {
        throw new Error("Error al leer el archivo de datos");
    }
}

// Función para escribir en el archivo JSON
function writeData(data) {
    try {
        fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
    } catch (err) {
        throw new Error("Error al escribir en el archivo de datos");
    }
}

// Ruta GET para obtener los usuarios
app.get('/empleados', (req, res) => {
    const data = readData();  // Leemos los datos
    res.json(data.TablaUsuario);  // Respondemos solo con la tabla de usuarios
});

// Ruta POST para agregar un nuevo trabajador
app.post('/empleados/add', (req, res) => {
    const newUser = req.body;  // Obtenemos los datos del cuerpo de la solicitud

    if (!newUser.nombre || !newUser.apellidos || !newUser.email || !newUser.numTel || !newUser.direccion) {
        return res.status(400).json({ message: "Faltan datos del usuario." });
    }

    const data = readData();  // Leemos los datos actuales
    const newId = data.TablaUsuario.length + 1;  // Generamos un nuevo ID

    // Creamos el nuevo usuario
    const userToAdd = { id: newId, ...newUser };

    // Agregamos el nuevo usuario a los datos
    data.TablaUsuario.push(userToAdd);

    // Escribimos los datos actualizados en el archivo JSON
    writeData(data);

    // Respondemos con el usuario agregado
    res.status(201).json({ message: "Usuario agregado", data: userToAdd });
});

// Ruta POST para eliminar un trabajador (usando el id en el cuerpo)
app.post('/empleados/delete', (req, res) => {
    const workerId = req.body.id;  // Obtenemos el id del trabajador a eliminar desde el cuerpo de la solicitud

    const data = readData();  // Leemos los datos actuales

    // Filtramos el trabajador que no coincide con el id
    const filteredWorkers = data.TablaUsuario.filter(worker => worker.id !== workerId);

    if (filteredWorkers.length === data.TablaUsuario.length) {
        return res.status(404).json({ message: "Trabajador no encontrado" });
    }

    // Actualizamos los datos con la lista de trabajadores sin el eliminado
    data.TablaUsuario = filteredWorkers;

    // Escribimos los datos actualizados en el archivo JSON
    writeData(data);

    // Respondemos con un mensaje de éxito
    res.json({ message: "Trabajador eliminado" });
});

// Iniciamos el servidor para que escuche en el puerto 3000
const port = 3000;
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
