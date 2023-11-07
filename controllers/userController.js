// Import the User and Thought models from the relative path
const { User, Thought } = require("../models");

// Export an object containing methods for User-related operations
module.exports = {

  // Method to get all Users from the database
  getUser(req, res) {
    User.find({})  // Use Mongoose to find all User documents
      .then((user) => res.json(user))  // Send the found users as a JSON response
      .catch((err) => res.status(500).json(err));  // Send an error response if an exception occurs
  },

  // Method to get a single User by their ID
  getSingleUser(req, res) {
    User.findOne({ _id: req.params.userId })  // Find a single User by ID provided in request parameters
      .populate("thoughts")  // Include the associated Thoughts in the result
      .populate("friends")  // Include the associated Friends in the result
      .select("-__v")  // Exclude the version key from the result
      .then((user) =>
        !user
          ? res.status(404).json({ message: "No User found with that ID!" })  // Send a 404 error if no User is found
          : res.json(user)  // Send the found User as a JSON response
      )
      .catch((err) => res.status(500).json(err));  // Send an error response if an exception occurs
  },

  // Method to create a new User
  createUser(req, res) {
    User.create(req.body)  // Create a new User with the data provided in the request body
      .then((user) => res.json(user))  // Send the created User as a JSON response
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);  // Log the error and send an error response if an exception occurs
      });
  },

  // Method to update an existing User
  updateUser(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },  // Find the User by ID provided in request parameters
      { $set: req.body },  // Update the User with the data provided in the request body
      { runValidators: true, new: true }  // Run validators and return the new document
    )
      .then((user) =>
        !user
          ? res.status(404).json({ message: "No User found with this ID!" })  // Send a 404 error if no User is found
          : res.json(user)  // Send the updated User as a JSON response
      )
      .catch((err) => res.status(500).json(err));  // Send an error response if an exception occurs
  },

  // Method to delete an existing User and their associated Thoughts
  deleteUser(req, res) {
    User.findOneAndDelete({ _id: req.params.userId })  // Find and delete the User by ID provided in request parameters
      .then((user) =>
        !user
          ? res.status(404).json({ message: "No User found with this ID!" })  // Send a 404 error if no User is found
          : Thought.deleteMany({ _id: { $in: user.thoughts } })  // Delete all Thoughts associated with the User
      )
      .then(() => res.json({ message: "User and User's Thoughts deleted!" }))  // Confirm User and Thoughts deletion
      .catch((err) => res.status(500).json(err));  // Send an error response if an exception occurs
  },

  // Method to add a Friend to a User's friends list
  addFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },  // Find the User by ID provided in request parameters
      { $addToSet: { friends: req.params.friendId } },  // Add a new friend's ID to the User's friends array
      { runValidators: true, new: true }  // Run validators and return the new document
    )
      .then((user) =>
        !user
          ? res.status(404).json({ message: "No User found with this ID!" })  // Send a 404 error if no User is found
          : res.json(user)  // Send the updated User as a JSON response
      )
      .catch((err) => res.status(500).json(err));  // Send an error response if an exception occurs
  },

  // Method to remove a Friend from a User's friends list
  deleteFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },  // Find the User by ID provided in request parameters
      { $pull: { friends: req.params.friendId } },  // Remove a friend's ID from the User's friends array
      { new: true }  // Return the updated User document
    )
      .then(
        (user) =>
          !user
            ? res.status(404).json({ message: "No User found with this ID!" })  // Send a 404 error if no User is found
            : res.json(user)  // Send the updated User as a JSON response
      )
      .catch((err) => res.status(500).json(err));  // Send an error response if an exception occurs
  },
};
