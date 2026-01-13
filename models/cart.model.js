import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    date: { type: Date, default: Date.now },
    userid: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    products: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
            quantity: { type: Number, default: 1, required: true }
        }
    ],
    total: { type: Number, default: 0 }
});

export default mongoose.model('Cart', cartSchema);