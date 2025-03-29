const express = require('express');
const router = express.Router();
const {
    getInventory,
    createInventory,
    updateInventory,
    deleteInventory
} = require('../controllers/inventoryController');
const { authenticateJWT } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Inventory
 *   description: Inventory management endpoints
 */

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
 *         category:
 *           type: string
 *           example: "Electronics"
 *         price:
 *           type: number
 *           minimum: 0
 *           example: 29.99
 *         stock:
 *           type: number
 *           minimum: 0
 *           example: 50
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       example:
 *         name: "Premium Widget"
 *         quantity: 100
 *         description: "High-quality widget"
 *         category: "Electronics"
 *         price: 29.99
 *         stock: 50
 */

// Apply authentication middleware to all routes
router.use(authenticateJWT);

/**
 * @swagger
 * /api/inventory:
 *   get:
 *     summary: Get all inventory items
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved inventory items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Inventory'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/', getInventory);

/**
 * @swagger
 * /api/inventory:
 *   post:
 *     summary: Create a new inventory item
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Inventory'
 *     responses:
 *       201:
 *         description: Successfully created inventory item
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Inventory'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post('/', createInventory);

/**
 * @swagger
 * /api/inventory/{id}:
 *   put:
 *     summary: Update an inventory item
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the inventory item to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Inventory'
 *     responses:
 *       200:
 *         description: Successfully updated inventory item
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Inventory'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Inventory item not found
 *       500:
 *         description: Internal server error
 */
router.put('/:id', updateInventory);

/**
 * @swagger
 * /api/inventory/{id}:
 *   delete:
 *     summary: Delete an inventory item
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the inventory item to delete
 *     responses:
 *       204:
 *         description: Successfully deleted inventory item
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Inventory item not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', deleteInventory);

module.exports = router;