import dotenv from "dotenv";
dotenv.config();

// validator
import expressValidator from "express-validator";
const { validationResult } = expressValidator;

// User model
import User from "../models/user.js";

// error handler
import { errorHandler } from "../helpers/dbErrorHandler.js";

// visited country
export const visitCountry = (req, res) => {
  // validator
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ err: errors.array() });
  }

  // Update user
  const { _id } = req.profile;
  User.findById(_id, (err, user) => {
    if (err || !user) return res.status(400).json({ err: "User not found" });

    const { country } = req.body;

    if (!user.countries.includes(country)) {
      user.countries.push(country);
      user.save((err, user) => {
        if (err) return res.status(400).json({ err: errorHandler(err) });
        user.salt = undefined;
        user.hashed_password = undefined;
        return res.json({ user });
      });
    } else res.status(400).json({ err: `User already visited ${country}` });
  });
};

// unvisit country (user taught he visited the country in question)
export const unvisitCountry = (req, res) => {
  // validator
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("aqui?");
    return res.status(400).json({ err: errors.array() });
  }

  // Update user
  const { _id } = req.profile;
  User.findById(_id, (err, user) => {
    if (err || !user) return res.status(400).json({ err: "User not found" });

    const { country } = req.body;

    const countryIndexOf = user.countries.indexOf(country);
    if (countryIndexOf > -1) {
      user.countries.splice(countryIndexOf, 1);
      user.save((err, user) => {
        if (err) return res.status(400).json({ err: errorHandler(err) });
        user.salt = undefined;
        user.hashed_password = undefined;
        return res.json({ user });
      });
    } else res.status(400).json({ err: `User did not visited ${country}` });
  });
};
