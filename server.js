const express = require('express');
const connectDB = require('./config/db');
const inventoryRoutes = require('./routes/inventoryRoutes');
const userRoutes = require("./routes/userRoutes");
const setupSwagger = require('./swagger'); // Import Swagger setup
const { graphqlHTTP } = require('express-graphql');
const schema = require('./graphql/schema');
const errorHandler = require('./middlewares/errorMiddleware');
const cors = require('cors');

require('dotenv').config();

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// Middleware
app.use(express.json()); // Parse JSON request bodies
app.use(cors()); // Enable CORS for all routes

// GraphQL Endpoint
app.use(
    '/graphql',
    graphqlHTTP({
        schema,
        graphiql: true, // Enable GraphQL UI for testing
    })
);

// Setup Swagger UI
setupSwagger(app);

// Use inventory routes
app.use('/api/inventory', inventoryRoutes);
/*Use user routes*/
app.use("/api/users", userRoutes);

// Handle 404 (Invalid Routes)
app.use((req, res, next) => {
    res.status(404).json({ success: false, message: 'Route Not Found' });
});

// Error Handler (should be after all routes)
app.use(errorHandler);

// Start the server
const PORT = process.env.PORT || 5410;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));