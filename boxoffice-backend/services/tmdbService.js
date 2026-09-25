const TMDB_BASE_URL = "https://api.themoviedb.org/3";

const tmdbHeaders = {
    Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
    accept: "application/json",
};

export const searchMovies = async (query) => {
    try {
        const url = new URL(`${TMDB_BASE_URL}/search/movie`);

        url.searchParams.set("query", query);
        url.searchParams.set("include_adult", "false");
        url.searchParams.set("language", "en-US");

        const response = await fetch(url, {
            method: "GET",
            headers: tmdbHeaders,
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("TMDB SEARCH ERROR");
            console.error("Status:", response.status);
            console.error("Response:", data);

            throw new Error(
                data.status_message || `TMDB request failed with ${response.status}`
            );
        }

        return data;
    } catch (error) {
        console.error("TMDB API ERROR");
        console.error("Message:", error.message);

        throw error;
    }
};

export const getMovieDetails = async (movieId) => {
    try {
        const response = await fetch(
            `${TMDB_BASE_URL}/movie/${movieId}?language=en-US`,
            {
                method: "GET",
                headers: tmdbHeaders,
            }
        );

        const data = await response.json();

        if (!response.ok) {
            console.error("TMDB DETAILS ERROR");
            console.error("Status:", response.status);
            console.error("Response:", data);

            throw new Error(
                data.status_message || `TMDB request failed with ${response.status}`
            );
        }

        return data;
    } catch (error) {
        console.error("TMDB DETAILS ERROR");
        console.error("Message:", error.message);

        throw error;
    }
};

export const getIndiaMovies = async () => {
    try {
        const url = new URL(`${TMDB_BASE_URL}/discover/movie`);

        url.searchParams.set("language", "en-US");
        url.searchParams.set("region", "IN");
        url.searchParams.set("sort_by", "popularity.desc");
        url.searchParams.set("include_adult", "false");
        url.searchParams.set("page", "1");

        const response = await fetch(url, {
            method: "GET",
            headers: tmdbHeaders,
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("TMDB DISCOVER ERROR");
            console.error("Status:", response.status);
            console.error("Response:", data);

            throw new Error(
                data.status_message || `TMDB request failed with ${response.status}`
            );
        }

        return data;
    } catch (error) {
        console.error("TMDB DISCOVER ERROR");
        console.error("Message:", error.message);

        throw error;
    }
};




















// import axios from "axios";

// const TMDB_BASE_URL = "https://api.themoviedb.org/3";

// export const searchMovies = async (query) => {
//     try {
//         const response = await axios.get(`${TMDB_BASE_URL}/search/movie`, {
//             params: {
//                 query,
//                 include_adult: false,
//                 language: "en-US",
//             },
//             headers: {
//                 Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
//                 accept: "application/json",
//             },
//         });

//         return response.data;
//     } catch (error) {
//         console.error("TMDB API ERROR");
//         console.error("Status:", error.response?.status);
//         console.error("Response:", error.response?.data);
//         console.error("Message:", error.message);

//         throw error;
//     }
// };

// export const getMovieDetails = async (movieId) => {
//     try {
//         const response = await axios.get(
//             `${TMDB_BASE_URL}/movie/${movieId}`,
//             {
//                 params: {
//                     language: "en-US",
//                 },
//                 headers: {
//                     Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
//                     accept: "application/json",
//                 },
//             }
//         );

//         return response.data;
//     } catch (error) {
//         console.error("TMDB DETAILS ERROR");
//         console.error("Status:", error.response?.status);
//         console.error("Response:", error.response?.data);
//         console.error("Message:", error.message);

//         throw error;
//     }
// };