document.addEventListener("DOMContentLoaded", function () {
    const nav = document.querySelector("#nav");
    const abrir = document.querySelector("#abrir");
    const cerrar = document.querySelector("#cerrar");

    // Abrir el menú
    abrir.addEventListener("click", (event) => {
        event.stopPropagation();
        nav.style.visibility = "visible";
        nav.style.opacity = "1";
        nav.style.transform = "translateX(0%)";
    });

    // Cerrar el menú
    cerrar.addEventListener("click", (event) => {
        event.stopPropagation();
        nav.style.transform = "translateX(-100%)";
        setTimeout(() => {
            nav.style.visibility = "hidden";
            nav.style.opacity = "0";
        }, 300);
    });

    // Cerrar el menú si se hace clic fuera de él
    document.addEventListener("click", (event) => {
        if (!nav.contains(event.target) && nav.style.visibility === "visible") {
            nav.style.transform = "translateX(-100%)";
            setTimeout(() => {
                nav.style.visibility = "hidden";
                nav.style.opacity = "0";
            }, 300);
        }
    });

    // Evitar que clics dentro del menú cierren el menú
    nav.addEventListener("click", (event) => {
        event.stopPropagation();
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const nav = document.querySelector("#nav");
    const abrir = document.querySelector("#abrir");
    const cerrar = document.querySelector("#cerrar");

    // Abrir el menú
    abrir.addEventListener("click", (event) => {
        event.stopPropagation();
        nav.style.visibility = "visible";
        nav.style.opacity = "1";
        nav.style.transform = "translateX(0%)";
    });

    // Cerrar el menú
    cerrar.addEventListener("click", (event) => {
        event.stopPropagation();
        nav.style.transform = "translateX(-100%)";
        setTimeout(() => {
            nav.style.visibility = "hidden";
            nav.style.opacity = "0";
        }, 300);
    });

    // Cerrar el menú si se hace clic fuera de él
    document.addEventListener("click", (event) => {
        if (!nav.contains(event.target) && nav.style.visibility === "visible") {
            nav.style.transform = "translateX(-100%)";
            setTimeout(() => {
                nav.style.visibility = "hidden";
                nav.style.opacity = "0";
            }, 300);
        }
    });

    // Evitar que clics dentro del menú cierren el menú
    nav.addEventListener("click", (event) => {
        event.stopPropagation();
    });
});