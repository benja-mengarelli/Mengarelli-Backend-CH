import Sale from '../models/sales.model.js';
import Cart from '../models/cart.model.js';
import Product from '../models/product.model.js';

// Mostrar todas las ventas (solo admin)
export const showAllSales = async (req, res) => {
    try {
        const userid = req.user._id;
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Acceso denegado' });
        }
        const sales = await Sale.find().populate('userid', 'username');
        
        res.json(sales);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Mostrar ventas de un usuario específico
export const showUserSales = async (req, res) => {
    try {
        const userid = req.user._id;
        const sales = await Sale.find({ userid }).populate('userid', 'username');
        res.json(sales);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Manipular una venta específica por ID
export const getSaleByIdAndUpdate = async (req, res) => {
    try {
        const saleId = req.params.sid;
        const updatedData = req.body;
        const sale = await Sale.findById(saleId).populate('userid', 'username');
        if (!sale) {
            return res.status(404).json({ error: 'Venta no encontrada' });
        }
        // Verificar si la venta es del usuario o si es admin
        if (sale.userid._id.toString() !== req.user._id.toString() || req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Acceso denegado' });
        }

        const updatedProduct = await Sale.findByIdAndUpdate(
            saleId,
            updatedData,
            { new: true }
        );
        if (!updatedProduct) {
            return res.status(404).json({ error: 'Venta no encontrada' });
        }
        res.json(updatedProduct);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
