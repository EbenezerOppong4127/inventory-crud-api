const User = require("../models/User");
const userValidationSchema = require("../validation/userValidation");

// Get all users
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get single user by ID
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create new user
exports.createUser = async (req, res) => {
    try {
        const { error } = userValidationSchema.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        const user = new User(req.body);
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update user
exports.updateUser = async (req, res) => {
    try {
        const { error } = userValidationSchema.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete user
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
