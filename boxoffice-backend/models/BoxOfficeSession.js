import mongoose from "mongoose";

const boxOfficeSessionSchema = new mongoose.Schema(
    {
        movieTitle: {
            type: String,
            required: true,
            index: true,
        },

        showDate: {
            type: String,
            required: true,
            index: true,
        },

        showTime: {
            type: String,
            required: true,
        },

        state: {
            type: String,
            default: "Telangana",
            index: true,
        },

        district: {
            type: String,
            default: null,
            index: true,
        },

        city: {
            type: String,
            required: true,
            index: true,
        },

        chain: {
            type: String,
            default: null,
        },

        venue: {
            type: String,
            required: true,
            index: true,
        },

        venueId: {
            type: String,
            default: null,
        },

        sessionId: {
            type: String,
            required: true,
        },

        auditorium: {
            type: String,
            default: null,
        },

        format: {
            type: String,
            default: null,
        },

        language: {
            type: String,
            default: null,
        },

        totalSeats: {
            type: Number,
            default: 0,
        },

        sold: {
            type: Number,
            default: 0,
        },

        available: {
            type: Number,
            default: 0,
        },

        occupancy: {
            type: Number,
            default: 0,
        },

        gross: {
            type: Number,
            default: 0,
        },

        source: {
            type: String,
            default: null,
        },

        scrapedAt: {
            type: Date,
            default: null,
        },

        syncedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

// Prevent duplicate show records
boxOfficeSessionSchema.index(
    {
        movieTitle: 1,
        showDate: 1,
        sessionId: 1,
    },
    {
        unique: true,
    }
);

const BoxOfficeSession = mongoose.model(
    "BoxOfficeSession",
    boxOfficeSessionSchema
);

export default BoxOfficeSession;