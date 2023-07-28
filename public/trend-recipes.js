// Sample trend recipes data
var trendRecipes = [
    {
      title: 'Recipe 1',
      image: 'img/recipe1.jpg',
      description: 'Description of Recipe 1'
    },
    {
      title: 'Recipe 2',
      image: 'img/recipe2.jpg',
      description: 'Description of Recipe 2'
    },
    // Add more sample recipes as needed
  ];
  
  // Populate the content on the trend-recipes.html page with the sample data
  var trendRecipesContainer = document.getElementById('trend-recipes-container');
  
  trendRecipes.forEach(function(recipe) {
    var recipeCard = document.createElement('div');
    recipeCard.classList.add('recipe-card');
  
    var recipeImage = document.createElement('img');
    recipeImage.src = recipe.image;
    recipeCard.appendChild(recipeImage);
  
    var recipeDetails = document.createElement('div');
    recipeDetails.classList.add('recipe-details');
  
    var recipeTitle = document.createElement('h3');
    recipeTitle.textContent = recipe.title;
    recipeDetails.appendChild(recipeTitle);
  
    var recipeDescription = document.createElement('p');
    recipeDescription.textContent = recipe.description;
    recipeDetails.appendChild(recipeDescription);
  
    var recipeLink = document.createElement('a');
    recipeLink.href = 'recipe-details.html'; 
    
    recipeLink.textContent = 'View Recipe';
    recipeDetails.appendChild(recipeLink);
  
    recipeCard.appendChild(recipeDetails);
    trendRecipesContainer.appendChild(recipeCard);
  });
  