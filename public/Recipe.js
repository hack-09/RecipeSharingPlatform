const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  ingredients: {
    type: String,
    required: true
  },
  instructions: {
    type: String,
    required: true
  },
  cookingTime: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  servingSize: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  comments: {
    type: Array,
    default: [] // Initialize comments as an empty array
  },
  username: { // Add createdBy field to store the username
    type: String
  },
});

module.exports = mongoose.model('Recipe', recipeSchema);
