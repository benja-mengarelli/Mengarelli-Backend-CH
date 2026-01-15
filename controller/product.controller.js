import Product from '../models/product.model.js';

// Función auxiliar para obtener productos (sin req/res)
export const getAllProducts = async () => {
    try {
        const products = await Product.find().lean();
        return products;
    } catch(error){
        console.error('Error en getAllProducts:', error.message);
        throw error;
    }
};

// Obtener productos (para API REST)
export const getProducts = async (req, res) => {
    try {
        const products = await Product.find().lean();
        res.json(products);
    } catch(error){
        console.error('Error en getProducts:', error.message);
        res.status(500).json({ error: 'Error al obtener los productos', details: error.message });
    }
};

// Agregar nuevo producto
export const addProduct = async (req, res) => {
    try {
        const { nombre, precio, categoria, subcategoria, stock, imagenUrl } = req.body;
        const newProduct = new Product({
            nombre,
            precio,
            categoria,
            subcategoria,
            stock,
            imagenUrl
        });
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        console.error('Error en addProduct:', error.message);
        res.status(500).json({ error: 'Error al agregar el producto', details: error.message });
    } 
};

// Actualizar producto
export const updateProduct = async (req, res) => {
    try {
        const { pid } = req.params;
        const { nombre, precio, categoria, subcategoria, stock, imagenUrl } = req.body;
        const updatedProduct = await Product.findByIdAndUpdate(
            pid,
            { $set: req.body },
            { new: true }
        );
        if (!updatedProduct) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json(updatedProduct);
    } catch (error) {
        console.error('Error en updateProduct:', error.message);
        res.status(500).json({ error: 'Error al actualizar el producto', details: error.message
        });
    }
};

// Eliminar producto
export const deleteProduct = async (req, res) => {
    try {
        const { pid } = req.params;
        const deletedProduct = await Product.findByIdAndDelete(pid);
        if (!deletedProduct) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json({ message: 'Producto eliminado correctamente' });
    } catch (error) {
        console.error('Error en deleteProduct:', error.message);
        res.status(500).json({ error: 'Error al eliminar el producto', details: error.message
        });
    }
};

// Obtener producto por ID
export const getProductById = async (req, res) => {
    try {
        const { pid } = req.params;
        const product = await Product.findById(pid).lean();
        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el producto' });
    }
};

// Obtener productos por categoría
export const getProductsByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const products = await Product.find({ categoria: category }).lean();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los productos por categoría' });
    }
};

// Obtener productos por subcategoría
export const getProductsBySubcategory = async (req, res) => {
    try {
        const { subcategory } = req.params;
        const products = await Product.find({ subcategoria: subcategory }).lean();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los productos por subcategoría' });
    }
};

// Buscar productos por nombre
export const searchProductsByName = async (req, res) => {
    try {
        const { name } = req.params;
        const products = await Product.find({ nombre: { $regex: name, $options: 'i' } }).lean();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Error al buscar productos por nombre' });
    }
};

