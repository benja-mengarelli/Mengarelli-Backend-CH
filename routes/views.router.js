import { Router } from "express";
import { getAllProducts } from "../server.js";

const router = Router();

//? RUTAS
router.get('/', (req, res) => {
    console.log("Entrando a home");

    if (!req.session.logueado) {
        console.log("No logueado, redirigiendo a login desede home");
        return res.redirect('/login');
    }
    console.log("Logueado, mostrando home desde get home");
    res.render('home', {
        layout: 'main',
        title: 'Bienvenido a la página principal',
        logueado: req.session.logueado,
        nombre: req.session.nombre,
        admin: req.session.admin
    });
});

// PRODUCTOS 
router.get("/productos", async (req, res) => {
    console.log("Entrando a productos");
    const productos = await getAllProducts();
    res.render("productos", {
        layout: "main",
        title: "Productos",
        productos,
        logueado: req.session.logueado,
        nombre: req.session.nombre,
        admin: req.session.admin
    });
});

// PANEL ADMIN 
router.get("/admin", (req, res) => {
    console.log("Entrando a admin panel");
    if (!req.session.logueado || !req.session.admin) {
        console.log("No autorizado, redirigiendo a home desde admin panel");
        return res.redirect('/');
    }
    console.log("Autorizado, mostrando admin panel");
    res.render("adminPanel", {
        layout: "main",
        title: "Panel de Administración"
    });
});


// LOGIN 
router.get("/login", (req, res) => {
    console.log("Entrando a login");
    if (req.session.logueado) {
        console.log("Ya logueado, redirigiendo a home desde login");
        return res.redirect('/');
    }
    res.render("login", {
        layout: "main",
        title: "Login"
    });
});
router.post('/login', (req, res) => {
    console.log("Procesando login");
    
    const { username, password } = req.body;

    if (username === "admin" && password === "1234") {
        req.session.nombre = username;
        req.session.admin = true;
        req.session.logueado = true;
        console.log("Login exitoso como admin");
        return res.redirect('/');
    }

    if (username.length > 0 && password.length > 0) {
        req.session.nombre = username;
        req.session.admin = false;
        req.session.logueado = true;
        console.log("Login exitoso como usuario regular");
        return res.redirect('/');
    }

    // Credenciales inválidas
    console.log("Credenciales inválidas");
    res.render('login', {layout: "main", error: "Usuario o contraseña inválidos" });
});

// LOGOUT
router.get('/logout', (req, res) => {
    console.log("Procesando logout");
    // Si hay un error volver al home
    req.session.destroy(err => {
        if (err) {
            console.log("Error al cerrar sesión:", err);
            return res.redirect('/');
        }
        res.redirect('/login');
    });
});

export default router;
