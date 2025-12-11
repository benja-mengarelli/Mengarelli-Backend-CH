import express from 'express';
import handlebars from 'express-handlebars';
import viewsRouter from './routes/views.router.js';
import apiRouter from './routes/api.router.js';
// para manejo de sesiones
import session from 'express-session';

const app = express();
// al subir a producción, usar el puerto definido en las variables de entorno
const PORT = process.env.PORT || 3000;

// Configuración de Handlebars
app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

// Middleware para parsear JSON y datos de formularios / middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Configuración de sesiones
app.use(session({
    secret: 'mi_secreto_de_sesion',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 180000 } // sesión válida por 3 minutos
}));

// Rutas
app.use('/api', apiRouter);
app.use('/', viewsRouter);


// inicia el servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto http://localhost:${PORT}`);
});