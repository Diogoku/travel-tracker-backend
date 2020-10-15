import express from "express";

// controllers
import { signup, signin, signout } from "../controlers/auth.js";

// validators
import { userSignupValidator } from "../validator/index.js";

// router
const router = express.Router();

// routes
router.post("/signup", userSignupValidator, signup);
router.post("/signin", signin);
router.get("/signout", signout);

export default router;
