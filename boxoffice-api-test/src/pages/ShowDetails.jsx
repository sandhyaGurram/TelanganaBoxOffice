import { useEffect, useState } from "react";

import { Link, useParams } from "react-router-dom";

import { ArrowLeft, Ticket, Users, Armchair, IndianRupee } from "lucide-react";

import api from "../services/api";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import StatCard from "../components/StatCard";

import "../../styles/dashboard.css";

const ShowDetails = () => {
  const { sessionId } = useParams();

  const [show, setShow] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    const fetchShow = async () => {
      try {
        setLoading(true);

        const response = await api.get(
          `/box-office/shows/${encodeURIComponent(sessionId)}`,
        );

        setShow(response.data.data);
      } catch (error) {
        console.error("Show details error:", error);

        setError("Unable to load show data.");
      } finally {
        setLoading(false);
      }
    };

    fetchShow();
  }, [sessionId]);

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

  if (loading) {
    return (
      <div className="app">
        <div className="main-layout">
          <Sidebar />

          <div className="main-content">
            <Topbar />

            <main className="page">
              <div className="loading">Loading show data...</div>
            </main>
          </div>
        </div>
      </div>
    );
  }

  if (error || !show) {
    return (
      <div className="app">
        <div className="main-layout">
          <Sidebar />

          <div className="main-content">
            <Topbar />

            <main className="page">
              <div className="error-message">{error || "Show not found"}</div>

              <Link to="/dashboard" className="back-link">
                <ArrowLeft size={16} />
                Back to Dashboard
              </Link>
            </main>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="main-layout">
        <Sidebar />

        <div className="main-content">
          <Topbar />

          <main className="page">
            <Link
              to={`/theatres/${encodeURIComponent(
                show.city,
              )}/${encodeURIComponent(show.venue)}`}
              className="back-link"
            >
              <ArrowLeft size={16} />
              Back to {show.venue}
            </Link>

            <div className="page-header">
              <h1 className="page-title">{show.movieTitle}</h1>

              <p className="page-description">
                {show.city} · {show.venue}
              </p>
            </div>

            <div className="stats-grid">
              <StatCard
                title="Total Seats"
                value={formatNumber(show.totalSeats)}
                subtitle="Seats in show"
                icon={Armchair}
              />

              <StatCard
                title="Tickets Sold"
                value={formatNumber(show.sold)}
                subtitle={`${formatNumber(show.available)} available`}
                icon={Users}
              />

              <StatCard
                title="Occupancy"
                value={`${show.occupancy}%`}
                subtitle="Seat occupancy"
                icon={Ticket}
              />

              <StatCard
                title="Tracked Gross"
                value={formatCurrency(show.gross)}
                subtitle="Tracked collection"
                icon={IndianRupee}
              />
            </div>

            <div className="panel show-occupancy-panel">
              <div className="occupancy-header">
                <div>
                  <h2 className="panel-title">Seat Occupancy</h2>

                  <p className="panel-description">
                    Current ticket sales for this show
                  </p>
                </div>

                <strong className="occupancy-value">{show.occupancy}%</strong>
              </div>

              <div className="occupancy-progress">
                <div
                  className="occupancy-progress-fill"
                  style={{
                    width: `${Math.min(show.occupancy || 0, 100)}%`,
                  }}
                />
              </div>

              <div className="occupancy-summary">
                <span>{formatNumber(show.sold)} sold, </span>

                <span>{formatNumber(show.available)} available, </span>

                <span>{formatNumber(show.totalSeats)} total seats, </span>
              </div>
            </div>

            <div className="content-grid">
              <div className="panel">
                <h2 className="panel-title">Show Information</h2>

                <div className="details-grid">
                  <div>
                    <span className="detail-label">Movie</span>

                    <strong>{show.movieTitle}</strong>
                  </div>

                  <div>
                    <span className="detail-label">Date</span>

                    <strong>{show.showDate}</strong>
                  </div>

                  <div>
                    <span className="detail-label">Time</span>

                    <strong>{show.showTime}</strong>
                  </div>

                  <div>
                    <span className="detail-label">Format</span>

                    <strong>{show.format || "N/A"}</strong>
                  </div>

                  <div>
                    <span className="detail-label">Language</span>

                    <strong>{show.language || "N/A"}</strong>
                  </div>

                  <div>
                    <span className="detail-label">Auditorium</span>

                    <strong>{show.auditorium || "N/A"}</strong>
                  </div>

                  <div>
                    <span className="detail-label">Session ID</span>

                    <strong>{show.sessionId}</strong>
                  </div>

                  <div>
                    <span className="detail-label">Source</span>

                    <strong>{show.source || "N/A"}</strong>
                  </div>
                </div>
              </div>

              <div className="panel">
                <h2 className="panel-title">Last Updated</h2>

                <p className="panel-description">
                  Latest data captured for this show.
                </p>

                <div className="source-card">
                  <p className="source-label">Scraped At</p>

                  <p className="source-name">
                    {show.scrapedAt
                      ? new Date(show.scrapedAt).toLocaleString("en-IN")
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ShowDetails;
