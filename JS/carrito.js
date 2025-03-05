document.addEventListener('DOMContentLoaded', () => {
    const cartItems = [];
    const cartItemsContainer = document.getElementById('cartItems');
    const cartTotalElement = document.getElementById('cartTotal');
    const checkoutButton = document.getElementById('checkoutButton');
    const totalModalElement = document.getElementById('cartTotal');

    // Función para actualizar el carrito
    function updateCart() {
        cartItemsContainer.innerHTML = '';
        let total = 0;

        cartItems.forEach(item => {
            total += item.price * item.quantity;

            const li = document.createElement('li');
            li.className = 'list-group-item d-flex justify-content-between align-items-center';
            li.innerHTML = `
                ${item.name} x${item.quantity}
                <span>$${(item.price * item.quantity).toFixed(2)}</span>
                <button class="delete-btn" data-id="${item.id}">&times;</button>
            `;
            cartItemsContainer.appendChild(li);
        });

        cartTotalElement.textContent = total.toFixed(2);
        totalModalElement.textContent = total.toFixed(2);

        const deleteButtons = document.querySelectorAll('.delete-btn');
        deleteButtons.forEach(button => {
            button.addEventListener('click', eliminarDelCarrito);
        });
    }

    function eliminarDelCarrito(event) {
        const button = event.target;
        const idProducto = parseInt(button.getAttribute('data-id'), 10);

        const index = cartItems.findIndex(item => item.id === idProducto);
        if (index !== -1) {
            cartItems.splice(index, 1);
            updateCart();
        }
    }

    // Función para agregar productos al carrito
    document.querySelectorAll('.btn-sm').forEach(button => {
        button.addEventListener('click', function() {
            const idProducto = parseInt(button.getAttribute('data-id'), 10);
            const name = button.closest('.product-content').querySelector('h5').textContent;
            const price = parseFloat(button.closest('.product-content').querySelector('.price-tag').textContent.replace('$', ''));
            const quantity = 1; // Suponiendo que se añade 1 unidad cada vez

            const existingItem = cartItems.find(item => item.id === idProducto);

            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                cartItems.push({ id: idProducto, name, price, quantity });
            }

            updateCart();
        });
    });

    function cerrarModalCarrito() {
        const modal = document.getElementById('cartModal');
        modal.style.display = 'none';
        modal.classList.remove('fade-in');
    }

    function mostrarModalContraseña() {
        const modal = document.getElementById('passwordModal');
        modal.style.display = 'flex';
        modal.classList.add('fade-in');

        if (!document.querySelector('.modal-backdrop')) {
            const backdrop = document.createElement('div');
            backdrop.className = 'modal-backdrop fade show';
            document.body.appendChild(backdrop);
        }
    }

    function cerrarModal() {
        const modal = document.getElementById('passwordModal');
        modal.style.display = 'none';
        modal.classList.remove('fade-in');

        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) {
            backdrop.remove();
        }
    }

    function verificarContraseña() {
        const passwordInput = document.getElementById('passwordInput').value;
        const usuarioGuardado = JSON.parse(localStorage.getItem('user'));

        if (!usuarioGuardado) {
            alert("No hay un usuario en sesión. Por favor, inicia sesión.");
            cerrarModal();
            return;
        }

        if (passwordInput === usuarioGuardado.password) {
            cerrarModal();
            realizarVenta();
        } else {
            alert("Contraseña incorrecta. Inténtalo de nuevo.");
        }
    }

    async function realizarVenta() {
        checkoutButton.textContent = 'Procesando...';
        checkoutButton.disabled = true;

        const idCliente = 101;
        const formaPago = "Efectivo";
        const fecha = new Date().toISOString().split("T")[0];
        const totalModal = parseFloat(totalModalElement.textContent);

        const ventaData = {
            idCliente,
            formaPago,
            fecha,
            productos: cartItems.map(item => ({
                idProducto: item.id,
                cantidad: item.quantity,
                precio: item.price * item.quantity
            })),
            total: totalModal
        };

        try {
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
                cartItems.length = 0;
                updateCart();
                checkoutButton.textContent = 'Realizar Venta';
                checkoutButton.disabled = false;
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

    if (checkoutButton) {
        checkoutButton.addEventListener('click', async () => {
            cerrarModalCarrito();
            mostrarModalContraseña();
        });
    }

    const confirmarBtn = document.querySelector('#passwordModal .btn-primary');
    if (confirmarBtn) {
        confirmarBtn.addEventListener('click', verificarContraseña);
    }

    const cerrarBtn = document.querySelector('#passwordModal .btn-close');
    if (cerrarBtn) {
        cerrarBtn.addEventListener('click', cerrarModal);
    }

    const cancelarBtn = document.querySelector('#passwordModal .btn-secondary');
    if (cancelarBtn) {
        cancelarBtn.addEventListener('click', cerrarModal);
    }
    
});
