import { useEffect, useState } from "react";

import { Link, useParams } from "react-router-dom";

import { ArrowLeft, Ticket, Users, Armchair, IndianRupee } from "lucide-react";

import api from "../services/api";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import StatCard from "../components/StatCard";

import "../../styles/dashboard.css";

const TheatreDetails = () => {
  const { city, venue } = useParams();

  const decodedCity = decodeURIComponent(city);

  const decodedVenue = decodeURIComponent(venue);

  const [data, setData] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [selectedDate, setSelectedDate] = useState("");

  const [selectedMovie, setSelectedMovie] = useState("");

  useEffect(() => {
    const fetchTheatre = async () => {
      try {
        setLoading(true);

        const response = await api.get(
          `/box-office/theatres/${encodeURIComponent(
            decodedCity,
          )}/${encodeURIComponent(decodedVenue)}`,
        );

        setData(response.data);
      } catch (error) {
        console.error("Theatre details error:", error);

        setError("Unable to load theatre data.");
      } finally {
        setLoading(false);
      }
    };

    fetchTheatre();
  }, [decodedCity, decodedVenue]);

  const formatNumber = (value) => {
    return new Intl.NumberFormat("en-IN").format(value || 0);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value || 0);
  };

  const movies = [
    ...new Set(
      data?.sessions?.map((session) => session.movieTitle).filter(Boolean) ||
        [],
    ),
  ];

  const filteredSessions =
    data?.sessions?.filter((session) => {
      const dateMatches = !selectedDate || session.showDate === selectedDate;

      const movieMatches =
        !selectedMovie || session.movieTitle === selectedMovie;

      return dateMatches && movieMatches;
    }) || [];

  return (
    <div className="app">
      <div className="main-layout">
        <Sidebar />

        <div className="main-content">
          <Topbar />

          <main className="page">
            <Link
              to={`/cities/${encodeURIComponent(decodedCity)}`}
              className="back-link"
            >
              <ArrowLeft size={16} />
              Back to {decodedCity}
            </Link>

            <div className="page-header">
              <h1 className="page-title">{decodedVenue}</h1>

              <p className="page-description">{decodedCity} · Telangana</p>
            </div>

            {loading && <div className="loading">Loading theatre data...</div>}

            {error && <div className="error-message">{error}</div>}

            {!loading && data && data.summary && (
              <>
                <div className="stats-grid">
                  <StatCard
                    title="Total Shows"
                    value={formatNumber(data.summary.totalShows)}
                    subtitle="Tracked shows"
                    icon={Ticket}
                  />

                  <StatCard
                    title="Tickets Sold"
                    value={formatNumber(data.summary.totalSold)}
                    subtitle={`${formatNumber(
                      data.summary.totalAvailable,
                    )} available`}
                    icon={Users}
                  />

                  <StatCard
                    title="Total Seats"
                    value={formatNumber(data.summary.totalSeats)}
                    subtitle={`${data.summary.occupancy}% occupancy`}
                    icon={Armchair}
                  />

                  <StatCard
                    title="Tracked Gross"
                    value={formatCurrency(data.summary.totalGross)}
                    subtitle={`${data.summary.totalMovies} movie`}
                    icon={IndianRupee}
                  />
                </div>

                <div className="panel theatre-shows-panel">
                  <div className="panel-header">
                    <div>
                      <h2 className="panel-title">Shows</h2>

                      <p className="panel-description">
                        {filteredSessions.length} shows
                      </p>
                    </div>

                    <div className="filter-group">
                      <label htmlFor="show-date">Date</label>

                      <select
                        id="show-date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                      >
                        <option value="">All Dates</option>

                        {[
                          ...new Set(
                            data.sessions.map((session) => session.showDate),
                          ),
                        ].map((date) => (
                          <option key={date} value={date}>
                            {date}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="filter-group">
                      <label htmlFor="show-movie">Movie</label>

                      <select
                        id="show-movie"
                        value={selectedMovie}
                        onChange={(e) => setSelectedMovie(e.target.value)}
                      >
                        <option value="">All Movies</option>

                        {movies.map((movie) => (
                          <option key={movie} value={movie}>
                            {movie}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="table-wrapper">
                    <table className="district-table">
                      <thead>
                        <tr>
                          <th>Movie</th>
                          <th>Date</th>
                          <th>Time</th>
                          <th>Format</th>
                          <th>Seats</th>
                          <th>Sold</th>
                          <th>Available</th>
                          <th>Occupancy</th>
                          <th>Gross</th>
                        </tr>
                      </thead>

                      <tbody>
                        {filteredSessions.map((session) => (
                          <tr
                            key={
                              session.sessionId ||
                              `${session.movieTitle}-${session.showDate}-${session.showTime}`
                            }
                            className="district-row"
                          >
                            <td>
                              <Link
                                to={`/shows/${encodeURIComponent(
                                  session.sessionId,
                                )}`}
                                className="show-link"
                              >
                                {session.movieTitle}
                              </Link>
                            </td>

                            <td>{session.showDate}</td>

                            <td>{session.showTime}</td>

                            <td>{session.format}</td>

                            <td>{formatNumber(session.totalSeats)}</td>

                            <td>{formatNumber(session.sold)}</td>

                            <td>{formatNumber(session.available)}</td>

                            <td>{session.occupancy}%</td>

                            <td className="gross-value">
                              {formatCurrency(session.gross)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default TheatreDetails;
