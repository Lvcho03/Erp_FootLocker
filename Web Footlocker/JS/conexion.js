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
                console.log(data);
                this.usuarios = data.TablaUsuario; // Cargar todos los usuarios
                this.administradores = data.TablaAdmin; // Cargar todos los administradores
                
                console.log(this.administradores);
                
            })
            .catch(error => {
                console.error('Error al cargar los datos:', error);
            });
    }

    validarUsuario(usuario, contrasena) {
        const usuarioEncontrado = this.usuarios.find(u => u.nombre === usuario && u.contrasena === contrasena);
        console.log(usuario,contrasena);
        if (usuarioEncontrado) {
            this.user = usuarioEncontrado; // Asignar usuario encontrado a this.user
            console.log("Usuario validado:", this.user);
        }
        return !!usuarioEncontrado;
    }

    validarAdmin(admin, contrasena) {
        const adminEncontrado = this.administradores.find(a => a.nombre === admin && a.contrasena === contrasena);
        if (adminEncontrado) {
            this.user = adminEncontrado; // Asignar admin encontrado a this.user
            console.log("Administrador validado:", this.user);
        }
        return !!adminEncontrado;
    }

    devolverNameUsuario() {
        if (!this.user) {
            console.log("Error: this.user es null");
        }
        return this.user ? this.user.nombre : null;
    }
}