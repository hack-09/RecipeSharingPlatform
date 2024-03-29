# Recipe Sharing Platform

Welcome to Recipe Sharing Platform! This web application allows users to share their favorite food recipes with others, explore recipes shared by the community, leave comments, and provide ratings. Whether you're a cooking enthusiast or someone looking for new culinary inspiration, this platform has something for everyone.

## Features

- **User Authentication**: Secure user authentication system allowing users to sign up, log in, and manage their accounts.
- **Recipe Sharing**: Users can create, edit, and delete their own recipes, complete with ingredients, cooking instructions, and images.
- **Explore Recipes**: Browse a diverse collection of recipes shared by other users to discover new dishes and cooking techniques.
- **Comments**: Engage with the community by leaving comments on recipes, sharing tips, and asking questions.
- **Rating System**: Rate recipes based on your experience and see the average rating provided by other users.

## Technologies Used

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express.js, MongoDB
- **Authentication**: MongoDB to store user credentials
- **Database**: MongoDB Atlas
- **Other Tools**: Redux for state management, Axios for HTTP requests, React Router for navigation.

## Getting Started

To run the Recipe Sharing Platform locally on your machine, follow these steps:

1. Clone the repository:

   ```
   git clone https://github.com/hack-09/RecipeSharingPlatform.git
   ```

2. Navigate to the project directory:

   ```
   cd recipe-sharing-platform
   ```

3. Install dependencies for both the frontend and backend:

   ```
   cd client
   npm install
   cd ../server
   npm install
   ```

4. Set up environment variables:
   - Create a `.env` file in the `server` directory.
   - Define environment variables such as `PORT`, `MONGODB_URI`, and `JWT_SECRET`.

5. Start the backend server:

   ```
   npm start
   ```

6. Start the frontend development server:

   ```
   cd ../client
   npm start
   ```

7. Access the application in your web browser at `http://localhost:3000`.

## Contributing

Contributions are welcome! If you have suggestions for new features, bug fixes, or improvements, feel free to open an issue or submit a pull request. Please follow the [Contributing Guidelines](CONTRIBUTING.md) when making contributions.

## License

This project is licensed under the [MIT License](LICENSE).
