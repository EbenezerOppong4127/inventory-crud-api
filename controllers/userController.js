const User = require("../models/User");
const userValidationSchema = require("../validation/userValidation");

// Get all users
exports.getUsers = async (req, res, next) => {
    try {
        const users = await User.find();
        if (!users || users.length === 0) {
            return res.status(404).json({ message: "No users found" });
        }
        res.status(200).json(users);
    } catch (error) {
        next(error); // Pass the error to the error-handling middleware
    }
};

// Get single user by ID
exports.getUserById = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        next(error); // Pass the error to the error-handling middleware
    }
};

// Create new user
exports.createUser = async (req, res, next) => {
    try {
        const { error } = userValidationSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const user = new User(req.body);
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        next(error); // Pass the error to the error-handling middleware
    }
};

// Update user
exports.updateUser = async (req, res, next) => {
    try {
        const { error } = userValidationSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        next(error); // Pass the error to the error-handling middleware
    }
};

// Delete user
exports.deleteUser = async (req, res, next) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(204).send();
    } catch (error) {
        next(error); // Pass the error to the error-handling middleware
    }
};