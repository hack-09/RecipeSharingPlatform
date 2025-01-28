//--- app.js  ---

const express = require("express");
const path = require("path");
const mongoose = require('mongoose');
const ejs = require('ejs');
const session = require('express-session'); // Step 1: Require express-session
const cookieParser = require('cookie-parser'); // Step 2: Require cookie-parser
const multer = require("multer"); // For handling file uploads
const ImgurStorage = require("multer-storage-imgur");
const imgur = require("imgur");
const got = require('got');

const app = express();
const port = 8000;

require('dotenv').config();

console.log("DATABASE_URL:", process.env.DATABASE_URL);

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});

// ---------------------- Configure session and cookie-parser middleware
app.use(cookieParser());
app.use(session({
  secret: 'Pranjal_292009', 
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24*3600000, // Session will expire in 1 hour of inactivity
    secure: false, // Set this to true if using HTTPS
    httpOnly: true, // This prevents JavaScript from accessing the cookie
  }
}));

// ---------------- Middleware function to check if user is logged in ---------------
const checkLogin = (req, res, next) => {
  // Check if user is authenticated, you can use any authentication mechanism here
  if (req.session && req.session.isAuthenticated) {
    // User is logged in, proceed to the next middleware or route handler
    next();
  } else {
    // User is not logged in, redirect to login page or display a warning
    res.send('<script>alert("You must be logged in to access this page."); window.location.href="/login";</script>');
  }
};


//------------------- Authentication Schema --------------------
var authenticateSchema = new mongoose.Schema({
  username: { type: String, required: true},
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  desc:String,
});

var authenticate = mongoose.model('authenticate', authenticateSchema);


//  -------------- Home Page ---------------------
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.render("home", { userId: req.session.userId, username: req.session.username });
});

app.get("/contact", (req, res) => {
  res.render("contact", { username: req.session.username });
});

app.get("/about", (req, res) => {
  res.render("about", { username: req.session.username });
});

app.get("/privacy", (req, res) => {
  res.render("privacy", { username: req.session.username });
});

app.get("/terms", (req, res) => {
  res.render("terms", { username: req.session.username });
});

// ------------------  Login Page ----------
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "public/login.html"));
});
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  authenticate.findOne({ email, password })
    .then((user) => {
      if (!user) {
        res.send('<script>alert("email or password is incorrect. Please try again or sign up for a new account."); window.location.href="/login";</script>');
      } else {
        // Store the user's _id in the session
        req.session.isAuthenticated = true;
        req.session._id = user._id; // Store user _id
        req.session.username = user.username;
        req.session.email = user.email; 
        res.redirect("/");
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Internal server error");
    });
});

// ---------Logout Field ------------------
app.get('/logout', (req, res) => {
  // Destroy the user session to log them out
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
      res.status(500).send('Internal server error.');
    } else {
      // Redirect the user to the homepage after logout
      res.redirect('/');
    }
  });
});


// ------------------  SignIn Page ----------
app.get("/Authentication", (req, res) => {
  res.sendFile(path.join(__dirname, "public/Authentication.html"));
});

app.post("/register", (req, res) => {
  var newUser = new authenticate(req.body);
  newUser.save()
    .then(() => {
      req.session.isAuthenticated = true;
      req.session.username = newUser.username; 
      res.send('<script>alert("User registration successful."); window.location.href="/login";</script>');
    })
    .catch((error) => {
      res.status(400).send("User registration failed.");
    });
});

// ----------- Recipe Submit ------------------------
// Create a recipe
// Setup Imgur Storage
const IMGUR_CLIENT_ID="44f43a058e09550";

const storage = new ImgurStorage({
  clientId: process.env.IMGUR_CLIENT_ID || IMGUR_CLIENT_ID, // Use environment variable
  timeout: 100000
});

// Recipe Schema
const recipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  ingredients: { type: String, required: true },
  instructions: { type: String, required: true },
  cookingTime: { type: String, required: true },
  difficulty: { type: String, required: true },
  category: { type: String, required: true },
  servingSize: { type: String, required: true },
  image: { type: String, required: true },
  comments: [
    {
      text: { type: String, required: true },
      author: { type: String, required: true },
      rating: { type: Number, min: 1, max: 5 },
      date: { type: Date, default: Date.now },
    }
  ],
  username: {type: String, require: true},
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'authenticate', required: true },
});

