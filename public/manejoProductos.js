function mostrarToast(mensaje, tipo) {
    Toastify({
        text: mensaje,
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: tipo? "green" : "red",
    }).showToast();
}

const contenedorForm = document.getElementById("contenedorForm");

// Manejo de botones panel admin
document.getElementById("btnAgregar").addEventListener("click", () => {
    cargarForm("modoAgregar");
});

document.getElementById("btnEditar").addEventListener("click", () => {
    cargarForm("modoEditar");
});

document.getElementById("btnEliminar").addEventListener("click", () => {
    cargarForm("modoEliminar");
});

// Renderizado del formulario según el modo
async function cargarForm(modo) {
    contenedorForm.style.display = "flex";

    const respuesta = await fetch(`/partials/formProductmanager/${modo}`);
    const html = await respuesta.text();
    contenedorForm.innerHTML = html;

    contenedorForm.querySelector("form").addEventListener("submit", (e) => {
        e.preventDefault();

        if (e.target.id === "formAgregar") {
            agregarProducto(e);
            mostrarToast("Producto agregado con éxito", true);
        };

        if (e.target.id === "formEditar") {
            editarProducto(e);
            mostrarToast("Producto editado con éxito", true);
        };

        if (e.target.id === "formEliminar") {
            eliminarProducto(e);
            mostrarToast("Producto eliminado con éxito", false);
        }

        contenedorForm.style.display = "none";
        contenedorForm.innerHTML = "";
    });
};

async function agregarProducto(e) {
    const data = {
        title: e.target.nombre.value,
        price: e.target.precio.value
    };

    const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    console.log(await res.json());
}

async function editarProducto(e) {
    const pid = e.target.listaProductos.value;

    const data = {
        title: e.target.nombre.value,
        price: e.target.precio.value
    };

    const res = await fetch(`/api/admin/products/${pid}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    console.log(await res.json());
}

async function eliminarProducto(e) {
    const pid = e.target.listaProductos.value;

    const res = await fetch(`/api/admin/products/${pid}`, { method: "DELETE" });

    console.log(await res.json());
}
