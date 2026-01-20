const mongoose = require('mongoose');

// WHAT IS A SCHEMA?
// A schema defines the structure of the data we will store in our MongoDB database.
// It acts like a blueprint, ensuring that every piece of feedback has the same fields
// and follows specific rules (like 'required' fields or data types).

const feedbackSchema = new mongoose.Schema({
    name: {
        type: String,      // The name of the student providing feedback
        required: true,    // This field is mandatory; we cannot save feedback without a name
        trim: true         // Automatically removes accidental spaces at the start or end
    },
    feedback: {
        type: String,      // The content of the feedback message
        required: true,    // Feedback content cannot be empty
        trim: true
    },
    createdAt: {
        type: Date,        // The timestamp of when the feedback was submitted
        default: Date.now  // Automatically records the current time if not specified
    }
});

// WHAT IS A MODEL?
// A model is the tool (interface) we use to interact with the MongoDB collection.
// While the Schema defines the "shape" of the data, the Model provides the 
// methods to Create, Read, Update, and Delete (CRUD) documents in the database.

// 'Feedback' is the name of our model. Mongoose will automatically create a 
// collection named 'feedbacks' (plural, lowercase) in the database.
const Feedback = mongoose.model('Feedback', feedbackSchema);

// Export the model so we can import and use it in our routes or controllers
module.exports = Feedback;
