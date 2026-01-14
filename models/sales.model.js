import mongoose from 'mongoose';

const salesSchema = new mongoose.Schema({
    date: { type: Date, default: Date.now },
    userid: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    products: [
        {
            nombre: { type: String, required: true },
            quantity: { type: Number, default: 1, required: true },
            price: { type: Number, required: true }
        }],
    modifications: [
        {
            description: { type: String, default: '', required: false},
        }
    ],
    total: { type: Number, required: true }
});

export default mongoose.model('Sale', salesSchema);