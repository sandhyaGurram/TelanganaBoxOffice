import https from "https";
import { ApifyClient } from "apify-client";

const BFILMY_HOST = "bfilmy.pages.dev";

// ======================================================
// BFILMY
// ======================================================

const bfilmyRequest = (path) => {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: BFILMY_HOST,
            path,
            method: "GET",
            headers: {
                "X-API-KEY": process.env.BFILMY_API_KEY,
                Accept: "application/json",
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
                        console.error("BFILMY ERROR:", response.statusCode);
                        console.error(parsedData);

                        return reject(
                            new Error(
                                parsedData.message ||
                                `BFilmy request failed: ${response.statusCode}`
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
            console.error("BFILMY HTTPS ERROR:", error.message);
            reject(error);
        });

        request.end();
    });
};

export const getMovieBoxOffice = async (movie) => {
    const params = new URLSearchParams({
        movie,
    });

    return await bfilmyRequest(
        `/movie?${params.toString()}`
    );
};


// ======================================================
// APIFY
// ======================================================

export const getApifyMovieBoxOffice = async (movie) => {
    try {
        if (!process.env.APIFY_API_TOKEN) {
            throw new Error("APIFY_API_TOKEN is missing in .env");
        }

        const client = new ApifyClient({
            token: process.env.APIFY_API_TOKEN,
        });

        const input = {
            movieTitles: [movie],
            dates: ["today"],
        };

        console.log("Starting Apify Actor...");
        console.log("Movie:", movie);

        const run = await client
            .actor("monknwarriors/indian-boxoffice-tracker")
            .call(input);

        console.log("Apify run completed.");
        console.log("Dataset ID:", run.defaultDatasetId);

        const { items } = await client
            .dataset(run.defaultDatasetId)
            .listItems();

        console.log("Apify items received:", items.length);

        return items;

    } catch (error) {
        console.error("APIFY ERROR:", error.message);
        throw error;
    }
};


export const getTelanganaBoxOffice = async (movie) => {
    const items = await getApifyMovieBoxOffice(movie);

    const telanganaItems = items.filter(
        (item) =>
            item.state?.toLowerCase() === "telangana"
    );

    const summary = {
        total: telanganaItems.length,

        rowTypes: {
            SUMMARY: telanganaItems.filter(
                item => item.row_type === "SUMMARY"
            ).length,

            CITY_BREAKDOWN: telanganaItems.filter(
                item => item.row_type === "CITY_BREAKDOWN"
            ).length,

            SESSION: telanganaItems.filter(
                item => item.row_type === "SESSION"
            ).length,
        },

        cities: [
            ...new Set(
                telanganaItems
                    .map(item => item.city)
                    .filter(Boolean)
            )
        ],
    };

    return {
        summary,
        data: telanganaItems,
    };
};












// import https from "https";

// const BFILMY_HOST = "bfilmy.pages.dev";

// const bfilmyRequest = (path) => {
//     return new Promise((resolve, reject) => {
//         const options = {
//             hostname: BFILMY_HOST,
//             path,
//             method: "GET",
//             headers: {
//                 "X-API-KEY": process.env.BFILMY_API_KEY,
//                 Accept: "application/json",
//             },
//         };

//         const request = https.request(options, (response) => {
//             let data = "";

//             response.on("data", (chunk) => {
//                 data += chunk;
//             });

//             response.on("end", () => {
//                 try {
//                     const parsedData = JSON.parse(data);

//                     if (response.statusCode >= 400) {
//                         console.error("BFILMY ERROR:", response.statusCode);
//                         console.error(parsedData);

//                         return reject(
//                             new Error(
//                                 parsedData.message ||
//                                 `BFilmy request failed: ${response.statusCode}`
//                             )
//                         );
//                     }

//                     resolve(parsedData);
//                 } catch (error) {
//                     reject(error);
//                 }
//             });
//         });

//         request.on("error", (error) => {
//             console.error("BFILMY HTTPS ERROR:", error.message);
//             reject(error);
//         });

//         request.end();
//     });
// };

// export const getMovieBoxOffice = async (movie) => {
//     const params = new URLSearchParams({
//         movie,
//     });

//     return await bfilmyRequest(
//         `/movie?${params.toString()}`
//     );
// };