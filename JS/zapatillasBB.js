
function addProduct() {
    const modelo = document.getElementById("new-product-modelo").value;
    const ventas = document.getElementById("new-product-ventas").value;
    const precio = document.getElementById("new-product-precio").value;
  

    if (!modelo || !ventas || !precio) {
        alert("Por favor, completa todos los campos.");
        return;
    }

    const nuevoProducto = {
        modelo: modelo,
        ventas: ventas, // Contraseña fija o predeterminada
        precio: precio
    };

    // Configuración de la solicitud
    fetch('http://localhost:3000/addproduct', {  // Cambia 'PORT' por tu puerto y 'your-endpoint' por la ruta del servidor donde se maneja la lógica de añadir trabajador.
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(nuevoProducto)
    })
    .then(response => response.json())  // Analiza la respuesta como JSON
    .then(data => {
        if (data.success) {
            alert("Producto agregado correctamente");
            showProducts(); // Actualiza la lista de trabajadores en el frontend
        } 
    })
    .catch((error) => {
        console.error("Error en la petición al servidor:", error);
        alert("Error en la petición al servidor.");
    });

    // Limpiar los campos de entrada
    document.getElementById("new-product-modelo").value = "";
    document.getElementById("new-product-ventas").value = "";
    document.getElementById("new-product-precio").value = "";
}
function deleteProduct(productId) {
    fetch("http://localhost:3000/eliminarproducto", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ id: productId })
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error("Error al eliminar el producto.");
        }
    })
    .then(result => {
        alert("Producto eliminado correctamente");
        console.log(result);
        showProducts();  // Actualiza la lista de productos en el frontend
    })
    .catch(error => {
        console.error(error);
        alert("Hubo un error al eliminar el producto.");
    });
}

function showProducts() {
    fetch("http://localhost:3000/zapatillas")  // Ruta que obtiene los productos desde el servidor
    .then(response => {
        if (!response.ok) {
            throw new Error("Error al cargar los productos");
        }
        return response.json();
    })
    .then(products => {
        const contenedor = document.getElementById("product-cards-container");  // Contenedor donde se mostrarán los productos
        contenedor.innerHTML = '';  // Limpiar el contenedor antes de agregar los nuevos productos

        products.forEach(product => {
            const div = document.createElement("div");
            div.classList.add("product-card");
            div.id = `product-card-${product.id}`;

            div.innerHTML = `
                <span class="delete-icon" id="delete-${product.id}" onclick="deleteProduct(${product.id})">✖</span>

                <img src="../imagenes/product.png" class="product-pic" id="product-pic-${product.id}">

                <div class="product-info">
                    <h2 id="product-name-${product.id}">${product.modelo}</h2>
                    <p><strong>Precio:</strong> <span id="product-price-${product.id}">${product.precio}</span></p>
                    <p><strong>Total de ventas:</strong> <span id="product-sales-${product.id}">${product.total_ventas}</span></p>
                    <button class="edit" id="edit-${product.id}" onclick="editProduct(${product.id})">Editar</button>
                </div>
            `;

            contenedor.appendChild(div);
        });
    })
    .catch(error => {
        console.error('Error al obtener los productos:', error);
    });
}
function editProduct(id){
    fetch(`http://localhost:3000/editar-producto/${id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener los datos del producto');
            }
            return response.json();
        })
        .then(data => {
            document.getElementById("edit-modelo").value = product.modelo;
            document.getElementById("edit-ventas").value = product.total_ventas;
            document.getElementById("edit-precio").value = product.precio;

            currentEditingId = id;
            document.getElementById("edit-modal").style.display = "flex";
        })
        .catch(error => {
            console.error('Error:', error);
        });

}
function closeModal() {
    document.getElementById("edit-modal").style.display = "none";
}

function saveChanges() {
    const modelo = document.getElementById("edit-modelo").value;
    const ventas = document.getElementById("edit-ventas").value;
    const precio = document.getElementById("edit-precio").value;

    fetch(`http://localhost:3000/actualizar-producto/${currentEditingId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ modelo: modelo, total_ventas: ventas, precio: precio })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al guardar los cambios');
        }
        return response.json();
    })
    .then(data => {
        alert("Cambios guardados correctamente.");
        document.getElementById(`product-modelo-${currentEditingId}`).innerText = modelo;
        document.getElementById(`product-ventas-${currentEditingId}`).innerText = ventas;
        document.getElementById(`product-precio-${currentEditingId}`).innerText = precio;
        closeModal();
    })
    .catch(error => {
        console.error('Error:', error);
        alert("Error al guardar los cambios.");
    });
}


module.exports = Zapatillas;