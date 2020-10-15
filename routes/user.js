import express from "express";

// controllers
import { userById } from "../controlers/user.js";

import { requireSignin, isAuth } from "../controlers/auth.js";

// router
const router = express.Router();

// routes
router.get("/secret/:userId", requireSignin, isAuth, (req, res) => {
  res.json({ user: req.profile });
});

router.param("userId", userById);

export default router;
