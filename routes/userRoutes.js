const express = require("express");
const { getUsers, createUser, updateUser, deleteUser } = require("../controllers/userController");
const router = express.Router();

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     description: Returns a list of all registered users.
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       404:
 *         description: No users found
 *       500:
 *         description: Internal server error
 */
router.get("/", async (req, res, next) => {
    try {
        await getUsers(req, res, next); // Pass req, res, and next
    } catch (error) {
        next(error); // Pass the error to the error-handling middleware
    }
});

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user with the provided data.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: Successfully registered user
 *       400:
 *         description: Bad request (invalid input)
 *       500:
 *         description: Internal server error
 */
router.post("/", async (req, res, next) => {
    try {
        await createUser(req, res, next); // Pass req, res, and next
    } catch (error) {
        next(error); // Pass the error to the error-handling middleware
    }
});

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update user details
 *     description: Updates a user's information by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the user to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Successfully updated user
 *       400:
 *         description: Bad request (invalid input)
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.put("/:id", async (req, res, next) => {
    try {
        await updateUser(req, res, next); // Pass req, res, and next
    } catch (error) {
        next(error); // Pass the error to the error-handling middleware
    }
});

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete a user
 *     description: Deletes a user by their ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the user to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully deleted user
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", async (req, res, next) => {
    try {
        await deleteUser(req, res, next); // Pass req, res, and next
    } catch (error) {
        next(error); // Pass the error to the error-handling middleware
    }
});

module.exports = router;