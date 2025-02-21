function volver() {
    let usuarioGuardado = JSON.parse(localStorage.getItem("user")); // Obtener el objeto user

    if (usuarioGuardado && usuarioGuardado.rol) { // Verificar que exista y tenga rol
        if (usuarioGuardado.rol === "admin") {
            window.location.href = "../html/templateAdminPage.html"; // Redirige al admin
        } else {
            window.location.href = "../html/templateNotAdminPage.html"; // Redirige a usuario normal
        }
    } else {
        console.error("No se encontró información del usuario en localStorage.");
    }
}


document.addEventListener("DOMContentLoaded", function() {
    // Recuperar el usuario almacenado en localStorage
    const usuarioGuardado = JSON.parse(localStorage.getItem('user'));

    if (usuarioGuardado && usuarioGuardado.username) {
        // Mostrar el nombre en el span
        document.getElementById('miCuenta').innerHTML = '<i class="fas fa-user me-2"></i> ' + usuarioGuardado.username;
    } else {
        console.error("No se encontró información del usuario en localStorage.");
    }
});


document.addEventListener("DOMContentLoaded", function() {
    // Recuperar el rol desde el localStorage

    const user = JSON.parse(localStorage.getItem('user'));

    // Mostrar o esconder elementos dependiendo del rol
    if (user.rol === 'admin') {

        // Puedes mostrar un botón o sección exclusiva para admin
        document.getElementById('adminSection').style.display = 'none'; // Muestra la sección
    } 
});


document.addEventListener("DOMContentLoaded", function() {
    fetch("http://localhost:3000/allProducto")
        .then(response => response.json())
        .then(productos => {
            if (Array.isArray(productos)) {
                console.log(productos);
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
/*
function mostrarProductos(productos) {
    const tableBody = document.querySelector("#row-g-4"); // Corregí el selector para que funcione
    tableBody.innerHTML = "";
                    
    productos.forEach(producto => {
        
        let row = document.createElement("div");
        row.classList.add("col-md-4", "col-lg-3"); // Añado las clases correspondientes
        row.setAttribute("data-id", producto.id);
       
        console.log(producto);
        row.innerHTML = `

            <div class="book">
                <div class="product-content p-3">
                    <h5 class="fw-bold mb-2">${producto.p}</h5>
                    <p class="text-muted small mb-3">${producto.description}</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <span class="price-tag">$${producto.price}</span>
                        <button class="btn btn-primary btn-sm btnCarrito">Añadir</button>
                    </div>
                </div>
                <div class="cover">
                    <img src="../static/img/esports_${producto.id}.webp" alt="${producto.p}" 
                        class="w-100 h-100" style="object-fit: cover; border-radius: 10px;">
                </div>
            </div>
        `;

        tableBody.appendChild(row);
    });
}*/
