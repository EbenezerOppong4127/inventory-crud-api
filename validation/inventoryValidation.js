const Joi = require('joi');

const inventorySchema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    quantity: Joi.number().min(0).required(),
    description: Joi.string().max(255),
    category: Joi.string(),
    price: Joi.number().min(0),
    stock: Joi.number().min(0)
});

module.exports = { inventorySchema };