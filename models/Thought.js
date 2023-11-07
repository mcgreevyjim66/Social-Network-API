// Import the Schema, model, and Types classes from Mongoose.
const { Schema, model, Types } = require('mongoose');
const moment = require('moment')

// Define a new Schema for reactions.
const reactionSchema = new Schema({
  // The reactionId field is an ObjectId that is generated automatically by Mongoose.
  reactionId: {
    type: Schema.Types.ObjectId,
    default: () => new Types.ObjectId(),
  },

  // The reactionBody field is a required string with a maximum length of 280 characters.
  reactionBody: {
    type: String,
    required: true,
    maxlength: 280,
  },

  // The username field is a required string that identifies the user who posted the reaction.
  username: {
    type: String,
    required: true,
  },

  // The createdAt field is a Date field that is set to the current time when the reaction is created.
  createdAt: {
    type: Date,
    default: Date.now,
    get: createdAtVal => moment(createdAtVal).format("MMM DD, YYYY [at] hh:mm a"),
  },
},
{
  toJSON: {
      virtuals: true,
      getters: true
  },
  id: false,
}
);

// Define a new Schema for thoughts.
const thoughtSchema = new Schema({
  // The thoughtText field is a required string with a minimum length of 1 character and a maximum length of 280 characters.
  thoughtText: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 280,
  },

  // The createdAt field is a Date field that is set to the current time when the thought is created.
  createdAt: {
    type: Date,
    default: Date.now,
    get: createdAtVal => moment(createdAtVal).format("MMM DD, YYYY [at] hh:mm a"),
  },

  // The username field is a required string that identifies the user who posted the thought.
  username: {
    type: String,
    required: true,
  },

  // The reactions field is an array of Reaction documents.
  reactions: [reactionSchema],
},
{
  toJSON: {
      virtuals: true,
      getters: true
  },
  id: false,
});

// Define a virtual field called reactionCount that returns the number of reactions the thought has.
thoughtSchema.virtual('reactionCount').get(function() {
  return this.reactions.length;
});

// Create a model for thoughts based on the thoughtSchema.
const Thought = model('Thought', thoughtSchema);

// Export the Thought model so that it can be used in other modules.
module.exports = Thought;