const Recipe = mongoose.model('Recipe', recipeSchema);

// Multer setup for file uploads
const upload = multer({ storage: storage });

// Route to create a recipe
app.post('/recipes', upload.single("image"), async (req, res) => {
  try {
    if (req.file && req.file.link) {
      const imgurImageUrl = req.file.link;

      if (!req.body.title || !req.body.description || !req.body.ingredients) {
        return res.status(400).send('Missing required fields');
      }
      
      const recipe = new Recipe({
        title: req.body.title,
        description: req.body.description,
        ingredients: req.body.ingredients,
        instructions: req.body.instructions,
        cookingTime: req.body.cookingTime,
        difficulty: req.body.difficulty,
        category: req.body.category,
        servingSize: req.body.servingSize,
        image: imgurImageUrl, // Image URL from Imgur
        username: req.session.username,
        userId: req.session._id,
      });

      await recipe.save();
      res.redirect('/recipes');
    } else {
      res.status(400).send("Image upload failed");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Route to render create recipe page
app.get("/create_recipe", checkLogin, (req, res) => {
  res.render("create_recipe", { username: req.session.username });
});

// Route to display success message and redirect
app.get('/recipes', (req, res) => {
  res.redirect('/create_recipe');
});
// ----------- My Recipe -------------
// const Recipe = require('./public/Recipe');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


// My Recipe
app.get('/myrecipe', checkLogin, async (req, res) => {
  try {
    const recipes = await Recipe.find({userId: req.session._id});

    res.render('myRecipe', { recipes });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving data from the database.');
  }
});

app.post('/recipeCard/:id/delete', checkLogin, async (req, res) => {
  const recipeId = req.params.id;

  try {
    // Find the recipe by ID
    const recipe = await Recipe.findById(recipeId);

    // Check if the logged-in user is the owner
    if (recipe.userId.toString() !== req.session._id) {
      return res.status(403).send('You are not authorized to delete this recipe.');
    }

    // Delete the recipe
    await Recipe.findByIdAndDelete(recipeId);
    res.redirect('/recipeList'); // Redirect to the recipe list
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while deleting the recipe.');
  }
});

//  ------------- Recipes List --------------
app.get('/recipeList', checkLogin, async (req, res) => {
  try {
    const category = req.query.category; 
    const searchQuery = req.query.search;
    const filter = {};
    if (category) {
      filter.category = category;
    }

    if (searchQuery) {
      filter.$or = [
        { title: { $regex: searchQuery, $options: 'i' } },
        { description: { $regex: searchQuery, $options: 'i' } },
      ];
    }

    const recipes = await Recipe.find(filter);

    res.render('recipeList', { recipes });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving data from the database.');
  }
});


//  -------------------RecipeCard (Read more)------------------------------
app.get('/recipeCard', async (req, res) => {
  try {
    const recipeId = req.query.id;
    const recipe = await Recipe.findById(recipeId);

    if (!recipe) {
      return res.send('Recipe not found.');
    }
    res.render('recipeCard', { recipe });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error.');
  }
});

// ----------------comment-----------------------
// Add a new comment to the recipe
app.post('/recipeCard/:id/comments',checkLogin, async (req, res) => {
  try {
    const recipeId = req.params.id; // Get recipe ID from route parameters

    // Find the recipe by ID
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).send('Recipe not found.');
    }

    // Get comment details from the request body
    const { comment_text, rating } = req.body;

    // Validate input fields
    if (!comment_text || !rating) {
      return res.status(400).send('Comment text and rating are required.');
    }

    // Get the currently logged-in user's username from session (or userId)
    const comment_author = req.session.username; // Assuming username is stored in the session
    if (!comment_author) {
      return res.status(401).send('User not logged in. Please log in to comment.');
    }

    // Create a new comment object
    const newComment = {
      text: comment_text,
      author: comment_author, // Store username or userId for tracking
      rating: rating,
      date: new Date(),
    };

    // Add the new comment to the recipe's comments array
    recipe.comments.push(newComment);

    // Save the updated recipe
    await recipe.save();

    // Redirect or send a success response
    res.redirect(`/recipeCard?id=${recipeId}`); // Adjust this to match your frontend flow
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error.');
  }
});


// ----------------------- Listening Port ---------------
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`http://localhost:${port}`)
});
