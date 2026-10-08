import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import {
  ArrowLeft,
  Building2,
  Ticket,
  Users,
  IndianRupee,
  Search,
  X,
  ArrowUpRight,
} from "lucide-react";

import api from "../services/api";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import StatCard from "../components/StatCard";

import "../../styles/dashboard.css";

const CityDetails = () => {
  const { city } = useParams();

  const decodedCity = decodeURIComponent(city);

  const [data, setData] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // Theatre search
  const [theatreSearch, setTheatreSearch] = useState("");

  useEffect(() => {
    const fetchCity = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          `/box-office/cities/${encodeURIComponent(decodedCity)}`,
        );

        setData(response.data);
      } catch (error) {
        console.error("City details error:", error);

        setError("Unable to load city data.");
      } finally {
        setLoading(false);
      }
    };

    fetchCity();
  }, [decodedCity]);

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

  // Filter theatres based on search
  const filteredTheatres =
    data?.theatres?.filter((theatre) =>
      theatre.toLowerCase().includes(theatreSearch.toLowerCase()),
    ) || [];

  return (
    <div className="app">
      <div className="main-layout">
        <Sidebar />

        <div className="main-content">
          <Topbar />

          <main className="page">
            {/* Back */}
            <Link to="/dashboard" className="back-link">
              <ArrowLeft size={16} />
              Back to Dashboard
            </Link>

            {/* Page Header */}
            <div className="page-header city-page-header">
              <h1 className="page-title">{decodedCity}</h1>

              <p className="page-description">
                Telangana city box-office performance
              </p>
            </div>

            {/* Loading */}
            {loading && <div className="loading">Loading city data...</div>}

            {/* Error */}
            {error && <div className="error-message">{error}</div>}

            {/* Data */}
            {!loading && data && data.summary && (
              <>
                {/* ==========================
                    CITY STATISTICS
                ========================== */}

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
                    subtitle="Tickets tracked"
                    icon={Users}
                  />

                  <StatCard
                    title="Theatres"
                    value={formatNumber(data.summary.totalTheatres)}
                    subtitle="Tracked theatres"
                    icon={Building2}
                  />

                  <StatCard
                    title="Tracked Gross"
                    value={formatCurrency(data.summary.totalGross)}
                    subtitle={`${data.summary.occupancy}% occupancy`}
                    icon={IndianRupee}
                  />
                </div>

                {/* ==========================
                    THEATRE DIRECTORY
                ========================== */}

                <div className="panel city-theatre-panel">
                  {/* Header */}

                  <div className="theatre-directory-header">
                    <div>
                      <div className="theatre-title-row">
                        <h2 className="panel-title">
                          Theatres in {decodedCity}
                        </h2>

                        <span className="theatre-count">
                          {data.summary.totalTheatres}
                        </span>
                      </div>

                      <p className="panel-description">
                        Browse tracked theatres and view their show-level
                        performance.
                      </p>
                    </div>
                  </div>

                  {/* Search */}

                  <div className="theatre-search-box">
                    <Search size={17} className="theatre-search-icon" />

                    <input
                      type="text"
                      value={theatreSearch}
                      onChange={(e) => setTheatreSearch(e.target.value)}
                      placeholder="Search theatres..."
                    />

                    {theatreSearch && (
                      <button
                        type="button"
                        className="theatre-search-clear"
                        onClick={() => setTheatreSearch("")}
                        aria-label="Clear search"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>

                  {/* Search result count */}

                  <div className="theatre-results-info">
                    <span>
                      Showing <strong>{filteredTheatres.length}</strong> of{" "}
                      <strong>{data.summary.totalTheatres}</strong> theatres
                    </span>
                  </div>

                  {/* Theatre Cards */}

                  {filteredTheatres.length > 0 ? (
                    <div className="theatre-grid">
                      {filteredTheatres.map((theatre, index) => (
                        <Link
                          key={theatre}
                          to={`/theatres/${encodeURIComponent(
                            decodedCity,
                          )}/${encodeURIComponent(theatre)}`}
                          className="theatre-card"
                        >
                          {/* Number */}

                          <div className="theatre-number">
                            {String(index + 1).padStart(2, "0")}
                          </div>

                          {/* Theatre content */}

                          <div className="theatre-card-content">
                            <div className="theatre-icon-box">
                              <Building2 size={18} />
                            </div>

                            <div className="theatre-card-main">
                              <h3>{theatre}</h3>

                              <span>
                                View shows
                                <ArrowUpRight size={14} />
                              </span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    /* Empty Search */

                    <div className="theatre-empty-state">
                      <div className="theatre-empty-icon">
                        <Search size={22} />
                      </div>

                      <h3>No theatres found</h3>

                      <p>No theatre matches "{theatreSearch}".</p>

                      <button
                        type="button"
                        onClick={() => setTheatreSearch("")}
                      >
                        Clear search
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default CityDetails;
