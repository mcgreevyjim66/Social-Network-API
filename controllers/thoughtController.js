// Import the User and Thought models from the models directory
const { User, Thought } = require("../models");

// Export an object containing methods for CRUD operations
module.exports = {

  // Method to get all Thoughts from the database
  getThought(req, res) {
    Thought.find({})  // Use Mongoose to find all Thought documents
      .then((thought) => res.json(thought))  // Send the found thoughts as a JSON response
      .catch((err) => res.status(500).json(err));  // Send an error response if an exception occurs
  },

  // Method to get a single Thought by its ID
  getSingleThought(req, res) {
    Thought.findOne({ _id: req.params.thoughtId })  // Find a single Thought by ID provided in request parameters
      .select("-__v")  // Exclude the version key from the result
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: "No Thought found with this ID!" })  // Send a 404 error if no Thought is found
          : res.json(thought)  // Send the found Thought as a JSON response
      )
      .catch((err) => res.status(500).json(err));  // Send an error response if an exception occurs
  },

  // Method to create a new Thought
  createThought(req, res) {
    Thought.create(req.body)  // Create a new Thought with the data provided in the request body
      .then(({ _id }) => {
        return User.findOneAndUpdate(
          { _id: req.body.userId },  // Find the User by ID provided in request body
          { $push: { thoughts: _id } },  // Add the new Thought's ID to the User's thoughts array
          { new: true }  // Return the updated User document
        );
      })
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: "No User found with this ID!" })  // Send a 404 error if no User is found
          : res.json(thought)  // Send the updated User as a JSON response
      )
      .catch((err) => res.status(500).json(err));  // Send an error response if an exception occurs
  },

  // Method to update an existing Thought
  updateThought(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },  // Find the Thought by ID provided in request parameters
      { $set: req.body },  // Update the Thought with the data provided in the request body
      { runValidators: true, New: true }  // Run validators and return the new document
    )
      .then((user) =>
        !user
          ? res.status(404).json({ message: "No thought found with this ID!" })  // Send a 404 error if no Thought is found
          : res.json(user)  // Send the updated Thought as a JSON response
      )
      .catch((err) => res.status(500).json(err));  // Send an error response if an exception occurs
  },

  // Method to delete an existing Thought
  deleteThought(req, res) {
    Thought.findOneAndDelete({ _id: req.params.thoughtId })  // Find and delete the Thought by ID provided in request parameters
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: "No thought found with this ID!" })  // Send a 404 error if no Thought is found
          : User.findOneAndUpdate(
              { thoughts: req.params.thoughtId },  // Find the User with this thought
              { $pull: { thoughts: req.params.thoughtId } },  // Remove the Thought's ID from the User's thoughts array
              { new: true }  // Return the updated User document
            )
      )
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'Thought deleted, but no user found'})  // Send a 404 error if no User is found after deletion
          : res.json({ message: 'Thought successfully deleted' })  // Confirm Thought deletion
      )
      .catch((err) => res.status(500).json(err));  // Send an error response if an exception occurs
  },

  // Method to create a Reaction associated with a Thought
  createReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },  // Find the Thought by ID provided in request parameters
      { $addToSet: { reactions: req.body } },  // Add the Reaction provided in the request body to the Thought's reactions array
      { runValidators: true, new: true }  // Run validators and return the new document
    )
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: "No thought found with this ID!" })  // Send a 404 error if no Thought is found
          : res.json(thought)  // Send the updated Thought as a JSON response
      )
      .catch((err) => res.status(500).json(err));  // Send an error response if an exception occurs
  },

  // Method to delete a Reaction from a Thought
  deleteReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },  // Find the Thought by ID provided in request parameters
      { $pull: { reactions: { reactionId: req.params.reactionId } } },  // Remove the Reaction by ID provided in request parameters from the Thought's reactions array
      { runValidators: true, new: true }  // Run validators and return the new document
    )
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: "No thought found with this ID!" })  // Send a 404 error if no Thought is found
          : res.json(thought)  // Send the updated Thought as a JSON response
      )
      .catch((err) => res.status(500).json(err));  // Send an error response if an exception occurs
  },
};
