// src/utils/validation.js

export const isValidEmail = (email) => {
    // Simple email validation regex
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };
  
  export const isPasswordStrong = (password) => {
    // Password must be at least 8 characters, include uppercase, lowercase, and special character
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/;
    return re.test(password);
  };
  