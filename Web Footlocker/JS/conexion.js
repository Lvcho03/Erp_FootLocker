class Conexion {
    constructor() {
        this.usuarios = [];
        this.administradores = [];
        this.cargarDatos(); // Cargar datos al iniciar la clase
    }

    // Cargar datos desde el archivo JSON
    async cargarDatos() {
        try {
            const response = await fetch('../Json/BD.json');
            if (!response.ok) {
                throw new Error('No se cargó el archivo');
            }
            const data = await response.json();
            this.usuarios = data.TablaUsuario; // Cargar todos los usuarios
            this.administradores = data.TablaAdmin; // Cargar todos los administradores

        } catch (error) {
            console.error('Error al cargar los datos:', error);
        }
    }

    // Método para validar usuario y contraseña
    validarUsuario(usuario, contrasena) {
        const usuarioEncontrado = this.usuarios.find(u => u.nombre === usuario && u.contrasena === contrasena);
        return usuarioEncontrado ? true : false; // Retorna true si el usuario es válido
    }

    // Método para validar admin (puedes hacer algo similar)
    validarAdmin(admin, contrasena) {
        const adminEncontrado = this.administradores.find(a => a.nombre === admin && a.contrasena === contrasena);
        return adminEncontrado ? true : false; // Retorna true si el admin es válido
    }
}