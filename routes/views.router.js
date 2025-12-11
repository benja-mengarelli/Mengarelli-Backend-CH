import { Router } from "express";
import { getAllProducts } from "../server.js";

const router = Router();

//? RUTAS
router.get('/', (req, res) => {
    if (!req.session.logueado) {
        return res.redirect('/login');
    }
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
    if (!req.session.logueado) {
        return res.redirect('/login');
    }
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
    res.render("login", {
        layout: "main",
        title: "Login"
    });
});
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (username === "admin" && password === "1234") {
        req.session.nombre = username;
        req.session.logueado = true;
        return res.redirect('/admin');
    }

    else if (username === "user" && password === "abcd") {
        req.session.nombre = username;
        req.session.logueado = true;
        return res.redirect('/');
    }
    // Credenciales inválidas
    console.log("Credenciales inválidas");
    res.render('login', { error: "Usuario o contraseña inválidos" });
});
export default router;
