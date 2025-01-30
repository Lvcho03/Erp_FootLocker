document.addEventListener('DOMContentLoaded', () => {
    const cartItems = [];
    const cartItemsContainer = document.getElementById('cartItems');
    const cartTotalElement = document.getElementById('cartTotal'); // Elemento donde se muestra el total del carrito
    const checkoutButton = document.getElementById('checkoutButton');
    const totalModalElement = document.getElementById('cartTotal'); // Referencia al modal total

    // Función para actualizar el carrito
    function updateCart() {
        cartItemsContainer.innerHTML = ''; // Limpiar contenido actual
        let total = 0;
    
        cartItems.forEach(item => {
            total += item.price * item.quantity;
    
            const li = document.createElement('li');
            li.className = 'list-group-item d-flex justify-content-between align-items-center';
            
            // Se añade un enlace o botón para eliminar
            li.innerHTML = `
                ${item.name} x${item.quantity} 
                <span>$${(item.price * item.quantity).toFixed(2)}</span>
                <button class="delete-btn" data-id="${item.id}">&times;</button> <!-- Aquí se agrega el botón -->
            `;
    
            cartItemsContainer.appendChild(li);
        });
    
        cartTotalElement.textContent = total.toFixed(2);
        totalModalElement.textContent = total.toFixed(2); // Actualizamos el total en el modal
    
        // Asegurarnos de que los botones para eliminar estén capturados
        const deleteButtons = document.querySelectorAll('.delete-btn');
        deleteButtons.forEach(button => {
            button.addEventListener('click', eliminarDelCarrito);
        });
    }
    
    function eliminarDelCarrito(event) {
        const button = event.target;
        const idProducto = parseInt(button.getAttribute('data-id'), 10); // Obtener el ID del producto desde el data-id del botón
        
        const index = cartItems.findIndex(item => item.id === idProducto);
        if (index !== -1) {
            cartItems.splice(index, 1); // Eliminar el producto del carrito
            updateCart(); // Actualizar la visualización del carrito
        }
    }

    // Función para agregar productos al carrito
    window.agregarAlCarrito = function (button) {
        const fila = button.closest('tr'); // Encuentra la fila que contiene el botón
        const idProducto = parseInt(fila.dataset.id, 10); // Obtiene el ID real del producto
    
        if (!idProducto) {
            alert('No se encontró el producto.');
            return;
        }
    
        const name = fila.children[1].textContent; // Nombre del producto
        const price = parseFloat(fila.children[3].textContent); // Precio del producto
        const quantityInput = fila.querySelector('input[type="number"]');
        const quantity = parseInt(quantityInput.value, 10); // Cantidad seleccionada
    
        if (quantity > 0) {
            const existingItem = cartItems.find(item => item.id === idProducto);
    
            if (existingItem) {
                existingItem.quantity += quantity; // Incrementar cantidad si ya existe en el carrito
            } else {
                cartItems.push({ id: idProducto, name, price, quantity }); // Agregar nuevo producto al carrito
            }
    
            updateCart();
        } else {
            alert('La cantidad debe ser mayor a 0.');
        }
    };

    function cerrarModalCarrito() {
        const modal = document.getElementById('cartModal');
        modal.style.display = 'none'; // Ocultar el modal
        modal.classList.remove('fade-in'); // Eliminar el efecto fade-in
    }

    // Función para mostrar el modal de la contraseña
    function mostrarModalContraseña() {
        const modal = document.getElementById('passwordModal');
        modal.style.display = 'flex'; // Usamos flex para centrar el modal
        modal.classList.add('fade-in'); // Añadimos el efecto fade-in
    
        // Crear el fondo negro si no existe
        if (!document.querySelector('.modal-backdrop')) {
            const backdrop = document.createElement('div');
            backdrop.className = 'modal-backdrop fade show';
            document.body.appendChild(backdrop); // Añadirlo al DOM
        }
    }

    // Función que cierra el modal de confirmación de contraseña
    function cerrarModal() {
        const modal = document.getElementById('passwordModal');
        modal.style.display = 'none'; // Ocultar el modal
        modal.classList.remove('fade-in'); // Eliminar el efecto fade-in
    
        // Remover manualmente el fondo negro (modal-backdrop)
        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) {
            backdrop.remove(); // Elimina el elemento del DOM
        }
    }

    // Función que verifica la contraseña ingresada
    function verificarContraseña() {
        const passwordInput = document.getElementById('passwordInput').value;
        const usuarioGuardado = JSON.parse(localStorage.getItem('user'));

        if (!usuarioGuardado) {
            alert("No hay un usuario en sesión. Por favor, inicia sesión.");
            cerrarModal();
            return;
        }

        // Verificar si la contraseña ingresada coincide con la guardada en localStorage
        if (passwordInput === usuarioGuardado.password) {
            cerrarModal();
            realizarVenta(); // Llama a la función para realizar la compra
        } else {
            alert("Contraseña incorrecta. Inténtalo de nuevo.");
        }
    }

    // Función async que maneja la venta
    async function realizarVenta() {
        // Cambiar el estado del botón
        checkoutButton.textContent = 'Procesando...';
        checkoutButton.disabled = true;

        // Datos del cliente, forma de pago y fecha de la venta
        const idCliente = 101; // Supongamos que este es el ID del cliente autenticado
        const formaPago = "Efectivo"; // Forma de pago seleccionada
        const fecha = new Date().toISOString().split("T")[0]; // Fecha actual en formato YYYY-MM-DD

        // Capturar el total del modal
        const totalModal = parseFloat(totalModalElement.textContent);

        // Crear el objeto de venta
        const ventaData = {
            idCliente,
            formaPago,
            fecha,
            productos: cartItems.map(item => ({
                idProducto: item.id,
                cantidad: item.quantity,
                precio: item.price * item.quantity
            })),
            total: totalModal // Se añade el total del modal al objeto de venta
        };

        try {
            // Enviar datos al servidor
            const response = await fetch('http://localhost:3000/crearventa', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(ventaData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al registrar la venta');
            }

            const result = await response.json();

            if (result.success) {
                alert('Venta realizada con éxito.');
                cartItems.length = 0; // Vaciar carrito
                updateCart(); // Actualizar visualización del carrito

                // Cambiar el estado del botón
                checkoutButton.textContent = 'Realizar Venta';
                checkoutButton.disabled = false;

                // Cerrar el modal de confirmación de contraseña
                cerrarModal();
            } else {
                alert('Error: ' + result.message);
                checkoutButton.textContent = 'Realizar Venta';
                checkoutButton.disabled = false;
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Ocurrió un error al realizar la venta. Por favor, inténtalo nuevamente.');
            checkoutButton.textContent = 'Realizar Venta';
            checkoutButton.disabled = false;
        }
    }

    // Asegurar que el evento de "Realizar Venta" esté correctamente asignado al botón
    if (checkoutButton) {
        checkoutButton.addEventListener('click', async () => {
            // Cerrar el modal del carrito antes de abrir el de la contraseña
            cerrarModalCarrito();
            // Mostrar el modal de confirmación de contraseña
            mostrarModalContraseña();
        });
    }

    // Evento para verificar la contraseña cuando se haga clic en el botón "Confirmar" del modal
    const confirmarBtn = document.querySelector('#passwordModal .btn-primary');
    if (confirmarBtn) {
        confirmarBtn.addEventListener('click', verificarContraseña);
    }

    // Evento para cerrar el modal cuando se haga clic en el botón "Cerrar" (X) del modal
    const cerrarBtn = document.querySelector('#passwordModal .btn-close');
    if (cerrarBtn) {
        cerrarBtn.addEventListener('click', cerrarModal);
    }

    // Evento para cerrar el modal cuando se haga clic en el botón "Cancelar" del modal
    const cancelarBtn = document.querySelector('#passwordModal .btn-secondary');
    if (cancelarBtn) {
        cancelarBtn.addEventListener('click', cerrarModal);
    }
});