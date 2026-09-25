import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import movieRoutes from "./routes/movieRoutes.js";
import connectDB from "./config/db.js";

dotenv.config();

connectDB();

const app = express();


const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/movies", movieRoutes);
// Test route
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Telangana Box Office Backend is running",
    });
});

// Health check
app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "API is healthy",
        time: new Date(),
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});