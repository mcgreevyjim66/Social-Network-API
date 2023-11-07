// Import the Mongoose library.
const mongoose = require('mongoose');

// Connect to the MongoDB database at localhost:27017.
mongoose.connect('mongodb://127.0.0.1:27017/socialnetworkDB', {
  // Enable the useNewUrlParser and useUnifiedTopology options to avoid deprecation warnings.
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Export the Mongoose connection object.
module.exports = mongoose.connection;
