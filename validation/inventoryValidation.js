// validation/inventoryValidation.js
const yup = require('yup');

const inventorySchema = yup.object({
    name: yup.string().required("Name is required"),
    category: yup.string().required("Category is required"),
    price: yup.number().required("Price is required").min(0, "Price must be at least 0"),
    stock: yup.number().required("Stock is required").min(1, "Stock must be at least 1"),
    description: yup.string().optional(),
    supplier: yup.string().optional(),
});

module.exports = inventorySchema;
