const Inventory = require('../models/inventory');
const { inventorySchema } = require('../validation/inventoryValidation');
const { AppError } = require('../middlewares/errorMiddleware');

/**
 * @swagger
 * components:
 *   schemas:
 *     Inventory:
 *       type: object
 *       required:
 *         - name
 *         - quantity
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated ID
 *         name:
 *           type: string
 *           minLength: 3
 *           maxLength: 50
 *           example: "Premium Widget"
 *         quantity:
 *           type: number
 *           minimum: 0
 *           example: 100
 *         description:
 *           type: string
 *           maxLength: 255
 *           example: "High-quality widget"
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

const validateInventory = (data) => {
    const { error } = inventorySchema.validate(data, { abortEarly: false });
    if (error) {
        const messages = error.details.map(detail => detail.message).join(', ');
        throw new AppError(400, `Validation Error: ${messages}`);
    }
};

/**
 * @swagger
 * /api/inventory:
 *   get:
 *     summary: Get all inventory items
 *     tags: [Inventory]
 *     responses:
 *       200:
 *         description: Successfully retrieved inventory
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Inventory'
 */
const getInventory = async (req, res, next) => {
    try {
        const inventory = await Inventory.find().sort({ createdAt: -1 });
        res.status(200).json({
            status: 'success',
            results: inventory.length,
            data: { inventory }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @swagger
 * /api/inventory:
 *   post:
 *     summary: Create a new inventory item
 *     tags: [Inventory]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Inventory'
 *     responses:
 *       201:
 *         description: Inventory item created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Inventory'
 */
const createInventory = async (req, res, next) => {
    try {
        validateInventory(req.body);
        const newItem = await Inventory.create(req.body);
        res.status(201).json({
            status: 'success',
            data: { inventory: newItem }
        });
    } catch (error) {
        if (error.code === 11000) {
            next(new AppError(400, 'Inventory item with this name already exists'));
        } else {
            next(error);
        }
    }
};

/**
 * @swagger
 * /api/inventory/{id}:
 *   put:
 *     summary: Update an inventory item
 *     tags: [Inventory]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Inventory'
 *     responses:
 *       200:
 *         description: Inventory item updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Inventory'
 */
const updateInventory = async (req, res, next) => {
    try {
        validateInventory(req.body);
        const updatedItem = await Inventory.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedItem) {
            throw new AppError(404, 'No inventory item found with that ID');
        }

        res.status(200).json({
            status: 'success',
            data: { inventory: updatedItem }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @swagger
 * /api/inventory/{id}:
 *   delete:
 *     summary: Delete an inventory item
 *     tags: [Inventory]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Inventory item deleted
 */
const deleteInventory = async (req, res, next) => {
    try {
        const deletedItem = await Inventory.findByIdAndDelete(req.params.id);

        if (!deletedItem) {
            throw new AppError(404, 'No inventory item found with that ID');
        }

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