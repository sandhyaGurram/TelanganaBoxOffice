import dotenv from "dotenv";

dotenv.config();

console.log("Token loaded:", Boolean(process.env.TMDB_ACCESS_TOKEN));
console.log("Token length:", process.env.TMDB_ACCESS_TOKEN?.length);

const url = new URL("https://api.themoviedb.org/3/search/movie");

url.searchParams.set("query", "mandaadi");
url.searchParams.set("include_adult", "false");
url.searchParams.set("language", "en-US");

console.log("URL:", url.toString());

try {
    const response = await fetch(url, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
            accept: "application/json",
        },
    });

    console.log("STATUS:", response.status);

    const data = await response.text();

    console.log("RESPONSE:");
    console.log(data);
} catch (error) {
    console.error("ERROR NAME:", error.name);
    console.error("ERROR MESSAGE:", error.message);
    console.error("ERROR CAUSE:", error.cause);
}