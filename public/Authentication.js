
  // Registration form submission
  const registrationForm = document.getElementById('registrationForm');
  
  registrationForm.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission
  
    // Get form values
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
  
    // Perform validation and submit the registration data to the server
    // Replace the code below with your actual registration logic, such as making an AJAX request to the server
    console.log('Registration Form Submitted');
    console.log('Username:', username);
    console.log('Email:', email);
    console.log('Password:', password);
  
    // Clear form fields
    registrationForm.reset();
  });
  
  // Login form submission
  const loginForm = document.getElementById('loginForm');
  
  loginForm.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission
  
    // Get form values
    const loginUsername = document.getElementById('loginUsername').value;
    const loginPassword = document.getElementById('loginPassword').value;
  
    // Perform validation and submit the login data to the server
    // Replace the code below with your actual login logic, such as making an AJAX request to the server
    console.log('Login Form Submitted');
    console.log('Username:', loginUsername);
    console.log('Password:', loginPassword);
  
    // Clear form fields
    loginForm.reset();
  });
  
  
  // Event listeners to switch between registration and login forms
  document.getElementById("showRegistration").addEventListener("click", function (event) {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registrationForm').style.display = 'flex';
  });

  document.getElementById('showLogin').addEventListener("click", function showLoginForm() {
    document.getElementById('loginForm').style.display = 'flex';
    document.getElementById('registrationForm').style.display = 'none';
  });
  