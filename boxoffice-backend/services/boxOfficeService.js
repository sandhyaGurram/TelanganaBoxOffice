import https from "https";

const BFILMY_HOST = "bfilmy.pages.dev";

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