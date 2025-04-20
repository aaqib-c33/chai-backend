import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
  })
);

app.use(express.json({ limit: "16kb" })); //Ye middleware JSON data ko parse karta hai jo client se aata hai (e.g., React se form submit).
app.use(express.urlencoded({ extended: true, limit: "16kb" })); //Ye middleware HTML form se aayi data ko parse karta hai (like x-www-form-urlencoded format).
app.use(express.static("public")); //Ye Express ko batata hai ki public folder ke andar ke files (images, CSS, JS) ko publicly serve karo.
app.use(cookieParser()); //Ye middleware cookies ko read karta hai jo client request me hoti hain.

//Routes Import
import userRouter from "./routes/user.routes.js";

//Routes Declaration
app.use("/api/v1/users", userRouter);

export { app };
