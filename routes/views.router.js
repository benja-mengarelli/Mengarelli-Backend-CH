import { Router } from "express";
import { getAllProducts } from "../server.js";

const router = Router();

//? RUTAS
router.get('/', (req, res) => {
    res.render('home', {
        layout: 'main',
        title: 'Bienvenido a la página principal'
    });
});

// PRODUCTOS 
router.get("/productos", async (req, res) => {
    const productos = await getAllProducts();
    res.render("productos", {
        layout: "main",
        title: "Productos",
        productos
    });
});

// PANEL ADMIN 
router.get("/admin", (req, res) => {
    res.render("adminPanel", {
        layout: "admin",
        title: "Panel de Administración"
    });
});

// USUARIOS 
router.get("/usuarios", (req, res) => {
    res.render("usuarios", {
        layout: "usuarios",
        title: "Gestión de Usuarios"
    });
});

// LOGIN 
router.get("/login", (req, res) => {
    res.render("loginPage", {
        layout: "main",
        title: "Login"
    });
});

export default router;
