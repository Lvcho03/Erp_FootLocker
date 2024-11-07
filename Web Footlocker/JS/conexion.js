class Conexion {
    constructor() {
        this.usuarios = [];
        this.administradores = [];
        this.user = null;
    }

    // Cargar datos desde el archivo JSON y retornar la promesa de `fetch`
    cargarDatos() {
        return fetch('../Json/BD.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('No se cargó el archivo');
                }
                return response.json();
            })
            .then(data => {
                this.usuarios = data.TablaUsuario; // Cargar todos los usuarios
                this.administradores = data.TablaAdmin; // Cargar todos los administradores
                console.log("Datos cargados correctamente:", this.usuarios, this.administradores);
            })
            .catch(error => {
                console.error('Error al cargar los datos:', error);
            });
    }

    validarUsuario(usuario, contrasena) {
        const usuarioEncontrado = this.usuarios.find(u => u.nombre === usuario && u.contrasena === contrasena);
        return !!usuarioEncontrado;
    }

    validarAdmin(admin, contrasena) {
        const adminEncontrado = this.administradores.find(a => a.nombre === admin && a.contrasena === contrasena);
        this.user = adminEncontrado;
        return !!adminEncontrado;
    }

    devolverNameUsuario() {
        console.log("CACA");
        console.log(this.user);
        return this.user ? this.user.nombre : null;
    }
}
