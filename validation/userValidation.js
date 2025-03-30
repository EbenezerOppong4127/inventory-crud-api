const Joi = require('joi');

const userSchema = Joi.object({
    firstName: Joi.string().min(2).max(50).required()
        .messages({
            'string.empty': 'First name is required',
            'string.min': 'First name must be at least 2 characters',
            'string.max': 'First name cannot exceed 50 characters'
        }),
    lastName: Joi.string().min(2).max(50).required()
        .messages({
            'string.empty': 'Last name is required',
            'string.min': 'Last name must be at least 2 characters',
            'string.max': 'Last name cannot exceed 50 characters'
        }),
    email: Joi.string().email().required()
        .messages({
            'string.email': 'Please enter a valid email address',
            'string.empty': 'Email is required'
        }),
    password: Joi.string()
        .min(8)
        .required()
        .messages({
            'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
            'string.empty': 'Password is required'
        }),
    role: Joi.string().valid('user', 'admin').default('user')
});

const loginSchema = Joi.object({
    email: Joi.string().email().required()
        .messages({
            'string.email': 'Please enter a valid email address',
            'string.empty': 'Email is required'
        }),
    password: Joi.string().required()
        .messages({
            'string.empty': 'Password is required'
        })
});

module.exports = { userSchema, loginSchema };