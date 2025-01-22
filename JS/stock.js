


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

function mostrarProductos(productos) {
    const tableBody = document.querySelector("#productTable tbody");
    tableBody.innerHTML = "";

    productos.forEach((producto, index) => {
        const fila = document.createElement("tr");
        fila.setAttribute('data-id', producto.id); // Asigna el ID real del producto como atributo data-id
    
        fila.innerHTML = `
            <td>${producto.id}</td>
            <td>${producto.m}</td>
            <td>${producto.mo}</td>
            <td>${producto.p}</td>
            <td>${producto.st}</td>
            <td class="acciones d-flex justify-content-between align-items-center">
                <div class="d-flex align-items-center">
                    <button class="btn btn-secondary me-2" onclick="agregarAlCarrito(this)">
                        <i class="bi bi-cart"></i>
                    </button>
                    <span class="me-2">Cantidad:</span>
                    <input type="number" class="form-control me-2" style="width: 100px;" value="1" min="1">
                </div>
                <div>
                    <button class="btn btn-primary me-2" onclick="editarProducto(${producto.id})">Editar</button>
                    <button class="btn btn-danger me-2 btnBorrar" data-id="${producto.id}">Eliminar</button>
                </div>
            </td>
        `;
        document.querySelector("#productTable tbody").appendChild(fila);
    });
    
    // Agregar eventos a los botones "Eliminar"
    document.querySelectorAll(".btnBorrar").forEach((boton) => {
        boton.addEventListener("click", function () {
            const productoId = this.getAttribute("data-id");
            eliminarProducto(productoId);
        });
    });
}







document.querySelector("table").addEventListener("click", function(event) {
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

document.querySelector("#guardar-producto").addEventListener("click", function(event) {
    
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




//ELIMINAR PRODUCTO
function eliminarProducto(productoId) {
    if (!productoId) {
        alert("Por favor, proporciona un ID de producto válido.");
        return;
    }

    // Realizar la solicitud DELETE para eliminar el producto del servidor
    fetch(`http://localhost:3000/eliminarProducto/${productoId}`, {
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
            console.log("Producto eliminado:", data);
            // Actualizar la lista de productos después de eliminar
            obtenerProductos();
        })
        .catch((error) => {
            console.error("Error:", error);
        });
        const modal = bootstrap.Modal.getInstance(document.getElementById("deleteProductModal"));
        modal.hide();
}





