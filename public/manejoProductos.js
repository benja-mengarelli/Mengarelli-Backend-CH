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

async function cargarForm(modo) {
    const respuesta = await fetch(`/partials/formProducto/${modo}`);
    const html = await respuesta.text();
    contenedorForm.innerHTML = html;
} 