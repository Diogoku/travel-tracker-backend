import dotenv from "dotenv";
dotenv.config();

// validator
import expressValidator from "express-validator";
const { validationResult } = expressValidator;

// token
import jwt from "jsonwebtoken"; // to generate signed token
import expressJwt from "express-jwt"; // for authorization check

// User model
import User from "../models/user.js";

// error handler
import { errorHandler } from "../helpers/dbErrorHandler.js";

// signup
export const signup = (req, res) => {
  // validator
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // create user
  const user = new User(req.body);
  user.save((err, user) => {
    if (err) return res.status(400).json({ err: errorHandler(err) });
    user.salt = undefined;
    user.hashed_password = undefined;
    res.json({ user });
  });
};

// signin
export const signin = (req, res) => {
  // find the user based on email
  const { email, password } = req.body;
  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res
        .status(400)
        .json({ err: "User with that email does not exist. Please signup" });
    }

    // if user is found check if email and password match
    // create authenticate method in user model
    if (!user.authenticate(password))
      return res.status(401).json({ err: "Email and password dont match" });

    // generate a signed token with user id and secret
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    // persist the token as token in cookie with expiry date
    res.cookie("token", token, { expire: new Date() + 9999 });
    // return response with user and token to frontend client
    const { _id, name, email, role, countries } = user;
    return res.json({ token, user: { _id, name, email, role, countries } });
  });
};

// signout
export const signout = (req, res) => {
  res.clearCookie("token");
  res.json({ msg: "Signout success" });
};

// require signin
export const requireSignin = expressJwt({
  secret: process.env.JWT_SECRET,
  userProperty: "auth",
  algorithms: [process.env.ALGORITHMS],
});

// is auth
export const isAuth = (req, res, next) => {
  let user = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!user) return res.status(403).json({ err: "Access denied" });
  next();
};

// is admin
export const isAdmin = (req, res, next) => {
  if (req.profile.role === 0)
    return res.status(403).json({ err: "Admin resource! Access denied" });
  next();
};
