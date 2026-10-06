import axios from "axios";

const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

export default api;

























// const API_URL = "http://localhost:5000";

// export const getHealth = async () => {
//     const response = await fetch(`${API_URL}/api/health`);

//     if (!response.ok) {
//         throw new Error("Failed to connect to backend");
//     }

//     return response.json();
// };


// // Get movies from MongoDB
// export const getMovies = async () => {
//     const response = await fetch(`${API_URL}/api/movies`);

//     if (!response.ok) {
//         throw new Error("Failed to fetch movies");
//     }

//     return response.json();
// };