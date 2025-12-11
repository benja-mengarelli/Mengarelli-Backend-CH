import { ReadData, WriteData } from './modulos/fileSystem.js';

const PRODUCT_PATH = './api/products.json';
const CART_PATH = './api/carts.json';

//! PRODUCTS

// Leer y obtener todos los productos
export async function getAllProducts() {
    console.log("Obteniendo todos los productos desde server.js");
    return await ReadData(PRODUCT_PATH);
}

// Obtener un producto por ID
export async function getProductById(id) {
    const productos = await ReadData(PRODUCT_PATH);
    // si coincide el id (convertido a string para evitar problemas de tipo)
    return productos.find(p => String(p.id) === String(id));
}

// Crear un nuevo producto
export async function createProduct(data) {
    const productos = await ReadData(PRODUCT_PATH);

    // almacenar nuevo producto
    const nuevo = {
        id: productos.length + 1,
        ...data
    };

    // pushearlo al array y escribir archivo
    productos.push(nuevo);
    await WriteData(PRODUCT_PATH, productos);
    return nuevo;
}

// Actualizar un producto existente
export async function updateProduct(id, data) {
    const productos = await ReadData(PRODUCT_PATH);
    // buscar índice del producto a actualizar
    const index = productos.findIndex(p => String(p.id) === String(id));

    // si no se encuentra, retornar null
    if (index === -1) return null;

    // actualizar datos y escribir archivo
    productos[index] = { id, ...data };
    await WriteData(PRODUCT_PATH, productos);
    return productos[index];
}

// Eliminar un producto
export async function deleteProduct(id) {
    const productos = await ReadData(PRODUCT_PATH);
    // buscar índice del producto a eliminar
    const index = productos.findIndex(p => String(p.id) === String(id));

    // si no se encuentra, retornar null
    if (index === -1) return null;

    // eliminar producto y escribir archivo
    productos.splice(index, 1);
    await WriteData(PRODUCT_PATH, productos);
    return true;
}

//! CARTS
// Crear un nuevo carrito
export async function createCart() {
    const carts = await ReadData(CART_PATH);

    // Ponerle fecha actual y un id único
    const nuevoCarrito = {
        id: Date.now().toString(36),
        products: []
    };

    // Agregar al array y escribir archivo
    carts.push(nuevoCarrito);
    await WriteData(CART_PATH, carts);
    return nuevoCarrito;
}

// buscar un carrito
export async function getCartById(cid) {
    const carts = await ReadData(CART_PATH);
    return carts.find(c => String(c.id) === String(cid));
}

// agregar un producto al carrito
export async function addProductToCart(cid, pid) {
    const carts = await ReadData(CART_PATH);
    const products = await ReadData(PRODUCT_PATH);

    const indexCarrito = carts.findIndex(c => String(c.id) === String(cid));
    if (indexCarrito === -1) return null;

    const prodExiste = products.find(p => String(p.id) === String(pid));
    if (!prodExiste) return false;

    const carrito = carts[indexCarrito];

    const indexProducto = carrito.products.findIndex(p => p.product == pid);

    if (indexProducto === -1) {
        carrito.products.push({ product: pid, quantity: 1 });
    } else {
        carrito.products[indexProducto].quantity++;
    }

    await WriteData(CART_PATH, carts);
    return carrito;
}