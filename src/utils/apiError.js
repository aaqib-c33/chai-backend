class ApiError extends Error {
  constructor(
    statusCode, // HTTP status code (e.g., 400, 500, etc.)
    message = "Something went wrong", // Default error message agar koi custom message nahi diya
    errors = [], // Additional errors ka array
    stack = "" // Stack trace, agar diya gaya ho toh
  ) {
    super(message); // Parent class (Error) ka constructor call karna with the message

    // Custom properties
    this.statusCode = statusCode; // Status code set karte hain
    this.data = null; // Additional data (optional)
    this.message = message; // Error message
    this.success = false; // Indicating failure
    this.errors = errors; // Array of specific errors

    // Agar stack trace diya gaya ho toh usse set karte hain, nahi toh automatic capture karte hain
    if (stack) {
      this.stack = stack;
    } else {
      // Capture stack trace if not provided
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };
