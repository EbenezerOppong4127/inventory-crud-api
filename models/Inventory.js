const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minlength: [3, 'Name must be at least 3 characters'],
        maxlength: [50, 'Name cannot exceed 50 characters']
    },
    quantity: {
        type: Number,
        required: [true, 'Quantity is required'],
        min: [0, 'Quantity must be at least 0']
    },
    description: {
        type: String,
        trim: true,
        maxlength: [255, 'Description cannot exceed 255 characters']
    },
    category: {
        type: String,
        trim: true
    },
    price: {
        type: Number,
        min: [0, 'Price must be at least 0']
    },
    stock: {
        type: Number,
        min: [0, 'Stock must be at least 0']
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Inventory', inventorySchema);