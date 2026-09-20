import cors from "cors";
import dotenv from "dotenv";
import express from "express";

import connectDB from "./config/db.js";
import gameRoutes from "./routes/gameRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use((request, response, next) => {
  console.log(`[API] ${request.method} ${request.originalUrl}`);
  next();
});
app.use("/api/users", userRoutes);
app.use("/api/games", gameRoutes);

app.get("/api/health", (request, response) => {
  response.json({ message: "CourtMate API is running" });
});

async function startServer() {
  try {
    await connectDB();

    app.listen(port, () => {
      console.log(`CourtMate API listening on port ${port}`);
    });
  } catch (error) {
    console.error("Unable to start CourtMate API:", error.message);
    process.exit(1);
  }
}

startServer();
