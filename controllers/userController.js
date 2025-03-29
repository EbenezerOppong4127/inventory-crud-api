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


const loginUser = async (req, res, next) => {
    try {
        // Validate request body
        const { error } = loginSchema.validate(req.body);
        if (error) {
            return next(new AppError(400, error.details[0].message));
        }

        const { email, password } = req.body;

        // 1) Check if email and password exist
        if (!email || !password) {
            return next(new AppError(400, 'Please provide email and password'));
        }

        // 2) Check if user exists && password is correct
        const user = await User.findOne({ email }).select('+password');

        if (!user || !(await user.comparePassword(password))) {
            return next(new AppError(401, 'Incorrect email or password'));
        }

        // 3) Generate JWT token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES }
        );

        // 4) Remove password from output
        user.password = undefined;

        // 5) Send response
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

module.exports = { registerUser, loginUser, getAllUsers };