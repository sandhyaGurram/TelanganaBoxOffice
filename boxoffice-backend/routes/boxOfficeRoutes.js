
import express from "express";

import {
    getApifyMovieBoxOffice,
} from "../services/boxOfficeService.js";

import {
    syncTelanganaBoxOffice,
} from "../services/boxOfficeSyncService.js";


import BoxOfficeSession from "../models/BoxOfficeSession.js";

const router = express.Router();


// ==========================================
// TEST APIFY
// ==========================================

router.get("/test-apify", async (req, res) => {
    try {
        const movie = req.query.movie || "The Paradise";

        const data = await getApifyMovieBoxOffice(movie);

        res.json({
            success: true,
            movie,
            count: data.length,
            data,
        });
    } catch (error) {
        console.error("Box office route error:", error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});


// ==========================================
// SYNC TELANGANA BOX OFFICE
// ==========================================

router.get("/sync-telangana", async (req, res) => {
    try {
        const movie = req.query.movie || "The Paradise";

        const result = await syncTelanganaBoxOffice(movie);

        res.json(result);
    } catch (error) {
        console.error("Telangana sync error:", error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});


router.get("/dashboard", async (req, res) => {
    try {
        const movie = req.query.movie;

        const match = {
            state: "Telangana",
        };

        if (movie) {
            match.movieTitle = movie;
        }

        const stats = await BoxOfficeSession.aggregate([
            {
                $match: match,
            },
            {
                $group: {
                    _id: null,

                    totalShows: {
                        $sum: 1,
                    },

                    totalSeats: {
                        $sum: "$totalSeats",
                    },

                    totalSold: {
                        $sum: "$sold",
                    },

                    totalAvailable: {
                        $sum: "$available",
                    },

                    totalGross: {
                        $sum: "$gross",
                    },
                },
            },
        ]);

        const result = stats[0] || {
            totalShows: 0,
            totalSeats: 0,
            totalSold: 0,
            totalAvailable: 0,
            totalGross: 0,
        };

        const occupancy =
            result.totalSeats > 0
                ? (result.totalSold / result.totalSeats) * 100
                : 0;

        res.json({
            success: true,
            data: {
                totalShows: result.totalShows,
                totalSeats: result.totalSeats,
                totalSold: result.totalSold,
                totalAvailable: result.totalAvailable,
                totalGross: result.totalGross,
                occupancy: Number(occupancy.toFixed(2)),
            },
        });
    } catch (error) {
        console.error("Dashboard error:", error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});




export default router;















// import express from "express";
// import { getApifyMovieBoxOffice, getTelanganaBoxOffice } from "../services/boxOfficeService.js";

// const router = express.Router();

// router.get("/test-apify", async (req, res) => {
//     try {
//         const movie = req.query.movie || "The Paradise";

//         const data = await getApifyMovieBoxOffice(movie);

//         res.json({
//             success: true,
//             movie,
//             count: data.length,
//             data,
//         });

//     } catch (error) {
//         console.error("Box office route error:", error);

//         res.status(500).json({
//             success: false,
//             message: error.message,
//         });
//     }
// });

// router.get("/telangana", async (req, res) => {
//     try {
//         const movie = req.query.movie || "The Paradise";

//         const result = await getTelanganaBoxOffice(movie);

//         res.json({
//             success: true,
//             movie,
//             ...result
//         });

//     } catch (error) {
//         console.error("Telangana box office error:", error);

//         res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// });


// export default router;