import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import { ArrowLeft, Building2, Ticket, Users, IndianRupee } from "lucide-react";

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

  useEffect(() => {
    const fetchCity = async () => {
      try {
        setLoading(true);

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

  return (
    <div className="app">
      <div className="main-layout">
        <Sidebar />

        <div className="main-content">
          <Topbar />

          <main className="page">
            <Link to="/dashboard" className="back-link">
              <ArrowLeft size={16} />
              Back to Dashboard
            </Link>

            <div className="page-header city-page-header">
              <h1 className="page-title">{decodedCity}</h1>

              <p className="page-description">
                Telangana city box-office performance
              </p>
            </div>

            {loading && <div className="loading">Loading city data...</div>}

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

                <div className="panel city-theatre-panel">
                  <h2 className="panel-title">Theatres in {decodedCity}</h2>

                  <p className="panel-description">
                    {data.summary.totalTheatres} theatres tracked
                  </p>

                  <div className="theatre-list">
                    {data.theatres.map((theatre) => (
                      <Link
                        key={theatre}
                        to={`/theatres/${encodeURIComponent(
                          decodedCity,
                        )}/${encodeURIComponent(theatre)}`}
                        className="theatre-item"
                      >
                        <Building2 size={17} />

                        <span>{theatre}</span>
                      </Link>
                    ))}
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

export default CityDetails;
