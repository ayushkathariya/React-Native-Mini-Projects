import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRouter from "./routes/auth.route";
import { authMiddleware } from "./middlewares/auth.middleware";

const app = express();

// Configuration
dotenv.config();

// Middlewares
app.use(express.json());
app.use(cors());

// Routes
app.use("/api", authRouter);

app.get("/", async (req, res) => {
  return res.json({
    message: "Hello from server",
  });
});

app.get("/api/me", authMiddleware, async (req, res) => {
  try {
    return res.json({
      user: req.user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
});

app.listen(3000, () => {
  console.log(`Listening at port 3000`);
});
