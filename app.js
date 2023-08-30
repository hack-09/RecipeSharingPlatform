//--- app.js  ---
require('dotenv').config(); // Load values from .env file

const express = require("express");
const path = require("path");
const mongoose = require('mongoose');
const ejs = require('ejs');
const session = require('express-session'); // Step 1: Require express-session
const cookieParser = require('cookie-parser'); // Step 2: Require cookie-parser

const app = express();
const port = 8000;


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
    maxAge: 3600000, // Session will expire in 1 hour of inactivity
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
  username: String,
  email:String,
  password: String,
  desc:String,
});

var authenticate = mongoose.model('authenticate', authenticateSchema);


//  -------------- Home Page ---------------------
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("home", { username: req.session.username });
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
  const { username, password } = req.body;

  // Find the user in the database based on the provided username and password
  authenticate.findOne({ username, password })
    .then((user) => {
      if (!user) {
        // User not found, display an alert message
        res.send('<script>alert("Username or password is incorrect. Please try again or sign up for a new account."); window.location.href="/login";</script>');
      } else {
        // User is found, set isAuthenticated in the session
        req.session.isAuthenticated = true;
        req.session.username = user.username; // You can store other user data in the session as well
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
const recipeRoutes = require('./routes/recipes');
app.get("/create_recipe", checkLogin, (req, res) => {
  res.render("create_recipe", { username: req.session.username });
});
app.get('/recipes',   (req, res) => {
  res.send('<script>alert("You Recipe Uploaded Successfully."); window.location.href="/create_recipe";</script>');
});

// ----------- My Recipe -------------
const Recipe = require('./public/Recipe');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


// My Recipe
app.get('/myrecipe', checkLogin, async (req, res) => {
  try {
    const loggedInUsername = req.session.username; 
    const recipes = await Recipe.find({ username: loggedInUsername });

    res.render('myRecipe', { recipes });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving data from the database.');
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
    res.render('recipeCard', { recipe,username: req.session.username });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error.');
  }
});

// ----------------comment-----------------------
// Add a new comment to the recipe
app.post('/recipeCard/:id/comments', async (req, res) => {
  try {
    const recipeId = req.params.id;
    const recipe = await Recipe.findById(recipeId);

    if (!recipe) {
      return res.status(404).send('Recipe not found.');
    }
    const { comment_text, rating } = req.body;
    const comment_author = req.session.username;

    const newComment = {
      text: comment_text,
      author: comment_author,
      rating: rating,
      date: new Date() 
    };

    recipe.comments.push(newComment);

    await recipe.save();
    res.redirect(`/recipeCard?id=${recipeId}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error.');
  }
});





// ----------------------- Listening Port ---------------
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
