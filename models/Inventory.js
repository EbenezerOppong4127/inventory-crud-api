const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'An inventory item must have a name'],
        unique: true,
        trim: true,
        minlength: [3, 'Name must have at least 3 characters'],
        maxlength: [50, 'Name must have at most 50 characters']
    },
    quantity: {
        type: Number,
        required: [true, 'An inventory item must have a quantity'],
        min: [0, 'Quantity must be at least 0']
    },
    description: {
        type: String,
        trim: true,
        maxlength: [255, 'Description must have at most 255 characters']
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Check if model already exists before defining it
const Inventory = mongoose.models.Inventory || mongoose.model('Inventory', inventorySchema);

module.exports = Inventory;