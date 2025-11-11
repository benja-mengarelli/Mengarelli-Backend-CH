import express from 'express';
import { leerArchivo, escribirArchivo } from './modulos/fileSystem';


const app = express();
const PORT = 8080;

app.use(express.json());

//? RUTAS
app.get('/', (req, res) => {
    res.send('Servidor Express ATR funcionando');
});


//? METODOS

//! Todos los productos
app.get('/api/products', (req, res) => {
    // Lógica para obtener productos
    const productos = leerArchivo('productos.json');
    res.json(productos);
});

//! Producto por ID
app.get("/api/products/:pid", async (req, res) => {
    const { pid } = req.params;

    // Se lee el archivo JSON que contiene los productos
    const productos = await leerArchivo("products.json");

    // Comprobar si existe (stringifear por las dudas)
    const producto = productos.find(p => String(p.id) === String(pid));

    //Si no existe, devolver error
    if (!producto) {
        return res.status(404).json({ error: "Producto no encontrado" });
    }

    //Si existe, devolver el producto
    res.json(producto);
});


//! Nuevo producto
app.post('/api/products', async (req, res) => {
    const productos = await leerArchivo('productos.json');
    const { body } = req.body;

    if (!body || Object.keys(body).length === 0) {
        return res.status(400).json({ error: 'Mal cargado el nuevo producto' });
    }

    const nuevoProducto = {
        id: productos.length + 1,
        ...body
    };

    productos.push(nuevoProducto);
    await escribirArchivo('productos.json', productos);
    res.status(201).json(nuevoProducto);
});

//! modificar producto
app.put('/api/products/:pid', async (req, res) => {
    // obtener parametro de la url y el body
    const { pid } = req.params;
    const { body } = req.body;
    const productos = await leerArchivo('productos.json');

    // Comprobar si el producto existe siempre stringifeando
    const index = productos.findIndex(p => String(p.id) === String(pid));

    // Si no existe, devolver error
    if (index === -1) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }

    // Si existe, actualizarlo
    const id = productos[index].id;
    productos[index] = { id, ...body };
    await escribirArchivo('productos.json', productos);
    res.status(202).json(productos[index]);
});

//! eliminar producto
app.delete('/api/products/:pid', async (req, res) => {
    // obtener parametro de la url
    const { pid } = req.params;
    const productos = await leerArchivo('productos.json');
    const index = productos.findIndex(p => String(p.id) === String(pid));

    // Si no existe, devolver error
    if (index === -1) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }
    // Si existe, eliminarlo. No sabia q existia splice y hardcodee al principio :(
    productos.splice(index, 1);
    await escribirArchivo('productos.json', productos);
    res.status(200).json({ message: 'Producto eliminado' });
});

//? Metodos para api/carts

//! Crear carrito
app.post('/api/carts', async (req, res) => {
    const carts = await leerArchivo('carts.json');

    // Products vacio (asumo que asi era) id unico = fecha
    const nuevoCarrito = {
        id: Date.now().toString(36), // autogenerado, único
        products: []
    };

    // Empujar el carrito :P (push)
    carts.push(nuevoCarrito);
    await escribirArchivo('carts.json', carts);
    res.status(201).json(nuevoCarrito);
});

//! Obtener carrito por ID
app.get('/api/carts/:cid', async (req, res) => {
    const { cid } = req.params;
    const carts = await leerArchivo('carts.json');
    const carrito = carts.find(c => String(c.id) === String(cid));

    // Si no existe, devolver error
    if (!carrito) {
        return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    // mostrar carrito
    res.json(carrito.products);
});

//! Agregar producto al carrito
app.post('/api/carts/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const carts = await leerArchivo('carts.json');
    const products = await leerArchivo('productos.json');
    const carritoIndex = carts.findIndex(c => String(c.id) === String(cid));

    // Si no existe el carrito, devolver error
    if (carritoIndex === -1) {
        return res.status(404).json({ error: 'Carrito no encontrado' });
    }
    const producto = products.find(p => String(p.id) === String(pid));
    if (!producto) {
        const nuevoProducto = {
            product : pid,
            quantity: 1
        };
        carts[carritoIndex].products.push(nuevoProducto);
    }
    else {
        //Si existe, aumentar cantidad
        const productoIndex = carts[carritoIndex].products.findIndex(p => String(p.product) === String(pid));
        carts[carritoIndex].products[productoIndex].quantity += 1;
    }
    await escribirArchivo('carts.json', carts);
    res.status(200).json(carts[carritoIndex]);
});


//! INICIAR SERVIDOR
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));