const Joi = require('joi');

const inventorySchema = Joi.object({
    name: Joi.string()
        .min(3)
        .max(50)
        .required()
        .messages({
            'string.base': 'Name should be a string',
            'string.empty': 'Name cannot be empty',
            'string.min': 'Name should have at least {#limit} characters',
            'string.max': 'Name should have at most {#limit} characters',
            'any.required': 'Name is required'
        }),
    quantity: Joi.number()
        .min(0)
        .required()
        .messages({
            'number.base': 'Quantity should be a number',
            'number.min': 'Quantity should be at least {#limit}',
            'any.required': 'Quantity is required'
        }),
    description: Joi.string()
        .max(255)
        .messages({
            'string.base': 'Description should be a string',
            'string.max': 'Description should have at most {#limit} characters'
        })
});

module.exports = { inventorySchema };