// Import the Schema, model, and Types classes from Mongoose.
const { Schema, model, Types } = require('mongoose');

// Define a new Schema for users.
const userSchema = new Schema({
  // The username field must be a unique string.
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true,
  },

  // The email field must be a unique string and must match the format of a valid email address.
  email: {
    type: String,
    required: true,
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please use a valid email address",
    ],
  },

  // The thoughts field is an array of ObjectIds that reference Thought documents.
  thoughts: [
    {
      type: Schema.Types.ObjectId,
      ref: "Thought",
    },
  ],

  // The friends field is an array of ObjectIds that reference User documents.
  friends: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

// Define a virtual field called friendCount that returns the number of friends the user has.
userSchema.virtual("friendCount").get(function () {
  return this.friends.length;
});

// Create a model for users based on the userSchema.
const User = model('User', userSchema);

// Export the User model so that it can be used in other modules.
module.exports = User;
