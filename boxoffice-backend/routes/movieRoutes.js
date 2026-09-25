import express from "express";
import Movie from "../models/Movie.js";

import {
    searchMovies,
    getMovieDetails,
} from "../services/tmdbService.js";

const router = express.Router();

router.get("/search", async (req, res) => {
    try {
        const { query } = req.query;

        if (!query) {
            return res.status(400).json({
                success: false,
                message: "Movie search query is required",
            });
        }

        const data = await searchMovies(query);

        res.json({
            success: true,
            results: data.results,
            totalResults: data.total_results,
        });
    } catch (error) {
        console.error("TMDB search error:", error.message);

        res.status(500).json({
            success: false,
            message: "Failed to search movies",
        });
    }
});

router.get("/:movieId", async (req, res) => {
    try {
        const movie = await getMovieDetails(req.params.movieId);

        res.json({
            success: true,
            movie,
        });
    } catch (error) {
        console.error("TMDB movie details error:", error.message);

        res.status(500).json({
            success: false,
            message: "Failed to get movie details",
        });
    }
});



router.post("/save", async (req, res) => {
    try {
        const movie = req.body;

        if (!movie.id || !movie.title) {
            return res.status(400).json({
                success: false,
                message: "Invalid movie data",
            });
        }

        const savedMovie = await Movie.findOneAndUpdate(
            { tmdbId: movie.id },

            {
                tmdbId: movie.id,
                title: movie.title,
                originalTitle: movie.original_title,
                overview: movie.overview,
                releaseDate: movie.release_date,
                originalLanguage: movie.original_language,
                posterPath: movie.poster_path,
                backdropPath: movie.backdrop_path,
                voteAverage: movie.vote_average,
                voteCount: movie.vote_count,
                popularity: movie.popularity,
                genres: movie.genres || [],
            },

            {
                new: true,
                upsert: true,
            }
        );

        res.status(200).json({
            success: true,
            message: "Movie saved successfully",
            movie: savedMovie,
        });
    } catch (error) {
        console.error("Save movie error:", error.message);

        res.status(500).json({
            success: false,
            message: "Failed to save movie",
        });
    }
});


router.get("/", async (req, res) => {
    try {
        const movies = await Movie.find()
            .sort({ releaseDate: -1 });

        res.json({
            success: true,
            count: movies.length,
            movies,
        });
    } catch (error) {
        console.error("Get movies error:", error.message);

        res.status(500).json({
            success: false,
            message: "Failed to get movies",
        });
    }
});


export default router;