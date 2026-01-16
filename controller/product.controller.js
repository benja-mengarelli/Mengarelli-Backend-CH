import { create } from 'express-handlebars';
import Product from '../models/product.model.js';

// Función auxiliar para obtener productos (sin req/res)
export const getAllProducts = async () => {
    try {
        const products = await Product.find().lean();
        return products;
    } catch (error) {
        console.error('Error en getAllProducts:', error.message);
        throw error;
    }
};

// Obtener productos (para API REST)
export const getProducts = async (req, res) => {
    try {
        const products = await Product.find().lean();
        res.json(products);
    } catch (error) {
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

        const updates = {};
        const allowedFields = [
            'nombre',
            'precio',
            'categoria',
            'subcategoria',
            'stock',
            'imagenUrl'
        ];

        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        }

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                error: 'No se enviaron campos para actualizar'
            });
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            pid,
            { $set: updates },
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        res.json(updatedProduct);
    } catch (error) {
        console.error('Error en updateProduct:', error);
        res.status(500).json({
            error: 'Error al actualizar el producto',
            details: error.message
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
        res.status(500).json({
            error: 'Error al eliminar el producto', details: error.message
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

//Paginacion de productos
export const paginateProducts = async (req, res) => {
    try {
        // establecer valores de paginacion (o los ya definidos)
        // valores por defecto para paginación y ordenamiento
        const {
            categoria,
            subcategoria,
            limit = 10,
            page = 1,
            search,
        } = req.query;

        const { sort } = req.query // 'precioAsc' | 'precioDesc' | 'nombreAsc' | 'nombreDesc' | Default
        let sortOption = {};  //! Cambiar let a const y usar un objeto para mapear las opciones de ordenamiento
        switch (sort) {
            case 'precioAsc':
                sortOption = { precio: 1 };
                break;
            case 'precioDesc':
                sortOption = { precio: -1 };
                break;
            case "nombreAsc":
                sortOption = { nombre: 1 };
                break;
            case "nombreDesc":
                sortOption = { nombre: -1 };
                break;
            default:
                sortOption = { createdAt: -1 }; // Ordenar por fecha de creación descendente por defecto
        }

        // convertir a number limit y page
        const limitNum = parseInt(limit) > 0 ? parseInt(limit) : 10;
        const pageNum = parseInt(page) > 0 ? parseInt(page) : 1;

        // construir filtros
        const filters = {};
        if (categoria) filters.categoria = categoria;
        if (subcategoria) filters.subcategoria = subcategoria;
        if (search) filters.nombre = { $regex: search, $options: 'i' };

        // verificar cantidad de productos para page
        const totalProducts = await Product.countDocuments(filters);
        const totalPages = Math.ceil(totalProducts / limitNum);

        // verificar que la pagina solicitada no exceda el total de paginas
        if (pageNum > totalPages && totalPages !== 0) {
            return res.status(400).json({ error: 'La página solicitada excede el total de páginas disponibles' });
        }

        // construir has nextpage y hasprevpage
        const hasNextPage = pageNum < totalPages;
        const hasPrevPage = pageNum > 1;

        // Hacer la paginacion con o sin filtros
        const products = await Product.find(filters)
            .sort(sortOption)
            .skip((pageNum - 1) * limitNum)
            .limit(limitNum)
            .lean();
        res.json({
            products,
            pageNum,
            limitNum,
            sort,
            totalProducts,
            totalPages,
            hasNextPage,
            hasPrevPage
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al paginar los productos' });
    }
};
