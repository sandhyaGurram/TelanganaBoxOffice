import { useEffect, useState } from "react";
import "./App.css";
import telanganaLocations from "./data/telanganaLocations";
import { getHealth, getMovies } from "./services/api";

function App() {
  const [backendStatus, setBackendStatus] = useState("Checking...");
  const [movies, setMovies] = useState([]);
  const [moviesLoading, setMoviesLoading] = useState(true);
  const [moviesError, setMoviesError] = useState("");

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const data = await getHealth();

        if (data.success) {
          setBackendStatus("Connected");
        }
      } catch (error) {
        console.error("Backend connection error:", error);
        setBackendStatus("Backend Offline");
      }
    };

    checkBackend();
  }, []);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setMoviesLoading(true);

        const data = await getMovies();

        if (data.success) {
          setMovies(data.movies);
        }
      } catch (error) {
        console.error("Movie fetch error:", error);
        setMoviesError("Failed to load movies");
      } finally {
        setMoviesLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const districts = Object.keys(telanganaLocations);

  const cities = selectedDistrict ? telanganaLocations[selectedDistrict] : [];

  return (
    <div className="app">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">
          BOX<span>OFFICE</span>
        </div>

        <nav>
          <button className="nav-item active">Dashboard</button>
          <button className="nav-item">Movies</button>
          <button className="nav-item">Districts</button>
          <button className="nav-item">Cities</button>
          <button className="nav-item">Theatres</button>
          <button className="nav-item">Analytics</button>
        </nav>

        <div className="sidebar-bottom">
          <div>Telangana</div>
          <small>Box Office Analytics</small>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Top Bar */}
        <header className="topbar">
          <div>
            <h1>Telangana Box Office</h1>
            <p>Movie performance and box-office analytics</p>
          </div>

          <div className="topbar-right">
            <span className="status-dot"></span>
            <span>{backendStatus}</span>
          </div>
        </header>

        {/* Filters */}
        <section className="filters">
          {/* District */}
          <select
            value={selectedDistrict}
            onChange={(e) => {
              setSelectedDistrict(e.target.value);
              setSelectedCity("");
            }}
          >
            <option value="">All Districts</option>

            {districts.map((district) => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
          </select>

          {/* City */}
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            disabled={!selectedDistrict}
          >
            <option value="">All Cities</option>

            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>

          {/* Date */}
          <select>
            <option>Today</option>
            <option>Yesterday</option>
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
          </select>
        </section>

        {/* KPI Cards */}
        <section className="stats-grid">
          <div className="stat-card">
            <p>Total Gross</p>
            <h2>₹0</h2>
            <span>Telangana</span>
          </div>

          <div className="stat-card">
            <p>Tickets Sold</p>
            <h2>0</h2>
            <span>Across tracked movies</span>
          </div>

          <div className="stat-card">
            <p>Total Shows</p>
            <h2>0</h2>
            <span>Today's data</span>
          </div>

          <div className="stat-card">
            <p>Occupancy</p>
            <h2>0%</h2>
            <span>Average occupancy</span>
          </div>
        </section>

        {/* Main Sections */}
        <section className="content-grid">
          <div className="panel large-panel">
            <div className="panel-header">
              <div>
                <h3>Movie Performance</h3>
                <p>Telangana movie-wise box office</p>
              </div>
            </div>

            <div className="movie-list">
              {moviesLoading && (
                <div className="empty-state">
                  <h4>Loading movies...</h4>
                  <p>Fetching movie data from the backend.</p>
                </div>
              )}

              {!moviesLoading && moviesError && (
                <div className="empty-state">
                  <h4>Unable to load movies</h4>
                  <p>{moviesError}</p>
                </div>
              )}

              {!moviesLoading && !moviesError && movies.length === 0 && (
                <div className="empty-state">
                  <h4>No movies found</h4>
                  <p>No movies have been saved to MongoDB yet.</p>
                </div>
              )}

              {!moviesLoading && !moviesError && movies.length > 0 && (
                <div className="movies-table">
                  <div className="movie-row movie-header">
                    <span>Movie</span>
                    <span>Release Date</span>
                    <span>Rating</span>
                    <span>Popularity</span>
                  </div>

                  {movies.map((movie) => (
                    <div className="movie-row" key={movie._id}>
                      <span className="movie-title">{movie.title}</span>

                      <span>{movie.releaseDate || "—"}</span>

                      <span>
                        {movie.voteAverage ? movie.voteAverage.toFixed(1) : "—"}
                      </span>

                      <span>
                        {movie.popularity ? movie.popularity.toFixed(1) : "—"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="panel">
            <div className="panel-header">
              <div>
                <h3>Top Cities</h3>
                <p>Performance by city</p>
              </div>
            </div>

            <div className="empty-state small">
              <p>City data will appear here.</p>
            </div>
          </div>
        </section>

        {/* Last Updated */}
        <div className="last-updated">Last updated: —</div>
      </main>
    </div>
  );
}

export default App;
