/**
 * Database Configuration
 * ----------------------
 * This file handles the connection to the MongoDB database.
 * We use a library called 'mongoose' to make interacting with MongoDB easier.
 */

// 1. Import Mongoose
// Mongoose is an ODM (Object Data Modeling) library for MongoDB and Node.js.
// It manages relationships between data, provides schema validation, and is used to translate between objects in code and the representation of those objects in MongoDB.
const mongoose = require('mongoose');
const dns = require('dns');

// FIX: Force Node.js to use Google DNS (8.8.8.8) to resolve MongoDB SRV records
// This bypasses local ISP/Router DNS issues that cause "querySrv ECONNREFUSED"
try {
    dns.setServers(['8.8.8.8', '8.8.4.4']);
    console.log("🔄 Applied Custom DNS Fix (Using 8.8.8.8) for MongoDB connection...");
} catch (e) {
    console.log("⚠️ Could not set custom DNS servers:", e.message);
}

/**
 * Connect to MongoDB Asynchronously
 * 
 * We use an 'async' function because connecting to a database takes time (it's not instant).
 * 'await' ensures that we wait for the connection to be established before moving on.
 */
const connectDB = async () => {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error(`MongoDB connection failed: ${error.message}`);
        process.exit(1);
    }
};

// 5. Export the Connection Function
// We export this function so we can use it in our main 'server.js' file.
module.exports = connectDB;
