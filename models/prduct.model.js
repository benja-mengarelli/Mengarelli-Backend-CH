import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    precio: { type: Number, required: true },
    categoria: { type: String, required: true },
    subcategoria: { type: String, default: 'varios', required: false },
    stock: { type: Number, default: 0, required: false },
    imagenUrl: { type: String, default: './images/img4.png', required: false }
});

export default mongoose.model('Product', productSchema);