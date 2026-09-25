import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import movieRoutes from "./routes/movieRoutes.js";
import connectDB from "./config/db.js";
import { syncMoviesFromTMDB } from "./services/movieSyncService.js";

dotenv.config();

console.log(
    "TMDB token loaded:",
    Boolean(process.env.TMDB_ACCESS_TOKEN),
    "length:",
    process.env.TMDB_ACCESS_TOKEN?.length
);


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

const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, async () => {
            console.log(`Server running on http://localhost:${PORT}`);

            await syncMoviesFromTMDB();
        });
    } catch (error) {
        console.error("Server startup failed:", error.message);
    }
};

startServer();

// connectDB();

// const app = express();


// const PORT = process.env.PORT || 5000;

// // Middleware
// app.use(cors());
// app.use(express.json());
// app.use("/api/movies", movieRoutes);
// // Test route
// app.get("/", (req, res) => {
//     res.json({
//         success: true,
//         message: "Telangana Box Office Backend is running",
//     });
// });

// // Health check
// app.get("/api/health", (req, res) => {
//     res.json({
//         success: true,
//         message: "API is healthy",
//         time: new Date(),
//     });
// });

// app.listen(PORT, () => {
//     console.log(`Server running on http://localhost:${PORT}`);
// });