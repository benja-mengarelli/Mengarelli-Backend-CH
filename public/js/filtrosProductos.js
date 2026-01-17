document.addEventListener("DOMContentLoaded", () => {
    console.log("✅ filtrosProductos.js cargado");

    // Get all DOM elements
    const categoriaFiltro = document.getElementById("categoriaFiltro");
    const subcategoriaFiltro = document.getElementById("subcategoriaFiltro");
    const ordenamientoFiltro = document.getElementById("ordenamientoFiltro");
    const searchFiltro = document.getElementById("searchFiltro");
    const aplicarFiltros = document.getElementById("aplicarFiltros");
    const visualizadorProductos = document.getElementById("visualizadorProductos");
    const productList = visualizadorProductos.querySelector("ul");

    // Pagination state
    let currentPage = 1;
    const limit = 10;

    // Fetch products from backend API with filters
    async function fetchFilteredProducts(page = 1) {
        const categoria = categoriaFiltro.value === "Todas" ? "" : categoriaFiltro.value;
        const subcategoria = subcategoriaFiltro.value === "Todas" ? "" : subcategoriaFiltro.value;
        const sort = ordenamientoFiltro.value === "none" ? "" : ordenamientoFiltro.value;
        const search = searchFiltro.value;

        // Build query string
        const params = new URLSearchParams({
            ...(categoria && { categoria }),
            ...(subcategoria && { subcategoria }),
            ...(sort && { sort }),
            ...(search && { search }),
            limit,
            page
        });

        console.log("🔍 Aplicando filtros:", {
            categoria: categoria || "Todas",
            subcategoria: subcategoria || "Todas",
            sort: sort || "ninguno",
            search,
            page
        });

        try {
            const response = await fetch(`/api/products?${params.toString()}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Error al filtrar productos");
            }

            console.log("📦 Productos recibidos:", data.products.length, "de", data.totalProducts);
            renderProducts(data.products);
            updatePaginationInfo(data);

        } catch (error) {
            console.error("❌ Error al obtener productos:", error);
            productList.innerHTML = "<li><p>Error al cargar los productos</p></li>";
        }
    }

    // Render products in DOM
    function renderProducts(products) {
        productList.innerHTML = "";

        if (products.length === 0) {
            productList.innerHTML = "<li><p>No se encontraron productos</p></li>";
            console.log("❌ No se encontraron productos");
            return;
        }

        products.forEach((product) => {
            const li = document.createElement("li");
            li.innerHTML = `
                <img src="${product.imagenUrl}" alt="${product.nombre}">
                <strong>${product.nombre}</strong>
                <div class="comprarProducto">
                    $${product.precio}
                    <button>Comprar</button>
                </div>
            `;
            productList.appendChild(li);
        });

        console.log("✅ Mostrando", products.length, "productos");
    }

    // Update pagination info
    function updatePaginationInfo(data) {
        console.log(`📄 Página ${data.pageNum} de ${data.totalPages} (${data.totalProducts} productos totales)`);
        // You can add pagination buttons here if needed
        currentPage = data.pageNum;
    }

    // Live search - filter as you type with debounce
    let searchTimeout;
    searchFiltro.addEventListener("input", () => {
        clearTimeout(searchTimeout);
        console.log("🔤 Búsqueda en tiempo real:", searchFiltro.value);
        searchTimeout = setTimeout(() => {
            currentPage = 1;
            fetchFilteredProducts(1);
        }, 300); // Wait 300ms before searching
    });

    // Category filter change
    categoriaFiltro.addEventListener("change", () => {
        console.log("📂 Categoría seleccionada:", categoriaFiltro.value);
        currentPage = 1;
        fetchFilteredProducts(1);
    });

    // Subcategory filter change
    subcategoriaFiltro.addEventListener("change", () => {
        console.log("📂 Subcategoría seleccionada:", subcategoriaFiltro.value);
        currentPage = 1;
        fetchFilteredProducts(1);
    });

    // Sort filter change
    ordenamientoFiltro.addEventListener("change", () => {
        console.log("📊 Ordenamiento seleccionado:", ordenamientoFiltro.value);
        currentPage = 1;
        fetchFilteredProducts(1);
    });

    // Apply filters button
    aplicarFiltros.addEventListener("click", (e) => {
        e.preventDefault();
        console.log("🎯 Botón Aplicar Filtros presionado");
        currentPage = 1;
        fetchFilteredProducts(1);
    });

    console.log("✅ Sistema de filtros inicializado");
});
