import axios from "axios";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";

export const searchMovies = async (query) => {
    try {
        const response = await axios.get(`${TMDB_BASE_URL}/search/movie`, {
            params: {
                query,
                include_adult: false,
                language: "en-US",
            },
            headers: {
                Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
                accept: "application/json",
            },
        });

        return response.data;
    } catch (error) {
        console.error("TMDB API ERROR");
        console.error("Status:", error.response?.status);
        console.error("Response:", error.response?.data);
        console.error("Message:", error.message);

        throw error;
    }
};

export const getMovieDetails = async (movieId) => {
    try {
        const response = await axios.get(
            `${TMDB_BASE_URL}/movie/${movieId}`,
            {
                params: {
                    language: "en-US",
                },
                headers: {
                    Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
                    accept: "application/json",
                },
            }
        );

        return response.data;
    } catch (error) {
        console.error("TMDB DETAILS ERROR");
        console.error("Status:", error.response?.status);
        console.error("Response:", error.response?.data);
        console.error("Message:", error.message);

        throw error;
    }
};