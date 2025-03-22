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
 *       500:
 *         description: Internal server error
 */
router.get("/", async (req, res) => {
    try {
        const users = await getUsers();
        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Internal Server Error" });
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
router.post("/", async (req, res) => {
    try {
        const user = await createUser(req.body);
        res.status(201).json(user);
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(error.status || 400).json({ message: error.message || "Bad Request" });
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
router.put("/:id", async (req, res) => {
    try {
        const updatedUser = await updateUser(req.params.id, req.body);
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(updatedUser);
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(error.status || 500).json({ message: error.message || "Internal Server Error" });
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
router.delete("/:id", async (req, res) => {
    try {
        const deletedUser = await deleteUser(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(error.status || 500).json({ message: error.message || "Internal Server Error" });
    }
});

module.exports = router;
