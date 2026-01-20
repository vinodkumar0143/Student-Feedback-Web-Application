/**
 * Express Server Entry Point
 * --------------------------
 * This is the main file for our backend application.
 * It sets up the server, configures middleware, and defines routes.
 */

// 1. Import required modules
// 'express' is the framework we use to build web applications
const express = require('express');

// 'cors' (Cross-Origin Resource Sharing) allows our frontend to talk to this backend
// even if they are on different ports (e.g., frontend on 5500, backend on 3000)
const cors = require('cors');

// 'dotenv' loads environment variables from a .env file into process.env
// This simulates keeping secrets safe, like database passwords
require('dotenv').config();

// Import Database Connection function
const connectDB = require('./config/db');

// Import Routes
const feedbackRoutes = require('./routes/feedbackRoutes');

// Connect to Database
connectDB();

// 2. Initialize the Express Application
const app = express();
const PORT = process.env.PORT || 3000; // Use port from .env or default to 3000

// 3. Middlewares
// Middleware are functions that run before your route handler catches the request.
// Think of them like security guards or receptionists processing incoming requests.

// Enable CORS for all requests
app.use(cors());

// Enable JSON Body Parsing
// This allows us to access data sent in the request body (e.g., POST requests)
// via 'req.body'. Without this, req.body would be undefined.
app.use(express.json());

// Custom Logging Middleware
// This logs every request made to the server so we can see what's happening
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} request to ${req.url}`);

    // 'next()' tells Express to move to the next piece of middleware or route handler.
    // If we forget this, the request will hang forever!
    next();
});

// 4. Routes
// Routes define how the server responds to specific URLs and HTTP methods.

// Health Check Route
// A simple GET request to check if the server is running correctly.
// Try visiting http://localhost:3000/ in your browser!

app.get('/', (req, res) => {
    // We send back a JSON response with a status and message
    res.json({
        status: 'success',
        message: 'Student Feedback Backend is running!',
        uptime: process.uptime()
    });
});

// Verification Route: Check DB Status
app.get('/db-status', (req, res) => {
    const mongoose = require('mongoose');
    const status = mongoose.connection.readyState === 1 ? 'MongoDB connected' : 'MongoDB not connected';
    res.json({ database: status });
});

// Feedback API Routes
// This links our feedbackRoutes to the /api/feedback path.
// Any request starting with /api/feedback will be handled by the router we created.
app.use('/api/feedback', feedbackRoutes);

// 5. Start the Server
// This tells Express to listen for incoming connections on the specified port.
app.listen(PORT, () => {
    console.log(`
    🚀 Server is running successfully!
    ----------------------------------
    > Local: http://localhost:${PORT}
    > Environment: ${process.env.NODE_ENV || 'development'}
    `);
});
