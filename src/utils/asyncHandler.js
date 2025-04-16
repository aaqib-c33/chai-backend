const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    // Hum requestHandler ko Promise.resolve() mein wrap kar rahe hain.
    // Agar requestHandler successfully execute hota hai (resolve ho jata hai),
    // toh catch block execute nahi hoga.
    // Agar requestHandler mein koi error aata hai, toh wo catch block mein chala jayega.
    Promise.resolve(requestHandler(req, res, next)).catch((err) => {
      // Agar koi error aata hai, toh wo next() ke through error-handling middleware ko pass kar diya jata hai.
      next(err);
    });
  };
};

export { asyncHandler };

/*const asyncHandler = (fn) => async (req, res, next) => {
  try {
       fn ko await kiya gaya hai, jo ki asynchronous function hai.
       Yeh request aur response object ke saath call kiya jata hai.
      await fn(req, res, next)
  } catch (error) {
       Agar koi error hota hai toh catch block execute hota hai
       aur error response ko client ke paas send kiya jata hai.
      res.status(err.code || 500).json({
          success: false,
          message: err.message
      })
  }
}
*/
