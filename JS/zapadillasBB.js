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

}


function addProduct(id, modelo, total_ventas, precio) {
    fetch("http://localhost:3000/agregar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ id, modelo, total_ventas, precio })
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error("Error al agregar la zapatilla.");
        }
    })
    .then(result => {
        alert("Zapatilla agregada correctamente");
        console.log(result);
        showProducts(); // Actualiza la lista de productos en el frontend
    })
    .catch(error => {
        console.error(error);
        alert("Hubo un error al agregar la zapatilla.");
    });
}
function deleteProduct(productId) {
    fetch("http://localhost:3000/eliminar", {
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

module.exports = Zapatillas;