const Inventory = require('../models/Inventory');
const { inventorySchema } = require('../validation/inventoryValidation');
const { AppError } = require('../middlewares/errorMiddleware');

const validateInventory = (data) => {
    const { error } = inventorySchema.validate(data);
    if (error) throw new AppError(400, error.details[0].message);
};

const getInventory = async (req, res, next) => {
    try {
        const inventory = await Inventory.find();
        res.status(200).json({
            status: 'success',
            results: inventory.length,
            data: { inventory }
        });
    } catch (error) {
        next(error);
    }
};

const createInventory = async (req, res, next) => {
    try {
        validateInventory(req.body);
        const newItem = await Inventory.create(req.body);
        res.status(201).json({
            status: 'success',
            data: { inventory: newItem }
        });
    } catch (error) {
        next(error);
    }
};

const updateInventory = async (req, res, next) => {
    try {
        validateInventory(req.body);
        const updatedItem = await Inventory.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedItem) throw new AppError(404, 'Inventory item not found');
        res.status(200).json({
            status: 'success',
            data: { inventory: updatedItem }
        });
    } catch (error) {
        next(error);
    }
};

const deleteInventory = async (req, res, next) => {
    try {
        const deletedItem = await Inventory.findByIdAndDelete(req.params.id);
        if (!deletedItem) throw new AppError(404, 'Inventory item not found');
        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getInventory,
    createInventory,
    updateInventory,
    deleteInventory
};