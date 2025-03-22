const express = require("express");
const { getInventory, createInventory, updateInventory, deleteInventory } = require("../controllers/inventoryController");
const router = express.Router();

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
 *       500:
 *         description: Internal Server Error.
 */
router.get("/", async (req, res) => {
    try {
        const inventory = await getInventory();
        res.status(200).json(inventory);
    } catch (error) {
        console.error("Error fetching inventory:", error);
        res.status(500).json({ message: "Internal Server Error" });
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
 *         description: Bad request.
 *       500:
 *         description: Internal Server Error.
 */
router.post("/", async (req, res) => {
    try {
        const inventoryItem = await createInventory(req.body);
        res.status(201).json(inventoryItem);
    } catch (error) {
        console.error("Error creating inventory item:", error);
        res.status(error.status || 400).json({ message: error.message || "Bad Request" });
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
 *         description: Bad request.
 *       404:
 *         description: Inventory item not found.
 *       500:
 *         description: Internal Server Error.
 */
router.put("/:id", async (req, res) => {
    try {
        const updatedInventory = await updateInventory(req.params.id, req.body);
        if (!updatedInventory) {
            return res.status(404).json({ message: "Inventory item not found" });
        }
        res.status(200).json(updatedInventory);
    } catch (error) {
        console.error("Error updating inventory item:", error);
        res.status(error.status || 500).json({ message: error.message || "Internal Server Error" });
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
router.delete("/:id", async (req, res) => {
    try {
        const deletedInventory = await deleteInventory(req.params.id);
        if (!deletedInventory) {
            return res.status(404).json({ message: "Inventory item not found" });
        }
        res.status(200).json({ message: "Inventory item deleted successfully" });
    } catch (error) {
        console.error("Error deleting inventory item:", error);
        res.status(error.status || 500).json({ message: error.message || "Internal Server Error" });
    }
});

module.exports = router;
