import { Router } from "express";
import { getAllProducts, paginateProducts } from "../controller/product.controller.js";

const router = Router();

// ? Middleware para autenticación
const requireAuth = (req, res, next) => {
    if (!req.session.logueado) {
        return res.redirect('/login');
    }
    next();
};
const requireAdmin = (req, res, next) => {
    if (!req.session.logueado || !req.session.admin) {
        return res.redirect('/');
    }
    next();
};
//? Helper para sesión
const getSessionData = (req) => ({
    logueado: req.session.logueado,
    nombre: req.session.nombre,
    admin: req.session.admin
});

//? RUTAS
router.get('/', requireAuth, async (req, res) => {
    try {
        const productos = await getAllProducts();
        res.render('home', {
            layout: 'main',
            title: 'Bienvenido a la página principal',
            productos,
            ...getSessionData(req)
        });
    } catch (error) {
        console.error('Error en home:', error);
        res.status(500).render('error', { 
            layout: 'main', 
            error: 'Error al cargar la página principal' 
        });
    }
});

// PRODUCTOS 
router.get("/productos", requireAuth, async (req, res) => {
    try {
        const productos = await getAllProducts();
        res.render("productos", {
            layout: "main",
            title: "Productos",
            productos,
            ...getSessionData(req)
        });
    } catch (error) {
        console.error('Error en productos:', error);
        res.status(500).render('error', { 
            layout: 'main', 
            error: 'Error al cargar los productos' 
        });
    }
});

// PANEL ADMIN 
router.get("/admin", requireAdmin, async (req, res) => {
    try {
        const productos = await getAllProducts();
        res.render("realTimeProducts", {
            layout: "main",
            title: "Panel de Administración",
            productos,
            ...getSessionData(req)
        });
    } catch (error) {
        console.error('Error en admin panel:', error);
        res.status(500).render('error', { 
            layout: 'main', 
            error: 'Error al cargar el panel de administración' 
        });
    }
});

router.get('/partials/formProductmanager/:modo', requireAdmin, async (req, res) => {
    try {
        const modo = req.params.modo;
        const productos = await getAllProducts();

        res.render('partials/formProductmanager', {
            layout: false,
            modoAgregar: modo === "modoAgregar",
            modoEditar: modo === "modoEditar",
            modoEliminar: modo === "modoEliminar",
            productos
        });
    } catch (error) {
        console.error('Error en formProductmanager:', error);
        res.status(500).json({ error: 'Error al cargar el formulario' });
    }
});


// LOGIN 
router.get("/login", (req, res) => {
    if (req.session.logueado) {
        return res.redirect('/');
    }
    res.render("login", {
        layout: "main",
        title: "Login"
    });
});

router.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Validar credenciales (delegado a controlador en el futuro)
    if (username === "admin" && password === "1234") {
        req.session.nombre = username;
        req.session.admin = true;
        req.session.logueado = true;
        return res.redirect('/');
    }

    if (username.length > 0 && password.length > 0) {
        req.session.nombre = username;
        req.session.admin = false;
        req.session.logueado = true;
        return res.redirect('/');
    }

    // Credenciales inválidas
    res.render('login', {
        layout: "main",
        error: "Usuario o contraseña inválidos" 
    });
});

// LOGOUT
router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error("Error al cerrar sesión:", err);
            return res.redirect('/');
        }
        res.redirect('/login');
    });
});

export default router;
