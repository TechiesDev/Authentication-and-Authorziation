// validation.js

// Validate email format
const isValidEmail = (email) => {
    // Regular expression for basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  // Validate password strength
  const isValidPassword = (password) => {
    // Password should have at least 8 characters
    return password.length >= 8;
  };
  
  // Validate name format
  const isValidName = (name) => {
    // Name should not be empty and should contain only letters
    return /^[a-zA-Z ]+$/.test(name);
  };
  
  module.exports = {
    isValidEmail,
    isValidPassword,
    isValidName,
  };
  