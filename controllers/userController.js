const User = require('../models/User');
const { userSchema, loginSchema } = require('../validation/userValidation');
const { AppError } = require('../middlewares/errorMiddleware');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const createToken = (userId, role) => {
    return jwt.sign(
        { id: userId, role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES }
    );
};

const registerUser = async (req, res, next) => {
    try {
        // Validate request body
        const { error } = userSchema.validate(req.body, { abortEarly: false });
        if (error) {
            const messages = error.details.map(detail => detail.message).join(', ');
            return next(new AppError(400, messages));
        }

        const { firstName, lastName, email, password, role = 'user' } = req.body;

        // Check if user exists (case-insensitive)
        const existingUser = await User.findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } });
        if (existingUser) {
            return next(new AppError(409, 'Email address is already registered'));
        }

        // Create new user
        const newUser = await User.create({
            firstName,
            lastName,
            email: email.toLowerCase(),
            password,
            role
        });

        // Generate token
        const token = createToken(newUser._id, newUser.role);

        // Prepare user data for response
        const userData = {
            _id: newUser._id,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,
            role: newUser.role,
            createdAt: newUser.createdAt
        };

        res.status(201).json({
            status: 'success',
            token,
            data: { user: userData }
        });

    } catch (error) {
        // Handle duplicate key error (in case unique index check fails)
        if (error.code === 11000) {
            return next(new AppError(409, 'Email address is already registered'));
        }
        next(error);
    }
};


// controllers/userController.js
const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // 1) Check if email and password exist
        if (!email || !password) {
            return next(new AppError(400, 'Please provide email and password'));
        }

        // 2) Check if user exists && password is correct
        const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

        if (!user || !(await user.comparePassword(password))) {
            return next(new AppError(401, 'Incorrect email or password'));
        }

        // 3) If everything ok, send token to client
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES }
        );

        // Remove password from output
        user.password = undefined;

        res.status(200).json({
            status: 'success',
            token,
            data: {
                user
            }
        });
    } catch (error) {
        next(error);
    }
};
const getAllUsers = async (req, res, next) => {
    try {
        // Check if user is admin
        if (req.user.role !== 'admin') {
            return next(new AppError(403, 'Only admin users can access this resource'));
        }

        const users = await User.find()
            .select('-password -__v')
            .sort({ createdAt: -1 });

        res.status(200).json({
            status: 'success',
            results: users.length,
            data: { users }
        });

    } catch (error) {
        next(error);
    }
};


// Add these new controller methods to your existing userController.js

const getUserById = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).select('-password -__v');

        if (!user) {
            return next(new AppError(404, 'User not found'));
        }

        // Only allow admin or the user themselves to access this data
        if (req.user.role !== 'admin' && req.user.id !== user._id.toString()) {
            return next(new AppError(403, 'You are not authorized to access this resource'));
        }

        res.status(200).json({
            status: 'success',
            data: { user }
        });
    } catch (error) {
        next(error);
    }
};

const updateUser = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Only allow admin or the user themselves to update
        if (req.user.role !== 'admin' && req.user.id !== id) {
            return next(new AppError(403, 'You are not authorized to perform this action'));
        }

        // Validate request body
        const { error } = userSchema.validate(req.body, { abortEarly: false });
        if (error) {
            const messages = error.details.map(detail => detail.message).join(', ');
            return next(new AppError(400, messages));
        }

        // Prevent role changes unless admin
        if (req.body.role && req.user.role !== 'admin') {
            return next(new AppError(403, 'Only admins can change user roles'));
        }

        // Check if email is being updated to an existing email
        if (req.body.email) {
            const existingUser = await User.findOne({
                email: req.body.email.toLowerCase(),
                _id: { $ne: id } // Exclude current user
            });

            if (existingUser) {
                return next(new AppError(400, 'Email is already in use'));
            }
        }

        const updatedUser = await User.findByIdAndUpdate(
            id,
            {
                ...req.body,
                email: req.body.email ? req.body.email.toLowerCase() : undefined
            },
            { new: true, runValidators: true }
        ).select('-password -__v');

        if (!updatedUser) {
            return next(new AppError(404, 'User not found'));
        }

        res.status(200).json({
            status: 'success',
            data: { user: updatedUser }
        });
    } catch (error) {
        next(error);
    }
};

const deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Only allow admin or the user themselves to delete
        if (req.user.role !== 'admin' && req.user.id !== id) {
            return next(new AppError(403, 'You are not authorized to perform this action'));
        }

        const user = await User.findByIdAndDelete(id);

        if (!user) {
            return next(new AppError(404, 'User not found'));
        }

        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (error) {
        next(error);
    }
};

// Update your exports to include the new methods
module.exports = {
    registerUser,
    loginUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
};

