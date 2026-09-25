import dotenv from "dotenv";

dotenv.config();

console.log("Token loaded:", Boolean(process.env.TMDB_ACCESS_TOKEN));
console.log("Token length:", process.env.TMDB_ACCESS_TOKEN?.length);

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