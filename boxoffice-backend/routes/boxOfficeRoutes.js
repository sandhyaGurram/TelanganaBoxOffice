
import express from "express";

import {
    getApifyMovieBoxOffice,
} from "../services/boxOfficeService.js";

import {
    syncTelanganaBoxOffice,
} from "../services/boxOfficeSyncService.js";
import {
    getAllDistricts,
    getCitiesByDistrict,
} from "../utils/districtUtils.js";

import { getDistrictFromCity } from "../utils/districtUtils.js";

import BoxOfficeSession from "../models/BoxOfficeSession.js";

const router = express.Router();


// ==========================================
// TEST APIFY
// ==========================================

router.get("/test-apify", async (req, res) => {
    try {
        const data =
            await getApifyMovieBoxOffice();

        const movies = [
            ...new Set(
                data
                    .map(
                        (item) =>
                            item.movie_title
                    )
                    .filter(Boolean)
            ),
        ];

        res.json({
            success: true,

            movieCount:
                movies.length,

            movies,

            count:
                data.length,

            data,
        });

    } catch (error) {
        console.error(
            "Box office route error:",
            error
        );

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
        const result =
            await syncTelanganaBoxOffice();

        res.json(result);

    } catch (error) {
        console.error(
            "Telangana sync error:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});





const escapeRegex = (value = "") =>
    String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const buildSessionMatch = (query = {}) => {
    const match = {
        state: "Telangana",
    };

    // Keep the dashboard restricted to Telugu movies.
    match.language = {
        $regex: "^Telugu$",
        $options: "i",
    };

    if (query.district) {
        match.district = {
            $regex: `^${escapeRegex(query.district.trim())}$`,
            $options: "i",
        };
    }

    if (query.city) {
        match.city = {
            $regex: `^${escapeRegex(query.city.trim())}$`,
            $options: "i",
        };
    }

    if (query.date) {
        match.showDate = query.date;
    }

    if (query.search?.trim()) {
        const searchRegex = {
            $regex: escapeRegex(query.search.trim()),
            $options: "i",
        };

        match.$or = [
            { movieTitle: searchRegex },
            { district: searchRegex },
            { city: searchRegex },
            { venue: searchRegex },
        ];
    }

    return match;
};






router.get("/dashboard", async (req, res) => {
    try {
        const match = buildSessionMatch(req.query);

        const stats = await BoxOfficeSession.aggregate([
            { $match: match },
            {
                $group: {
                    _id: null,
                    totalShows: { $sum: 1 },
                    totalSeats: { $sum: "$totalSeats" },
                    totalSold: { $sum: "$sold" },
                    totalAvailable: { $sum: "$available" },
                    totalGross: { $sum: "$gross" },
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

        const occupancy = result.totalSeats > 0
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






router.get("/cities", async (req, res) => {
    try {
        const movie = req.query.movie;

        const match = {
            state: "Telangana",
        };

        if (movie) {
            match.movieTitle = movie;
        }

        const cities = await BoxOfficeSession.aggregate([
            {
                $match: match,
            },

            {
                $group: {
                    _id: "$city",

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

                    theatres: {
                        $addToSet: "$venue",
                    },
                },
            },

            {
                $project: {
                    _id: 0,

                    city: "$_id",

                    totalShows: 1,

                    totalSeats: 1,

                    totalSold: 1,

                    totalAvailable: 1,

                    totalGross: 1,

                    totalTheatres: {
                        $size: "$theatres",
                    },

                    occupancy: {
                        $cond: [
                            {
                                $gt: ["$totalSeats", 0],
                            },
                            {
                                $multiply: [
                                    {
                                        $divide: [
                                            "$totalSold",
                                            "$totalSeats",
                                        ],
                                    },
                                    100,
                                ],
                            },
                            0,
                        ],
                    },
                },
            },

            {
                $sort: {
                    totalGross: -1,
                },
            },
        ]);

        const formattedCities = cities.map(
            (city) => ({
                ...city,

                occupancy: Number(
                    city.occupancy.toFixed(2)
                ),
            })
        );

        res.json({
            success: true,
            count: formattedCities.length,
            data: formattedCities,
        });

    } catch (error) {
        console.error(
            "City API error:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});





router.get("/cities/:city", async (req, res) => {
    try {
        const city = req.params.city;

        const sessions = await BoxOfficeSession.find({
            state: "Telangana",
            city: {
                $regex: `^${city}$`,
                $options: "i",
            },
        })
            .sort({
                showDate: -1,
                showTime: 1,
            })
            .lean();

        const totalShows = sessions.length;

        const totalSeats = sessions.reduce(
            (sum, session) =>
                sum + Number(session.totalSeats || 0),
            0
        );

        const totalSold = sessions.reduce(
            (sum, session) =>
                sum + Number(session.sold || 0),
            0
        );

        const totalAvailable = sessions.reduce(
            (sum, session) =>
                sum + Number(session.available || 0),
            0
        );

        const totalGross = sessions.reduce(
            (sum, session) =>
                sum + Number(session.gross || 0),
            0
        );

        const occupancy =
            totalSeats > 0
                ? (totalSold / totalSeats) * 100
                : 0;

        const theatres = [
            ...new Set(
                sessions
                    .map((session) => session.venue)
                    .filter(Boolean)
            ),
        ];

        const movies = [
            ...new Set(
                sessions
                    .map((session) => session.movieTitle)
                    .filter(Boolean)
            ),
        ];

        res.json({
            success: true,

            city,

            summary: {
                totalShows,
                totalSeats,
                totalSold,
                totalAvailable,
                totalGross,
                occupancy: Number(
                    occupancy.toFixed(2)
                ),
                totalTheatres: theatres.length,
                totalMovies: movies.length,
            },

            theatres,

            movies,

            sessions,
        });

    } catch (error) {
        console.error(
            "City details error:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});


router.get("/theatres/:city/:venue", async (req, res) => {
    try {
        const { city, venue } = req.params;

        const sessions = await BoxOfficeSession.find({
            state: "Telangana",

            city: {
                $regex: `^${city}$`,
                $options: "i",
            },

            venue: {
                $regex: `^${venue}$`,
                $options: "i",
            },
        })
            .sort({
                showDate: -1,
                showTime: 1,
            })
            .lean();

        if (!sessions.length) {
            return res.status(404).json({
                success: false,
                message: "Theatre data not found",
            });
        }

        const totalShows = sessions.length;

        const totalSeats = sessions.reduce(
            (sum, session) =>
                sum + Number(session.totalSeats || 0),
            0
        );

        const totalSold = sessions.reduce(
            (sum, session) =>
                sum + Number(session.sold || 0),
            0
        );

        const totalAvailable = sessions.reduce(
            (sum, session) =>
                sum + Number(session.available || 0),
            0
        );

        const totalGross = sessions.reduce(
            (sum, session) =>
                sum + Number(session.gross || 0),
            0
        );

        const occupancy =
            totalSeats > 0
                ? (totalSold / totalSeats) * 100
                : 0;

        const movies = [
            ...new Set(
                sessions
                    .map((session) => session.movieTitle)
                    .filter(Boolean)
            ),
        ];

        res.json({
            success: true,

            city,

            venue,

            summary: {
                totalShows,
                totalSeats,
                totalSold,
                totalAvailable,
                totalGross,

                occupancy: Number(
                    occupancy.toFixed(2)
                ),

                totalMovies: movies.length,
            },

            movies,

            sessions,
        });

    } catch (error) {
        console.error(
            "Theatre details error:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});



router.get("/shows/:sessionId", async (req, res) => {
    try {
        const { sessionId } = req.params;

        const session = await BoxOfficeSession.findOne({
            sessionId,
        }).lean();

        if (!session) {
            return res.status(404).json({
                success: false,
                message: "Show not found",
            });
        }

        res.json({
            success: true,
            data: session,
        });

    } catch (error) {
        console.error(
            "Show details error:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});






router.get("/districts", async (req, res) => {
    try {
        const match = buildSessionMatch(req.query);

        const districts = await BoxOfficeSession.aggregate([
            { $match: match },
            {
                $group: {
                    _id: "$district",
                    totalShows: { $sum: 1 },
                    totalSold: { $sum: "$sold" },
                    totalSeats: { $sum: "$totalSeats" },
                    totalGross: { $sum: "$gross" },
                    theatres: { $addToSet: "$venue" },
                    cities: { $addToSet: "$city" },
                },
            },
            {
                $project: {
                    _id: 0,
                    district: "$_id",
                    totalShows: 1,
                    totalSold: 1,
                    totalSeats: 1,
                    totalGross: 1,
                    theatreCount: { $size: "$theatres" },
                    cityCount: { $size: "$cities" },
                    occupancy: {
                        $cond: [
                            { $gt: ["$totalSeats", 0] },
                            {
                                $multiply: [
                                    {
                                        $divide: [
                                            "$totalSold",
                                            "$totalSeats",
                                        ],
                                    },
                                    100,
                                ],
                            },
                            0,
                        ],
                    },
                },
            },
            { $sort: { totalGross: -1 } },
        ]);

        res.json({
            success: true,
            count: districts.length,
            districts: districts.map((district) => ({
                ...district,
                occupancy: Number(district.occupancy.toFixed(2)),
            })),
        });
    } catch (error) {
        console.error("District performance error:", error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});





router.get("/districts/:district", async (req, res) => {
    try {
        const district = decodeURIComponent(req.params.district);

        const cities = await BoxOfficeSession.aggregate([
            {
                $match: {
                    district: {
                        $regex: `^${district}$`,
                        $options: "i",
                    },
                },
            },
            {
                $group: {
                    _id: "$city",

                    totalShows: {
                        $sum: 1,
                    },

                    totalSold: {
                        $sum: "$sold",
                    },

                    totalGross: {
                        $sum: "$gross",
                    },

                    theatres: {
                        $addToSet: "$venue",
                    },
                },
            },
            {
                $project: {
                    _id: 0,

                    city: "$_id",

                    totalShows: 1,

                    totalSold: 1,

                    totalGross: 1,

                    theatreCount: {
                        $size: "$theatres",
                    },
                },
            },

            {
                $sort: {
                    city: 1,
                },
            },
        ]);

        res.json({
            success: true,
            district,
            cities,
        });
    } catch (error) {
        console.error("District cities error:", error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});



router.get("/fix-districts", async (req, res) => {
    try {
        const sessions = await BoxOfficeSession.find({});

        let updated = 0;
        let unmapped = 0;

        const unmappedCities = new Set();

        for (const session of sessions) {
            const district = getDistrictFromCity(session.city);

            if (!district) {
                unmapped++;

                if (session.city) {
                    unmappedCities.add(session.city);
                }

                continue;
            }

            if (session.district !== district) {
                await BoxOfficeSession.updateOne(
                    { _id: session._id },
                    {
                        $set: {
                            district,
                        },
                    }
                );

                updated++;
            }
        }

        res.json({
            success: true,
            totalRecords: sessions.length,
            updated,
            unmapped,
            unmappedCities: [...unmappedCities],
        });
    } catch (error) {
        console.error("Fix districts error:", error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});


router.get("/debug-hyderabad", async (req, res) => {
    try {
        const records = await BoxOfficeSession.find({
            city: {
                $regex: "^Hyderabad$",
                $options: "i",
            },
        })
            .select("movieTitle city district venue showDate showTime")
            .lean();

        res.json({
            success: true,
            count: records.length,
            records,
        });
    } catch (error) {
        console.error("Hyderabad debug error:", error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});


router.get("/fix-hyderabad", async (req, res) => {
    try {
        const result = await BoxOfficeSession.updateMany(
            {
                city: {
                    $regex: "^Hyderabad$",
                    $options: "i",
                },
            },
            {
                $set: {
                    district: "Hyderabad",
                },
            }
        );

        res.json({
            success: true,
            matched: result.matchedCount,
            modified: result.modifiedCount,
        });
    } catch (error) {
        console.error("Fix Hyderabad error:", error);

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