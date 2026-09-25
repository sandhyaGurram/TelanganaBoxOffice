const API_URL = "http://localhost:5000";

export const getHealth = async () => {
    const response = await fetch(`${API_URL}/api/health`);

    if (!response.ok) {
        throw new Error("Failed to connect to backend");
    }

    return response.json();
};


// Get movies from MongoDB
export const getMovies = async () => {
    const response = await fetch(`${API_URL}/api/movies`);

    if (!response.ok) {
        throw new Error("Failed to fetch movies");
    }

    return response.json();
};