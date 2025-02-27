document.addEventListener("DOMContentLoaded", function() {
    fetch("http://localhost:3000/allProducto")
        .then(response => response.json())
        .then(productos => {
            if (Array.isArray(productos)) {
                mostrarProductos(productos);
            } else {
                console.error("La respuesta no es un arreglo de productos.");
            }
        })
        .catch(error => {
            console.error("Error al obtener los productos:", error);
        });
});

// Función para agregar productos al carrito (ahora no se llama directamente desde el botón)
// Puedes conservarla si la necesitas en otro contexto.
function agregarAlCarrito(button) {
    const cartConfirmation = new bootstrap.Toast(document.getElementById('cartConfirmation'));
    cartConfirmation.show();
}

function mostrarProductos(productos) {
    const tableBody = document.querySelector("#productTable tbody");
    tableBody.innerHTML = "";

    productos.forEach((producto, index) => {
        const fila = document.createElement("tr");
        fila.setAttribute('data-id', producto.id); // Asigna el ID real del producto como atributo data-id
    
        // Se elimina el atributo "id" y el onclick del botón y se agrega la clase "btnCarrito"
        fila.innerHTML = `
            <td>${producto.id}</td> 
            <td>${producto.m}</td>
            <td>${producto.mo}</td>
            <td>${producto.p}</td>
            <td>${producto.st}</td>
            <td class="acciones d-flex justify-content-between align-items-center">
                <div class="d-flex align-items-center">
                    <button class="btn btn-secondary me-2 btnCarrito" onclick="agregarAlCarrito(this)">
                        <i class="bi bi-cart"></i>
                    </button>
                    <span class="me-2">Cantidad:</span>
                    <input type="number" class="form-control me-2" style="width: 100px;" value="1" min="1">
                </div>
                <div>
                    <button class="btn me-2 btn-editar" onclick="editarProducto(${producto.id})">Editar</button>
                    <button class="btn me-2 btnBorrar" data-id="${producto.id}">Eliminar</button>
                </div>
            </td>
        `;
        tableBody.appendChild(fila);
    });

    document.querySelectorAll(".btn-editar, .btnBorrar").forEach(boton => {
        boton.style.backgroundColor = "#272a57"; // Azul oscuro en estado normal
        boton.style.borderColor = "#272a57";
        boton.style.color = "white";

        boton.addEventListener("mouseenter", function() {
            if (boton.classList.contains("btn-editar")) {
                boton.style.backgroundColor = "#0077e6"; // Azul claro en hover
                boton.style.borderColor = "#0077e6";
            } else if (boton.classList.contains("btnBorrar")) {
                boton.style.backgroundColor = "#dc3545"; // Rojo en hover
                boton.style.borderColor = "#dc3545";
            }
        });

        boton.addEventListener("mouseleave", function() {
            boton.style.backgroundColor = "#272a57"; // Vuelve al azul oscuro
            boton.style.borderColor = "#272a57";
        });
    });
    
    // Agregar eventos a los botones "Eliminar"
    document.querySelectorAll(".btnBorrar").forEach((boton) => {
        boton.addEventListener("click", function () {
            const productoId = this.getAttribute("data-id");
            mostrarModalEliminar(productoId);
        });
    });
}

