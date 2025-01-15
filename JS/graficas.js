function obtenerVentasTotalesPorProducto() {
    return fetch('http://localhost:3000/ventas', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Error al obtener datos del servidor.");
        }
        return response.json();
    })
    .then(ventas => {
        // Transformar el array recibido en un objeto { producto: ventas }
        const ventasPorProducto = {};
        ventas.forEach(venta => {
            ventasPorProducto[venta.producto] = venta.total_ventas;
        });
        console.log("Ventas totales por producto:", ventasPorProducto);
        return ventasPorProducto; // Devuelve el resultado si se necesita.
    })
    .catch(error => {
        console.error("Error al obtener ventas por producto:", error);
    });
}

async function obtenerVentasMensualesPorProducto() {
    return fetch('http://localhost:3000/ventasMensuales', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Error al obtener datos del servidor.");
        }
        return response.json();
    })
    .then(ventasMensuales => {
        // Transformar el array recibido en un formato para la gráfica de área
        const ventasPorMesProducto = ventasMensuales.map(mes => [mes.mes, mes.nike, mes.vans, mes.converse]);
        return ventasPorMesProducto; // Devuelve el resultado si se necesita.
    })
    .catch(error => {
        console.error("Error al obtener ventas mensuales por producto:", error);
    });
}

async function obtenerDiferenciasVentasPorProducto() {
    try {
        const response = await fetch('http://localhost:3000/diferenciasVentas', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error("Error al obtener datos del servidor.");
        }

        const diferenciasVentas = await response.json();

        console.log(diferenciasVentas + "x");

        if (Array.isArray(diferenciasVentas) && diferenciasVentas.length > 0) {
            return diferenciasVentas.map(item => {
                if (Array.isArray(item) && item.length >= 2) {
                    return [item[0], parseFloat(item[1])];
                } else {
                    return ['Sin nombre', 0];  // Manejo de datos incorrectos
                }
            });
        } else {
            console.warn("Datos vacíos o formato inesperado recibido del servidor.");
            return [['Sin nombre', 0]];  // En caso de recibir datos vacíos o datos mal formados
        }
    } catch (error) {
        console.error("Error al obtener diferencias de ventas por producto:", error);
        return [['Sin nombre', 0]]; // Manejo de error con datos predeterminados.
    }
}
