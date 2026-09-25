import https from "https";

const TMDB_HOST = "api.themoviedb.org";

const tmdbRequest = (path) => {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: TMDB_HOST,
            path,
            method: "GET",
            headers: {
                Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
                accept: "application/json",
            },
        };

        const request = https.request(options, (response) => {
            let data = "";

            response.on("data", (chunk) => {
                data += chunk;
            });

            response.on("end", () => {
                try {
                    const parsedData = JSON.parse(data);

                    if (response.statusCode >= 400) {
                        console.error("TMDB ERROR:", response.statusCode);
                        console.error(parsedData);

                        return reject(
                            new Error(
                                parsedData.status_message ||
                                `TMDB request failed: ${response.statusCode}`
                            )
                        );
                    }

                    resolve(parsedData);
                } catch (error) {
                    reject(error);
                }
            });
        });

        request.on("error", (error) => {
            console.error("TMDB HTTPS ERROR:", error.message);
            reject(error);
        });

        request.end();
    });
};


export const searchMovies = async (query) => {
    const params = new URLSearchParams({
        query,
        include_adult: "false",
        language: "en-US",
    });

    return await tmdbRequest(`/3/search/movie?${params.toString()}`);
};


export const getMovieDetails = async (movieId) => {
    return await tmdbRequest(
        `/3/movie/${movieId}?language=en-US`
    );
};


export const getIndiaMovies = async () => {
    const params = new URLSearchParams({
        language: "en-US",
        region: "IN",
        sort_by: "popularity.desc",
        include_adult: "false",
        page: "1",
    });

    return await tmdbRequest(
        `/3/discover/movie?${params.toString()}`
    );
};

export const getTeluguMovies = async () => {
    const params = new URLSearchParams({
        language: "en-US",
        region: "IN",
        sort_by: "popularity.desc",
        include_adult: "false",
        with_original_language: "te",
        page: "1",
    });

    return await tmdbRequest(
        `/3/discover/movie?${params.toString()}`
    );
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