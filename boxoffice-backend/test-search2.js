import dotenv from "dotenv";
import https from "https";

dotenv.config();

const token = process.env.TMDB_ACCESS_TOKEN;

const options = {
    hostname: "api.themoviedb.org",
    path: "/3/search/movie?query=test",
    method: "GET",
    headers: {
        Authorization: `Bearer ${token}`,
        accept: "application/json",
    },
};

console.log("Testing TMDB search with Node https...");

const request = https.request(options, (response) => {
    console.log("STATUS:", response.statusCode);

    let data = "";

    response.on("data", (chunk) => {
        data += chunk;
    });

    response.on("end", () => {
        console.log("RESPONSE:", data);
    });
});

request.on("error", (error) => {
    console.error("ERROR:", error);
    console.error("CAUSE:", error.cause);
});

request.end();