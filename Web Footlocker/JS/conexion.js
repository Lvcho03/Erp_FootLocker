class Conexion {
    UserNombre;
    Usercontrasena;
    AdminNombre;
    Admincontrasena;

    constructor(un, uc, an, ac) {
        this.UserNombre = un;
        this.Usercontrasena = uc;
        this.AdminNombre = an;
        this.Admincontrasena = ac;

        this.cargarDatos(); // Llama a cargarDatos() después de inicializar propiedades
    }

    // Buscar datos en Json
    async cargarDatos() {
        try {
            const response = await fetch('Json/BD.json');
            if (!response.ok) {
                throw new Error('No se cargó el archivo');
            }
            const data = await response.json();

            const TablaAdmin = data.TablaAdmin;
            this.AdminNombre = TablaAdmin[0].nombre;
            this.Admincontrasena = TablaAdmin[0].contrasena;

            const TablaUsuario = data.TablaUsuario;
            this.UserNombre = TablaUsuario[0].nombre;
            this.Usercontrasena = TablaUsuario[0].contrasena;
        } catch (error) {
            console.error('Error al cargar los datos:', error);
        }
    }
}
