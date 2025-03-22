const Inventory = require("../models/Inventory");
const inventorySchema = require("../validation/inventoryValidation");

exports.getInventory = async (req, res, next) => {
    try {
        const items = await Inventory.find();
        res.status(200).json(items);
    } catch (error) {
        next(error);
    }
};

exports.createInventory = async (req, res, next) => {
    try {
        await inventorySchema.validate(req.body, { abortEarly: false });

        const newItem = new Inventory(req.body);
        await newItem.save();
        res.status(201).json(newItem);
    } catch (error) {
        next(error);
    }
};

exports.updateInventory = async (req, res, next) => {
    try {
        await inventorySchema.validate(req.body, { abortEarly: false });

        const updatedItem = await Inventory.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedItem) return res.status(404).json({ error: "Item not found" });

        res.status(200).json(updatedItem);
    } catch (error) {
        next(error);
    }
};

exports.deleteInventory = async (req, res, next) => {
    try {
        const deletedItem = await Inventory.findByIdAndDelete(req.params.id);
        if (!deletedItem) return res.status(404).json({ error: "Item not found" });

        res.status(200).json({ message: "Item Deleted" });
    } catch (error) {
        next(error);
    }
};
