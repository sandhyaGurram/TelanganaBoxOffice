import dotenv from "dotenv";

dotenv.config();



const response = await fetch(
    "https://api.themoviedb.org/3/configuration",
    {
        headers: {
            Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
            accept: "application/json",
        },
    }
);

console.log("Status:", response.status);
console.log("Response:", await response.text());