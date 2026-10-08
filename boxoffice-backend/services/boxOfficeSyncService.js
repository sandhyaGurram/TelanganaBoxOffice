import BoxOfficeSession from "../models/BoxOfficeSession.js";
import { getApifyMovieBoxOffice } from "./boxOfficeService.js";


export const syncTelanganaBoxOffice = async (movie) => {
    console.log("====================================");
    console.log("Starting Telangana box-office sync");
    console.log("Movie:", movie);
    console.log("====================================");

    // 1. Get data from Apify
    const items = await getApifyMovieBoxOffice(movie);

    console.log("Total Apify records:", items.length);

    // 2. Only SESSION records
    const sessions = items.filter(
        (item) =>
            item.row_type === "SESSION" &&
            item.state?.toLowerCase() === "telangana"
    );

    console.log("Telangana SESSION records:", sessions.length);

    if (sessions.length === 0) {
        return {
            success: true,
            message: "No Telangana session records found",
            total: 0,
        };
    }

    // 3. Convert Apify data into our database structure
    const normalizedSessions = sessions.map((item) => {
        const city = item.city?.trim();



        const totalSeats = Number(item.total_seats || 0);
        const sold = Number(item.sold || 0);

        let available = item.available;

        if (
            available === null ||
            available === undefined ||
            available === ""
        ) {
            available = totalSeats - sold;
        }

        return {
            movieTitle: item.movie_title || movie,

            showDate: formatShowDate(item.show_date),

            showTime: item.time || null,

            state: item.state || "Telangana",

            city: item.city?.trim(),

            chain: item.chain || null,

            venue: item.venue || "Unknown",

            venueId: item.venue_id || null,

            sessionId: item.session_id,

            auditorium: item.audi || null,

            format: item.format || null,

            language: item.language || null,

            totalSeats: Number(item.total_seats || 0),

            sold: Number(item.sold || 0),

            available: Number(
                item.available ??
                (
                    Number(item.total_seats || 0) -
                    Number(item.sold || 0)
                )
            ),

            occupancy: Number(item.occupancy_pct || 0),

            gross: Number(item.gross || 0),

            source: item.source || null,

            scrapedAt: item.scraped_at
                ? new Date(item.scraped_at)
                : null,

            syncedAt: new Date(),
        };
    });

    // 4. Save / update records
    const operations = normalizedSessions.map((session) => ({
        updateOne: {
            filter: {
                movieTitle: session.movieTitle,
                showDate: session.showDate,
                sessionId: session.sessionId,
            },

            update: {
                $set: session,
            },

            upsert: true,
        },
    }));

    const result = await BoxOfficeSession.bulkWrite(operations);

    console.log("====================================");
    console.log("Sync completed");
    console.log("Inserted:", result.upsertedCount);
    console.log("Updated:", result.modifiedCount);
    console.log("Matched:", result.matchedCount);
    console.log("====================================");

    return {
        success: true,
        movie,
        totalFromApify: items.length,
        totalTelanganaSessions: sessions.length,
        inserted: result.upsertedCount,
        updated: result.modifiedCount,
        matched: result.matchedCount,
    };
};


// Convert 20261006 → 2026-10-06
const formatShowDate = (date) => {
    if (!date) {
        return null;
    }

    const value = String(date);

    if (value.length === 8) {
        return `${value.substring(0, 4)}-${value.substring(
            4,
            6
        )}-${value.substring(6, 8)}`;
    }

    return value;
};