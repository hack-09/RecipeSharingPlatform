// ----recipes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/ImageData');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// Recipe Model
const Recipe = require('../public/Recipe');


// Create a recipe
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { title, description, ingredients, instructions, cookingTime, difficulty,category, servingSize } = req.body;
    const image = req.file.filename;
    const username = req.session.username; // Retrieve the username from the session
    const instructionsArray = instructions.split('\n');
    const joinedInstructions = instructionsArray.join('\n');

    const recipe = new Recipe({
      title,
      description,
      ingredients,
      instructions: joinedInstructions,
      cookingTime,
      difficulty,
      category,
      servingSize,
      image,
      username, // Save the username with the recipe
    });
    
    await recipe.save();
    res.redirect('/recipes');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});



// Edit a recipe
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { title, description, ingredients, instructions, cookingTime, difficulty, servingSize } = req.body;
    const image = req.file ? req.file.filename : null;
    const instructionsArray = instructions.split('\n');
    const joinedInstructions = instructionsArray.join('\n');

    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).send('Recipe not found');
    }
    
    recipe.title = title;
    recipe.description = description;
    recipe.ingredients = ingredients;
    recipe.instructions = joinedInstructions;
    recipe.cookingTime = cookingTime;
    recipe.difficulty = difficulty;
    recipe.servingSize = servingSize;
    if (image) {
      recipe.image = image;
    }
    
    if (req.body['comment_text'] && req.body['comment_author'] && req.body['rating']) {
      // Get individual components of the date and time
      const currentTime = new Date();
      const year = currentTime.getFullYear();
      const month = (currentTime.getMonth() + 1).toString().padStart(2, '0');
      const day = currentTime.getDate().toString().padStart(2, '0');
      const hours = currentTime.getHours().toString().padStart(2, '0');
      const minutes = currentTime.getMinutes().toString().padStart(2, '0');
      const time = `${year}-${month}-${day} / ${hours}:${minutes}`;

      const newComment = {
        text: req.body['comment_text'],
        author: req.body['comment_author'],
        rating: req.body['rating'],
        date : time,
      };
      recipe.comments.push(newComment);
    }
    await recipe.save();
    res.redirect('/recipes');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Delete a recipe
router.delete('/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).send('Recipe not found');
    }
    
    await recipe.remove();
    res.redirect('/recipes');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

module.exports = router;

