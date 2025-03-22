const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Inventory CRUD API',
            version: '1.0.0',
            description: 'API Documentation for Inventory Management',
        },
        servers: [
            {
                url: 'http://localhost:5410',
                description: 'Local server',
            },
            {
                url: 'http://localhost:5410',
                description: 'Production server',
            }
        ],
        components: {
            schemas: {
                Inventory: {
                    type: 'object',
                    required: ['name', 'category', 'price', 'stock'],
                    properties: {
                        _id: {
                            type: 'string',
                            description: 'Auto-generated ID',
                            readOnly: true
                        },
                        name: {
                            type: 'string',
                            description: 'Name of the inventory item'
                        },
                        category: {
                            type: 'string',
                            description: 'Category of the item'
                        },
                        price: {
                            type: 'number',
                            description: 'Price of the item'
                        },
                        stock: {
                            type: 'number',
                            description: 'Stock available'
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Timestamp of creation'
                        }
                    }
                },
                User: {  // Add the User schema here
                    type: 'object',
                    required: ['username', 'email', 'password'],
                    properties: {
                        _id: {
                            type: 'string',
                            description: 'Auto-generated ID',
                            readOnly: true
                        },
                        username: {
                            type: 'string',
                            description: 'User\'s unique username'
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            description: 'User\'s email address'
                        },
                        password: {
                            type: 'string',
                            format: 'password',
                            description: 'User\'s password (hashed)'
                        },
                        role: {
                            type: 'string',
                            enum: ['admin', 'user'],
                            description: 'Role of the user'
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Timestamp of user creation'
                        }
                    }
                }
            }
        }
    },
    apis: ['./routes/*.js'], // Ensure user routes are documented
};

const swaggerSpec = swaggerJsdoc(options);

const setupSwagger = (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

module.exports = setupSwagger;
