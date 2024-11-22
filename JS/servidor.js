const http = require("http");
const fs = require("fs");
const url = require("url");

// Ruta al archivo JSON
const dataPath = "BD.json"

// Leer el archivo JSON
function readData() {
    try {
        const rawData = fs.readFileSync("BD.json");
        return JSON.parse(rawData);
    } catch (err) {
        throw new Error("Error al leer el archivo de datos");
    }
}

// Escribir en el archivo JSON
function writeData(data) {
    try {
        fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
    } catch (err) {
        throw new Error("Error al escribir en el archivo de datos");
    }
}

// Responder con un mensaje de éxito o error
function sendResponse(res, statusCode, message, data = null) {
    res.statusCode = statusCode;
    const response = { message, data };
    res.end(JSON.stringify(response));
}

const hostname = "localhost";
const port = 3000;

const server = http.createServer((req, res) => {
    const { pathname, query } = url.parse(req.url, true);
    let data;

    try {
        data = readData(); // Leer los datos desde el archivo JSON
    } catch (err) {
        sendResponse(res, 500, "Error al leer el archivo de datos");
        return;
    }

    res.setHeader("Content-Type", "application/json");

    // Ruta para añadir usuario
    if (pathname === "/add" && req.method === "POST") {
        let body = "";
        req.on("data", chunk => {
            body += chunk;
        });

        req.on("end", () => {
            try {
                const newUser = JSON.parse(body);
                
                // Asignar un ID único
                newUser.id = data.TablaUsuario.length + 1;

                // Validar los campos necesarios
                if (!newUser.nombre || !newUser.email || !newUser.numTel || !newUser.direccion) {
                    sendResponse(res, 400, "Faltan campos obligatorios");
                    return;
                }

                // Agregar el nuevo usuario
                data.TablaUsuario.push(newUser);
                writeData(data); // Guardar los cambios en el archivo
                sendResponse(res, 200, "Usuario añadido", newUser);

            } catch (err) {
                sendResponse(res, 400, "Error al procesar los datos enviados");
            }
        });

    // Ruta para modificar usuario
    } else if (pathname === "/modify" && req.method === "PUT") {
        let body = "";
        req.on("data", chunk => {
            body += chunk;
        });

        req.on("end", () => {
            try {
                const updatedUser = JSON.parse(body);
                const index = data.TablaUsuario.findIndex(user => user.id === updatedUser.id);
                
                if (index !== -1) {
                    data.TablaUsuario[index] = updatedUser;
                    writeData(data);
                    sendResponse(res, 200, "Usuario modificado", updatedUser);
                } else {
                    sendResponse(res, 404, "Usuario no encontrado");
                }

            } catch (err) {
                sendResponse(res, 400, "Error al procesar los datos enviados");
            }
        });

    // Ruta para eliminar usuario
    } else if (pathname === "/delete" && req.method === "DELETE") {
        const id = parseInt(query.id, 10);
        const index = data.TablaUsuario.findIndex(user => user.id === id);
        
        if (index !== -1) {
            const deletedUser = data.TablaUsuario.splice(index, 1);
            writeData(data);
            sendResponse(res, 200, "Usuario eliminado", deletedUser[0]);
        } else {
            sendResponse(res, 404, "Usuario no encontrado");
        }

    // Ruta para obtener usuarios
    } else if (pathname === "/users" && req.method === "GET") {
        sendResponse(res, 200, "Usuarios obtenidos", data.TablaUsuario);

    // Si la ruta no es válida
    } else {
        sendResponse(res, 404, "Ruta no encontrada");
    }
});

server.listen(port, hostname, () => {
    console.log(`Servidor corriendo en http://${hostname}:${port}/`);
});
