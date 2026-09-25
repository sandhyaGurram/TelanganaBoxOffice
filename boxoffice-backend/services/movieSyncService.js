import Movie from "../models/Movie.js";
import { getTeluguMovies } from "./tmdbService.js";

export const syncMoviesFromTMDB = async () => {
    try {
        console.log("=================================");
        console.log("Starting TMDB movie sync...");
        console.log("=================================");

        const data = await getTeluguMovies();

        const movies = data.results || [];

        console.log(`TMDB returned ${movies.length} movies`);

        for (const movie of movies) {
            await Movie.findOneAndUpdate(
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
                },
                {
                    upsert: true,
                    new: true,
                }
            );

            console.log(`Saved: ${movie.title}`);
        }

        console.log("=================================");
        console.log(`TMDB sync completed: ${movies.length} movies`);
        console.log("=================================");

    } catch (error) {
        console.error("=================================");
        console.error("MOVIE SYNC FAILED");
        console.error("Message:", error.message);
        console.error("=================================");
    }
};