// Delegación de eventos en el contenedor de la tabla para el botón del carrito
document.querySelector("#productTable tbody").addEventListener("click", function (event) {
    // Si se hace clic en cualquier elemento dentro de un botón con la clase "btnCarrito"
    if (event.target.closest(".btnCarrito")) {
        const cartConfirmation = document.getElementById("cartConfirmation");
        if (cartConfirmation) {
            const toast = new bootstrap.Toast(cartConfirmation);
            toast.show();
        } else {
            console.error("No se encontró el elemento con ID 'cartConfirmation'");
        }
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const tabla = document.querySelector("table");
    
    if (!tabla) {
        console.error("No se encontró la tabla en el DOM.");
        return;
    }

    tabla.addEventListener("click", function(event) {
        if (event.target.tagName === "BUTTON" && event.target.textContent.trim() === "Editar") {
            // Encuentra el <tr> padre del botón clickeado
            const trElement = event.target.closest('tr');
            if (trElement) {
                // Obtiene el contenido del primer <td> dentro de esa fila
                const idStr = trElement.querySelector('td:first-child').textContent.trim();
                
                fetch("http://localhost:3000/allProducto")
                    .then(respuesta => respuesta.json())
                    .then(productos => {
                        if (!Array.isArray(productos)) {
                            console.error("La respuesta no es un arreglo.");
                            return;
                        }

                        // Convertir idStr a entero para que coincida con el formato de los IDs
                        const id = parseInt(idStr, 10);
                        if (isNaN(id)) {
                            console.error(`El ID extraído (${idStr}) no es válido.`);
                            return;
                        }

                        // Encuentra el producto con el ID
                        const productoSeleccionado = productos.find(p => p.id === id);
                        if (productoSeleccionado) {
                            // Setear los valores en el modal
                            document.getElementById('productId').value = productoSeleccionado.id;
                            document.getElementById('marca').value = productoSeleccionado.m;
                            document.getElementById('modelo').value = productoSeleccionado.mo;
                            document.getElementById('precio').value = productoSeleccionado.p;
                            document.getElementById('stock').value = productoSeleccionado.st;

                            // Abrir el modal
                            var modal = new bootstrap.Modal(document.getElementById('editProductModal'));
                            modal.show();

                            // Evento de submit del formulario
                            document.getElementById('editProductForm').addEventListener('submit', function(e) {
                                e.preventDefault();  // Evita que el formulario se envíe de forma tradicional

                                const id = document.getElementById('productId').value;
                                const marca = document.getElementById('marca').value;
                                const modelo = document.getElementById('modelo').value;
                                const precio = document.getElementById('precio').value;
                                const stock = document.getElementById('stock').value;

                                // Realizar la petición PUT al servidor
                                fetch(`http://localhost:3000/actualizar-producto/${id}`, {
                                    method: 'PUT',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({ marca, modelo, precio, stock }),
                                })
                                .then(response => {
                                    if (!response.ok) {
                                        throw new Error('Error en la petición PUT');
                                    }
                                    return response.json();
                                })
                                .then(data => {
                                    console.log(data.message);
                                    modal.hide();  // Cierra el modal después de guardar
                                    // Aquí puedes actualizar la fila de la tabla en el DOM si deseas
                                })
                                .catch(error => {
                                    console.error('Error:', error);
                                });
                            });
                        } else {
                            console.error(`No se encontró el producto con ID: ${idStr}`);
                        }
                    })
                    .catch(error => {
                        console.error("Error al obtener los productos:", error);
                    });
            }
        }
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const botonGuardar = document.querySelector("#guardar-producto");
    
    if (!botonGuardar) {
        console.error("No se encontró el botón #guardar-producto en el DOM.");
        return;
    }

    botonGuardar.addEventListener("click", function(event) {
        const marca = document.getElementById('newMarca').value;
        const modelo = document.getElementById('newModelo').value;
        const precio = parseFloat(document.getElementById('newPrecio').value);
        const stock = parseInt(document.getElementById('newStock').value);

        // Validar que todos los campos estén completos
        if (!marca || !modelo || isNaN(precio) || isNaN(stock)) {
            alert("Por favor, completa todos los campos correctamente.");
            return;
        }

        // Realizar la solicitud POST para agregar el producto al servidor
        fetch("http://localhost:3000/agregarProducto", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ marca, modelo, precio, stock }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Error al agregar el producto");
            }
            return response.json();
        })
        .then(data => {
            console.log("Producto agregado:", data);
            // Volver a obtener la lista de productos actualizada, si es necesario
            obtenerProductos();
        })
        .catch(error => {
            console.error("Error:", error);
        });

        // Limpiar los campos de entrada
        document.getElementById("newMarca").value = "";
        document.getElementById("newModelo").value = "";
        document.getElementById("newPrecio").value = "";
        document.getElementById("newStock").value = "";

        // Cerrar el modal después de guardar
        const modal = bootstrap.Modal.getInstance(document.getElementById("addProductModal"));
        modal.hide();
    });
});

function mostrarModalEliminar(productoId) {
    productoAEliminar = productoId; // Guarda el ID del producto
    console.log("Producto a eliminar:", productoAEliminar); // Verifica el ID
    const deleteModal = new bootstrap.Modal(document.getElementById("deleteProductModal"));
    deleteModal.show();
}

function eliminarProducto() {
    if (!productoAEliminar) {
        console.error("No se encontró un ID de producto para eliminar");
        return;
    }

    console.log("Eliminando producto con ID:", productoAEliminar); // Verifica el ID
    fetch(`http://localhost:3000/eliminarProducto/${productoAEliminar}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Error al eliminar el producto");
            }
            return response.json();
        })
        .then((data) => {
            console.log("Producto eliminado correctamente:", data);
            obtenerProductos(); // Actualiza la lista de productos
        })
        .catch((error) => {
            console.error("Error al eliminar el producto:", error);
        });

    // Cierra el modal
    const deleteModal = bootstrap.Modal.getInstance(document.getElementById("deleteProductModal"));
    deleteModal.hide();
}

// Función para ordenar la tabla
function ordenarTabla(criterio) {
    const tabla = document.getElementById('productTable');
    const filas = Array.from(tabla.tBodies[0].rows);

    filas.sort((filaA, filaB) => {
        let valorA, valorB;

        switch (criterio) {
            case 'marca':
                valorA = filaA.cells[1].textContent.toLowerCase();
                valorB = filaB.cells[1].textContent.toLowerCase();
                return valorA.localeCompare(valorB);
            
            case 'modelo':
                valorA = filaA.cells[2].textContent.toLowerCase();
                valorB = filaB.cells[2].textContent.toLowerCase();
                return valorA.localeCompare(valorB);

            case 'precio':
                valorA = parseFloat(filaA.cells[3].textContent);
                valorB = parseFloat(filaB.cells[3].textContent);
                return valorB - valorA;

            case 'stock':
                valorA = parseInt(filaA.cells[4].textContent, 10);
                valorB = parseInt(filaB.cells[4].textContent, 10);
                return valorB - valorA;
        }
    });

    // Reordenar las filas en la tabla
    const tbody = tabla.tBodies[0];
    filas.forEach(fila => tbody.appendChild(fila));
}