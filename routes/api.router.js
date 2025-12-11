import { Router } from "express";
import {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    createCart,
    getCartById,
    addProductToCart
} from '../server.js';

const router = Router();

//? RUTAS
//! PRODUCTOS

router.get("/products", async (req, res) => {
    res.json(await getAllProducts());
});

router.get("/products/:pid", async (req, res) => {
    const prod = await getProductById(req.params.pid);
    if (!prod) return res.status(404).json({ error: "No encontrado" });
    res.json(prod);
});

router.post("/products", async (req, res) => {
    const creado = await createProduct(req.body);
    res.status(201).json(creado);
});

router.put("/products/:pid", async (req, res) => {
    const actualizado = await updateProduct(req.params.pid, req.body);
    if (!actualizado) return res.status(404).json({ error: "No encontrado" });
    res.json(actualizado);
});

router.delete("/products/:pid", async (req, res) => {
    const ok = await deleteProduct(req.params.pid);
    if (!ok) return res.status(404).json({ error: "No encontrado" });
    res.json({ message: "Eliminado" });
});


//! MANEJO ADMIN PRODUCT MANAGER
// Rutas similares pero bajo el prefijo /admin
// obtener productos, agregar, actualizar, eliminar
router.get("/admin/products", async (req, res) => {
    res.json(await getAllProducts());
});
router.post("/admin/products", async (req, res) => {
    const creado = await createProduct(req.body);
    res.status(201).json(creado);
});
router.put("/admin/products/:pid", async (req, res) => {
    const actualizado = await updateProduct(req.params.pid, req.body);
    if (!actualizado) return res.status(404).json({ error: "No encontrado" });
    res.json(actualizado);
});
router.delete("/admin/products/:pid", async (req, res) => {
    const ok = await deleteProduct(req.params.pid);
    if (!ok) return res.status(404).json({ error: "No encontrado" });
    res.json({ message: "Eliminado" });
});



//! CARRITOS

router.post("/carts", async (req, res) => {
    res.status(201).json(await createCart());
});

router.get("/carts/:cid", async (req, res) => {
    const cart = await getCartById(req.params.cid);
    if (!cart) return res.status(404).json({ error: "No encontrado" });
    res.json(cart.products);
});

router.post("/carts/:cid/product/:pid", async (req, res) => {
    const updated = await addProductToCart(req.params.cid, req.params.pid);

    if (updated === null)
        return res.status(404).json({ error: "Carrito no encontrado" });

    if (updated === false)
        return res.status(404).json({ error: "Producto no encontrado" });

    res.json(updated);
});

export default router;