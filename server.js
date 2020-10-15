// imports
import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

// import routes
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import countryRoutes from "./routes/country.js";

// app
const app = express();
const port = process.env.PORT || 9000;

// app config
app.use(bodyParser.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(cors());

// middlewares

// db config
mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(console.log("Connected to MongoDB ..."));

// routes
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", countryRoutes);

// listening
app.listen(port, () => console.log(`Listening on port ${port}`));
