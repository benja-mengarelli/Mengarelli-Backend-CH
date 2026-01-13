import Product from '../models/Product.js';

// Obtener productos
export const getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch{
        res.status(500).json({ error: 'Error al obtener los productos' });
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
        res.status(500).json({ error: 'Error al agregar el producto' });
    } 
};

// Actualizar producto
export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, precio, categoria, subcategoria, stock, imagenUrl } = req.body;
        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            { nombre, precio, categoria, subcategoria, stock, imagenUrl },
            { new: true }
        );
        if (!updatedProduct) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json(updatedProduct);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el producto' });
    }
};

// Eliminar producto
export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json({ message: 'Producto eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
};

// Obtener producto por ID
export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
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
        const products = await Product.find({ categoria: category });
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los productos por categoría' });
    }
};

// Obtener productos por subcategoría
export const getProductsBySubcategory = async (req, res) => {
    try {
        const { subcategory } = req.params;
        const products = await Product.find({ subcategoria: subcategory });
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los productos por subcategoría' });
    }
};

// Buscar productos por nombre
export const searchProductsByName = async (req, res) => {
    try {
        const { name } = req.params;
        const products = await Product.find({ nombre: { $regex: name, $options: 'i' } });
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Error al buscar productos por nombre' });
    }
};

