/* import { emitProductUpdate } from '../socket.js'; */

function mostrarToast(mensaje, tipo) {
    Toastify({
        text: mensaje,
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: tipo ? "green" : "red",
    }).showToast();
}

document.addEventListener("DOMContentLoaded", () => {
    console.log("✅ manejoProductos.js cargado");
    
    const imageByCategory = {
        Electronica: './images/img4.png',
        Ropa: './images/img5.png',
        Hogar: './images/img4.png'
    };
    
    const contenedorForm = document.getElementById("contenedorForm");
    const btnAgregar = document.getElementById("btnAgregar");
    const btnEditar = document.getElementById("btnEditar");
    const btnEliminar = document.getElementById("btnEliminar");
    
    // Solo agregar listeners si los botones existen
    if (!btnAgregar || !btnEditar || !btnEliminar) {
        console.warn("⚠️ Botones no encontrados. Este script es solo para la página de admin.");
        return;
    }
    
    console.log("✅ Botones encontrados, inicializando...");
    
    // Manejo de botones panel admin
    btnAgregar.addEventListener("click", () => {
        console.log("Click en Agregar");
        cargarForm("modoAgregar");
    });  
    btnEditar.addEventListener("click", () => {
        console.log("Click en Editar");
        cargarForm("modoEditar");
    });
    btnEliminar.addEventListener("click", () => {
        console.log("Click en Eliminar");
        cargarForm("modoEliminar");
    });
    
    // Renderizado del formulario según el modo
    async function cargarForm(modo) {
        console.log("📝 Cargando formulario:", modo);
        contenedorForm.style.display = "flex";
    
        const respuesta = await fetch(`/partials/formProductmanager/${modo}`);
        const html = await respuesta.text();
        contenedorForm.innerHTML = html;
        
        console.log("✅ Formulario renderizado");
        
        // Agregar listener al cambio de categoría DESPUÉS de renderizar el form
        const categorySelect = contenedorForm.querySelector('select[name="Categoria"]');
        const imageInput = contenedorForm.querySelector('input[name="image"]');
        
        if (categorySelect && imageInput) {
            console.log("✅ Listeners de categoría agregados");
            categorySelect.addEventListener('change', (e) => {
                console.log("📸 Categoría seleccionada:", e.target.value);
                const imageUrl = imageByCategory[e.target.value] || './images/img4.png';
                imageInput.value = imageUrl;
                console.log("✅ Imagen asignada:", imageUrl);
            });
        } else {
            console.warn("⚠️ Categoría o imagen input no encontrados");
        }
    
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
            /* emitProductUpdate(); */ // Notificar cambios via socket
            contenedorForm.style.display = "none";
            contenedorForm.innerHTML = "";
        });
    };
    
    // Funciones de API
    async function agregarProducto(e) {
        console.log("➕ Agregando producto...");
        const data = {
            nombre: e.target.nombre.value,
            precio: parseFloat(e.target.precio.value),
            categoria: e.target.Categoria.value,
            subcategoria: e.target.Subcategoria.value,
            stock: parseInt(e.target.stock.value) || 0,
            imagenUrl: e.target.image.value || './images/img4.png'
        };
    
        console.log("📤 Data a enviar:", data);
        const res = await fetch("/api/admin/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
    
        const result = await res.json();
        if (!res.ok) {
            mostrarToast("Error al agregar producto", false);
            console.error("❌ Error:", result);
        } else {
            console.log("✅ Producto agregado:", result);
        }
    }
    
    async function editarProducto(e) {
        const pid = e.target.listaProductos.value;
        console.log("✏️ Editando producto:", pid);
    
        const data = {
            nombre: e.target.nombre.value,
            precio: parseFloat(e.target.precio.value),
            stock: parseInt(e.target.stock.value) || 0,
        };
    
        console.log("📤 Data a enviar:", data);
        const res = await fetch(`/api/admin/products/${pid}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
    
        const result = await res.json();
        if (!res.ok) {
            mostrarToast("Error al editar producto", false);
            console.error("❌ Error:", result);
        } else {
            console.log("✅ Producto editado:", result);
        }
    }
    
    async function eliminarProducto(e) {
        const pid = e.target.listaProductos.value;
        console.log("🗑️ Eliminando producto:", pid);
    
        const res = await fetch(`/api/admin/products/${pid}`, { method: "DELETE" });
    
        const result = await res.json();
        if (!res.ok) {
            mostrarToast("Error al eliminar producto", false);
            console.error("❌ Error:", result);
        } else {
            console.log("✅ Producto eliminado");
        }
    }
});
