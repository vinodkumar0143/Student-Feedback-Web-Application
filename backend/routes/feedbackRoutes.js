const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback'); // Import the Data Model

// ============================================
// POST API: Submit New Feedback
// URL: /api/feedback
// ============================================
router.post('/', async (req, res) => {
    try {
        // 1. Destructure data from the request body
        // The frontend sends data in JSON format, e.g., { "name": "Alice", "feedback": "Great course!" }
        const { name, feedback } = req.body;

        // 2. Validate the input
        // Ensure that both name and feedback are provided and are not empty strings.
        if (!name || !feedback) {
            return res.status(400).json({
                success: false,
                message: 'Please provide both name and feedback fields.'
            });
        }

        // 3. Create a new Feedback document
        // We create an instance of our Mongoose model with the data.
        const newFeedback = new Feedback({
            name: name,
            feedback: feedback
        });

        // 4. Save to MongoDB
        // The .save() method is asynchronous and returns a promise.
        // It inserts the document into the "feedbacks" collection.
        const savedFeedback = await newFeedback.save();

        // 5. Send Success Response
        // HTTP Status 201 means "Created".
        res.status(201).json({
            success: true,
            message: 'Feedback submitted successfully!',
            data: savedFeedback
        });

    } catch (error) {
        // 6. Handle Errors
        // If something goes wrong (e.g., database connection fail), we catch it here.
        console.error('Error saving feedback:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error: Unable to save feedback.'
        });
    }
});

// ============================================
// GET API: Retrieve All Feedback
// URL: /api/feedback
// ============================================
router.get('/', async (req, res) => {
    try {
        // 1. Fetch from Database
        // .find() retrieves all documents in the collection.
        // .sort({ createdAt: -1 }) sorts them by date, newest first (-1 for descending).
        const feedbackList = await Feedback.find().sort({ createdAt: -1 });

        // 2. Send Success Response
        // HTTP Status 200 means "OK".
        res.status(200).json({
            success: true,
            count: feedbackList.length,
            data: feedbackList
        });

    } catch (error) {
        // 3. Handle Errors
        console.error('Error fetching feedback:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error: Unable to fetch feedback list.'
        });
    }
});

module.exports = router;
