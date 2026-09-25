import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
    {
        tmdbId: {
            type: Number,
            required: true,
            unique: true,
        },

        title: {
            type: String,
            required: true,
        },

        originalTitle: {
            type: String,
        },

        overview: {
            type: String,
        },

        releaseDate: {
            type: String,
        },
        originalLanguage: String,

        posterPath: {
            type: String,
        },

        backdropPath: {
            type: String,
        },

        voteAverage: {
            type: Number,
        },

        voteCount: {
            type: Number,
        },

        popularity: {
            type: Number,
        },

        genres: [
            {
                id: Number,
                name: String,
            },
        ],
    },
    {
        timestamps: true,
    }
);

const Movie = mongoose.model("Movie", movieSchema);

export default Movie;