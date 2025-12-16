const contenedorForm = document.getElementById("contenedorForm");

// Manejo de botones panel admin
document.getElementById("btnAgregar").addEventListener("click", () => {
    cargarForm("modoAgregar");
    alert("Producto agregado");
});

document.getElementById("btnEditar").addEventListener("click", () => {
    cargarForm("modoEditar");
    // Lógica para actualizar un producto
    alert("Producto actualizado");
});

document.getElementById("btnEliminar").addEventListener("click", () => {
    cargarForm("modoEliminar");
    // Lógica para eliminar un producto
    alert("Producto eliminado");
});

// Renderizado del formulario según el modo
async function cargarForm(modo) {

    if (contenedorForm.style.display === "none" || contenedorForm.style.display === "") {
        contenedorForm.style.display = "flex";
    } else {
        contenedorForm.style.display = "none";
        contenedorForm.innerHTML = "";
    }

    const respuesta = await fetch(`/partials/formProductmanager/${modo}`);
    const html = await respuesta.text();
    contenedorForm.innerHTML = html;
}


// Manejo de envíos de formularios
document.addEventListener("submit", async (e) => {
    e.preventDefault();

    // AGREGAR
    if (e.target.id === "formAgregar") {
        const data = {
            title: e.target.nombre.value,
            price: e.target.precio.value
        };

        const res = await fetch("/admin/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        console.log(await res.json());
    }

    // EDITAR
    if (e.target.id === "formEditar") {
        const pid = e.target.listaProductos.value;

        const data = {
            title: e.target.nombre.value,
            price: e.target.precio.value
        };

        const res = await fetch(`/admin/products/${pid}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        console.log(await res.json());
    }

    // ELIMINAR
    if (e.target.id === "formEliminar") {
        const pid = e.target.listaProductos.value;

        const res = await fetch(`/admin/products/${pid}`, {
            method: "DELETE"
        });

        console.log(await res.json());
    }
});