document.addEventListener('DOMContentLoaded', () => {
    const cartItems = [];
    const cartItemsContainer = document.getElementById('cartItems');
    const cartTotalElement = document.getElementById('cartTotal');
    const checkoutButton = document.getElementById('checkoutButton');

    // Función para actualizar el carrito
    function updateCart() {
        cartItemsContainer.innerHTML = ''; // Limpiar contenido actual
        let total = 0;

        cartItems.forEach(item => {
            total += item.price * item.quantity;

            const li = document.createElement('li');
            li.className = 'list-group-item d-flex justify-content-between align-items-center';
            li.innerHTML = `
                ${item.name} x${item.quantity} 
                <span>$${(item.price * item.quantity).toFixed(2)}</span>
            `;

            cartItemsContainer.appendChild(li);
        });

        cartTotalElement.textContent = total.toFixed(2);
    }

    // Función para agregar productos al carrito
    window.agregarAlCarrito = function (id) {
        const fila = document.querySelector(`#productTable tbody tr:nth-child(${id})`);

        if (!fila) {
            alert('No se encontró el producto.');
            return;
        }

        const name = fila.children[1].textContent; // Nombre del producto
        const price = parseFloat(fila.children[3].textContent); // Precio del producto
        const quantityInput = fila.querySelector('input[type="number"]');
        const quantity = parseInt(quantityInput.value, 10); // Cantidad seleccionada

        if (quantity > 0) {
            const idProducto = parseInt(fila.dataset.id, 10); // Obtener el id del producto desde el atributo 'data-id'
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

    // Manejar el evento de "Realizar Venta"
    if (checkoutButton) {
        checkoutButton.addEventListener('click', async () => {
            if (cartItems.length === 0) {
                alert('El carrito está vacío.');
                return;
            }

            // Cambiar el estado del botón
            checkoutButton.textContent = 'Procesando...';
            checkoutButton.disabled = true;

            // Datos del cliente, forma de pago y fecha de la venta
            const idCliente = 101; // Supongamos que este es el ID del cliente autenticado
            const formaPago = "Efectivo"; // Forma de pago seleccionada
            const fecha = new Date().toISOString().split("T")[0]; // Fecha actual en formato YYYY-MM-DD

            // Crear el objeto de venta
            const ventaData = {
                idCliente,
                formaPago,
                fecha,
                productos: cartItems.map(item => ({
                    idProducto: item.id,
                    cantidad: item.quantity
                }))
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
        });
    }
});
