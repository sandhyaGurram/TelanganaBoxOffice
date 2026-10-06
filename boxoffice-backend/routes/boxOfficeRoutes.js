import express from "express";
import { getApifyMovieBoxOffice } from "../services/boxOfficeService.js";

const router = express.Router();

router.get("/test-apify", async (req, res) => {
    try {
        const movie = req.query.movie || "The Paradise";

        const data = await getApifyMovieBoxOffice(movie);

        res.json({
            success: true,
            movie,
            count: data.length,
            data,
        });

    } catch (error) {
        console.error("Box office route error:", error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

export default router;