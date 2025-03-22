const express = require("express");
const { getInventory, createInventory, updateInventory, deleteInventory } = require("../controllers/inventoryController");
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Inventory:
 *       type: object
 *       required:
 *         - name
 *         - category
 *         - price
 *         - stock
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the inventory item.
 *         category:
 *           type: string
 *           description: The category of the inventory item.
 *         price:
 *           type: number
 *           description: The price of the inventory item.
 *         stock:
 *           type: number
 *           description: The stock quantity of the inventory item.
 *         description:
 *           type: string
 *           description: A description of the inventory item.
 *         supplier:
 *           type: string
 *           description: The supplier of the inventory item.
 */

/**
 * @swagger
 * tags:
 *   name: Inventory
 *   description: API for managing inventory items
 */

/**
 * @swagger
 * /api/inventory:
 *   get:
 *     summary: Get all inventory items
 *     tags: [Inventory]
 *     description: Returns a list of all inventory items.
 *     responses:
 *       200:
 *         description: A list of inventory items.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Inventory'
 *       404:
 *         description: No inventory items found.
 *       500:
 *         description: Internal Server Error.
 */
router.get("/", async (req, res, next) => {
    try {
        await getInventory(req, res, next); // Pass req, res, and next
    } catch (error) {
        next(error); // Pass the error to the error-handling middleware
    }
});

/**
 * @swagger
 * /api/inventory:
 *   post:
 *     summary: Create a new inventory item
 *     tags: [Inventory]
 *     description: Creates a new inventory item with the provided data.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Inventory'
 *     responses:
 *       201:
 *         description: Successfully created inventory item.
 *       400:
 *         description: Bad request (invalid input).
 *       500:
 *         description: Internal Server Error.
 */
router.post("/", async (req, res, next) => {
    try {
        await createInventory(req, res, next); // Pass req, res, and next
    } catch (error) {
        next(error); // Pass the error to the error-handling middleware
    }
});

/**
 * @swagger
 * /api/inventory/{id}:
 *   put:
 *     summary: Update an existing inventory item
 *     tags: [Inventory]
 *     description: Updates an existing inventory item by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the inventory item to update.
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
 *         description: Successfully updated inventory item.
 *       400:
 *         description: Bad request (invalid input).
 *       404:
 *         description: Inventory item not found.
 *       500:
 *         description: Internal Server Error.
 */
router.put("/:id", async (req, res, next) => {
    try {
        await updateInventory(req, res, next); // Pass req, res, and next
    } catch (error) {
        next(error); // Pass the error to the error-handling middleware
    }
});

/**
 * @swagger
 * /api/inventory/{id}:
 *   delete:
 *     summary: Delete an inventory item
 *     tags: [Inventory]
 *     description: Deletes an inventory item by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the inventory item to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully deleted inventory item.
 *       404:
 *         description: Inventory item not found.
 *       500:
 *         description: Internal Server Error.
 */
router.delete("/:id", async (req, res, next) => {
    try {
        await deleteInventory(req, res, next); // Pass req, res, and next
    } catch (error) {
        next(error); // Pass the error to the error-handling middleware
    }
});

module.exports = router;