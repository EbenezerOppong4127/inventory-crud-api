const Inventory = require("../models/Inventory");
const inventorySchema = require("../validation/inventoryValidation");

// Get all inventory items
exports.getInventory = async (req, res, next) => {
    try {
        const items = await Inventory.find();
        if (!items || items.length === 0) {
            return res.status(404).json({ message: "No inventory items found" });
        }
        res.status(200).json(items);
    } catch (error) {
        next(error); // Pass the error to the error-handling middleware
    }
};

// Create a new inventory item
exports.createInventory = async (req, res, next) => {
    try {
        // Validate the request body
        await inventorySchema.validate(req.body, { abortEarly: false });

        // Create and save the new inventory item
        const newItem = new Inventory(req.body);
        await newItem.save();
        res.status(201).json(newItem);
    } catch (error) {
        next(error); // Pass the error to the error-handling middleware
    }
};

// Update an existing inventory item
exports.updateInventory = async (req, res, next) => {
    try {
        // Validate the request body
        await inventorySchema.validate(req.body, { abortEarly: false });

        // Find and update the inventory item
        const updatedItem = await Inventory.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedItem) {
            return res.status(404).json({ message: "Item not found" });
        }
        res.status(200).json(updatedItem);
    } catch (error) {
        next(error); // Pass the error to the error-handling middleware
    }
};

// Delete an inventory item
exports.deleteInventory = async (req, res, next) => {
    try {
        // Find and delete the inventory item
        const deletedItem = await Inventory.findByIdAndDelete(req.params.id);
        if (!deletedItem) {
            return res.status(404).json({ message: "Item not found" });
        }
        res.status(200).json({ message: "Item deleted successfully" });
    } catch (error) {
        next(error); // Pass the error to the error-handling middleware
    }
};