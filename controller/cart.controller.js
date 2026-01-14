import Cart from '../models/cart.model.js';
import Product from '../models/product.model.js';
import Sale from '../models/sales.model.js';

// Obtener carrito
export const getCart = async (req, res) => {
    try {
        const userid = req.user._id;
        let cart = await Cart.findOne({ userid }).populate({
            path: 'products.productId',
            select: 'nombre precio'
        });

        if (!cart) {
            cart = await Cart.create({ userid, products: [], total: 0 });
        }
        res.json(cart);
    } catch (error) {
        console.log("Carrito inexistente");
        res.status(500).json({ error: error.message });
    }
};

// Total cart
const calculateTotal = async (cart) => {
    let total = 0;

    for (const item of cart.products) {
        const product = await Product.findById(item.productId).select('price');
        if (product) {
            total += product.price * item.quantity;
        }
    }
    cart.total = total;
};

// Agregar producto al carrito
export const addProductToCart = async (req, res) => {
    try {
        // Obtener el carrito del usuario y el producto a agregar
        const userid = req.user._id;
        const { productId } = req.body;

        let cart = await Cart.findOne({ userid });

        if (!cart) {
            cart = await Cart.create({ userid, products: [], total: 0 });
        }

        // Buscar el producto
        const item = cart.products.find(
            p => p.productId.toString() === productId
        );
        
        // Verificar si hay stock disponible
        const product = await Product.findById(productId);
        if (product.stock < 1 || item && item.quantity >= product.stock) {
            return res.status(400).json({ error: 'Stock insuficiente' });
        }

        // Si hay disponible, agregar o incrementar cantidad
        if (item) {
            item.quantity += 1;
        } else {
            cart.products.push({ productId, quantity: 1 });
        }

        //! Mejorar calculo del total
        await calculateTotal(cart);
        await cart.save();

        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Eliminar producto del carrito
export const removeProductFromCart = async (req, res) => {
    try {
        // Obtener el carrito del usuario y el producto a eliminar
        const userid = req.user._id;
        const { productId } = req.params;

        const cart = await Cart.findOne({ userid });

        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        // Filtrar el producto a eliminar
        cart.products = cart.products.filter(
            p => p.productId.toString() !== productId
        );

        //! Mejorar calculo del total
        await calculateTotal(cart);
        await cart.save();

        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Actualzar cantidad por input quantity
export const updateProductQuantity = async (req, res) => {
    try {
        // Obtener el carrito del usuario y el producto a actualizar y su cantidad
        const userid = req.user._id;
        const { productId } = req.params;
        const { quantity } = req.body;

        // Validar cantidad
        if (quantity < 0) {
            return res.status(400).json({ error: 'Cantidad inválida' });
        }

        const cart = await Cart.findOne({ userid });

        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        const item = cart.products.find(
            p => p.productId.toString() === productId
        );

        if (!item) {
            return res.status(404).json({ error: 'Producto no existe en el carrito' });
        }

        // Verificar stock disponible
        const product = await Product.findById(productId);
        if (product.stock < quantity) {
            return res.status(400).json({ error: 'Stock insuficiente' });
        }

        if (quantity === 0) {
            cart.products = cart.products.filter(
                p => p.productId.toString() !== productId
            );
        } else {
            item.quantity = quantity;
        }

        await calculateTotal(cart);
        await cart.save();

        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Limpiar carrito (Y mover a sales)
export const clearCart = async (req, res) => {
    try {
        const userid = req.user._id;
        const cart = await Cart.findOne({ userid });

        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        cart = await cart.populate({
            path: 'products.productId',
            select: 'nombre precio'
        });
        // Si existe el carrito pasarlo a sales
        if (cart.products.length != 0) {
            Sale.create({
                date: Date.now(),
                userid: userid,
                products: cart.products.map(item => ({
                    nombre: item.productId.nombre,
                    quantity: item.quantity,
                    price: item.productId.precio
                })),
                total: cart.total
            });
        }

        cart.products = [];
        cart.total = 0;

        await cart.save();

        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};