document.getElementById("btnAgregar").addEventListener("click", function() {
    // Lógica para agregar un producto
    alert("Producto agregado");
});

document.getElementById("btnEditar").addEventListener("click", function() {
    // Lógica para actualizar un producto
    alert("Producto actualizado");
});

document.getElementById("btnEliminar").addEventListener("click", function() {
    // Lógica para eliminar un producto
    alert("Producto eliminado");
});

async function cargarForm(modo) {
    const respuesta = await fetch(`/partials/formProducto?modo=${modo}`);
    const html = await respuesta.text();
    contenedorForm.innerHTML = html;
} 