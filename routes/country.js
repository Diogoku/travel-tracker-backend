import express from "express";

// controllers
import { userById } from "../controlers/user.js";
import { visitCountry, unvisitCountry } from "../controlers/country.js";

// auth
import { requireSignin, isAuth } from "../controlers/auth.js";

// validators
import { countryValidator } from "../validator/index.js";

// router
const router = express.Router();

// routes
router.post(
  "/country/:userId",
  countryValidator,
  requireSignin,
  isAuth,
  visitCountry
);
router.put(
  "/country/:userId",
  countryValidator,
  requireSignin,
  isAuth,
  unvisitCountry
);

router.param("userId", userById);

export default router;
