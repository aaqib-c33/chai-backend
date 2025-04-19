/*Ye User model basically users ke data ko manage karta hai jo system ya application mein register karte hain. Is model ka kaam hai user-related operations ko handle karna, jaise:

1. User Registration: Jab user apna account banata hai, toh yeh model uska username, email, password, etc. store karta hai. Password ko bcrypt se hash karke database mein save karta hai taaki wo secure rahe.

2. User Authentication: Jab user login karta hai, toh password ko bcrypt ke through compare karke correctness check kiya jata hai. Agar password match hota hai toh user ko Access Token (JWT) aur Refresh Token generate karke diya jata hai. Yeh tokens user ko authenticate karte hain, taaki user ki identity verify ho sake bina baar-baar login karne ke.

3. Session Management: Refresh token ke zariye session ko extend kiya ja sakta hai bina dobara login kiye. Access token ki expiry ke baad refresh token ko use karke naya access token generate kiya ja sakta hai.*/

import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// Mongoose ka schema banaya user ke liye
const userSchema = new Schema(
  {
    // unique username jo lowercase aur trimmed hoga
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true, // query fast karne ke liye index
    },
    // unique email, lowercase aur trimmed
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    // full name of user, trimmed and indexed for faster search
    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    // user ka profile photo (cloudinary ka url hoga)
    avatar: {
      type: String,
      required: true,
    },
    // optional cover photo
    coverImage: {
      type: String,
    },
    // videos ka history jisme user ne dekha hoga
    watchHistory: [
      {
        type: Schema.Types.ObjectId, // har ek video ka id
        ref: "Video", // "Video" collection se relation
      },
    ],
    // user ka password
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    // refresh token for session management
    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true, // createdAt aur updatedAt automatic aa jayega
  }
);

//----------> Save hone se pehle password ko hash karne wala middleware
userSchema.pre("save", async function (next) {
  // agar password change nahi hua to next()
  if (!this.isModified("password")) return next();

  // password ko bcrypt se hash kar rahe hain (10 is salt rounds)
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

//-----------> Method to check if password is correct or not (login ke time)
userSchema.methods.isPasswordCorrect = async function (password) {
  // entered password ko compare karega saved (hashed) password se
  return await bcrypt.compare(password, this.password);
};

//------------> Method to generate Access Token (JWT) for authentication
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullName: this.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET, // secret key from .env
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY, // expiry time from .env
    }
  );
};

//------------> Method to generate Refresh Token for longer session validity
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET, // secret key for refresh token
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY, // expiry time
    }
  );
};

// Final model export kiya jise baaki jagah import kar sakte hain
export const User = mongoose.model("User", userSchema);
