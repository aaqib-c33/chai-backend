// ApiResponse class API responses ko ek consistent format mein return karne ke liye use hoti hai.
// Yeh success/failure, status code, data aur message ko ek structured way mein handle karti hai.

class ApiResponse {
  constructor(statusCode, data, message = "Success") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }
}

export { ApiResponse };
