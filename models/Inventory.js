const mongoose = require('mongoose');

const InventorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 1 },
    description: { type: String },
    supplier: { type: String },
    createdAt: { type: Date, default: Date.now },
});

const Inventory = mongoose.model('Inventory', InventorySchema);

module.exports = Inventory;
