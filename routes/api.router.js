import { Router } from "express";
import { emitProductUpdate } from '../socket.js';
import {
    getProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    getProductById,
    getProductsByCategory,
    getProductsBySubcategory,
    searchProductsByName
} from '../controller/product.controller.js';
import {
    getCart,
    addProductToCart,
    removeProductFromCart,
    updateProductQuantity,
    clearCart
} from '../controller/cart.controller.js';
import {
    showAllSales,
    showUserSales,
    getSaleByIdAndUpdate
} from '../controller/sales.controller.js';
import { get } from "mongoose";

const router = Router();

//! PRODUCTOS
router.get("/products", getProducts); // Obtener todos los productos
router.get("/products/:pid", getProductById); // Obtener producto por ID
router.get("/products/category/:category", getProductsByCategory); // Obtener productos por categoría
router.get("/products/subcategory/:subcategory", getProductsBySubcategory); // Obtener productos por subcategoría
router.get("/products/search/:name", searchProductsByName); // Buscar productos por nombre

router.post("/products", addProduct); //! CAMBIAR A FUTURO, PERMITE A USER CREAR PRODUCTOS
router.put("/products/:pid", updateProduct); //! ACTUALIZAR PRODUCTO (modificar permiso por si user puede o no modificar productos)
router.delete("/products/:pid", deleteProduct); //! Cambiar a futuro, permite a user eliminar productos -- Cambiar por solo actualizar estado de producto

//! MANEJO ADMIN PRODUCT MANAGER
// Rutas similares pero bajo el prefijo /admin
// obtener productos, agregar, actualizar, eliminar
router.get("/admin/products", getProducts);
router.post("/admin/products", addProduct);
router.patch("/admin/products/:pid", updateProduct);
router.delete("/admin/products/:pid", deleteProduct);

//! CARRITOS
router.get("/carts/:cid", getCart); // Crear un nuevo carrito o obtener el existente
router.post("/carts/:cid/product/:pid", addProductToCart); // Agregar producto al carrito
router.patch("/carts/:cid/product/:pid", removeProductFromCart); // Eliminar producto del carrito
router.delete("/carts/clear", clearCart); // Limpiar carrito
router.put("/carts/product", updateProductQuantity); // Actualizar cantidad de un producto en el carrito

//! Rutas de ventas
router.get("/sales", showAllSales); // Mostrar todas las ventas (solo admin)
router.get("/sales/user", showUserSales); // Mostrar ventas del usuario autenticado
router.put("/sales/:sid", getSaleByIdAndUpdate); // Manipular una venta específica por ID

export default router;