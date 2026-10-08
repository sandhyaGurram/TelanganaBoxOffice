import { useEffect, useState } from "react";

import { Ticket, Armchair, Users, IndianRupee } from "lucide-react";

import api from "../services/api";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import StatCard from "../components/StatCard";
import CityTable from "../components/CityTable";

import "../../styles/dashboard.css";

const Dashboard = () => {
  const [stats, setStats] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [cities, setCities] = useState([]);

  const [districts, setDistricts] = useState([]);

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      setError("");

      const response = await api.get("/box-office/dashboard");

      setStats(response.data.data);
    } catch (error) {
      console.error("Dashboard API error:", error);

      setError("Unable to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
    fetchCities();
    fetchDistricts();
  }, []);

  const formatNumber = (number) => {
    return new Intl.NumberFormat("en-IN").format(number || 0);
  };

  const formatCurrency = (number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(number || 0);
  };

  const fetchCities = async () => {
    try {
      const response = await api.get("/box-office/cities");

      setCities(response.data.data || []);
    } catch (error) {
      console.error("City API error:", error);
    }
  };

  const fetchDistricts = async () => {
    try {
      const response = await api.get("/box-office/districts");

      setDistricts(response.data.districts || []);
    } catch (error) {
      console.error("District API error:", error);
    }
  };

  return (
    <div className="app">
      <div className="main-layout">
        <Sidebar />

        <div className="main-content">
          <Topbar />

          <main className="page">
            <div className="page-header">
              <h1 className="page-title">Telangana Box Office</h1>

              <p className="page-description">
                Track movie performance across Telangana theatres and shows.
              </p>
            </div>

            {error && <div className="error-message">{error}</div>}

            {loading && <div className="loading">Loading dashboard...</div>}

            {!loading && stats && (
              <>
                <div className="stats-grid">
                  <StatCard
                    title="Total Shows"
                    value={formatNumber(stats.totalShows)}
                    subtitle="Tracked shows"
                    icon={Ticket}
                  />

                  <StatCard
                    title="Tickets Sold"
                    value={formatNumber(stats.totalSold)}
                    subtitle={`of ${formatNumber(stats.totalSeats)} seats`}
                    icon={Users}
                  />

                  <StatCard
                    title="Available Seats"
                    value={formatNumber(stats.totalAvailable)}
                    subtitle="Currently available"
                    icon={Armchair}
                  />

                  <StatCard
                    title="Tracked Gross"
                    value={formatCurrency(stats.totalGross)}
                    subtitle={`${stats.occupancy}% occupancy`}
                    icon={IndianRupee}
                  />
                </div>

                <div className="content-grid">
                  <div className="panel">
                    <div className="panel-header">
                      <div>
                        <h2 className="panel-title">Occupancy</h2>

                        <p className="panel-description">
                          Overall seat occupancy
                        </p>
                      </div>

                      <span className="occupancy-value">
                        {stats.occupancy}%
                      </span>
                    </div>

                    <div className="progress-container">
                      <div
                        className="progress-bar"
                        style={{
                          width: `${Math.min(stats.occupancy, 100)}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="panel">
                    <p className="source-label">Data Source</p>

                    <h3 className="source-name">Apify Tracker</h3>

                    <p className="source-description">
                      Telangana show-level box-office tracking.
                    </p>

                    <div className="connection-status">
                      <span className="connection-dot" />
                      Data connected
                    </div>
                  </div>
                </div>
                <CityTable districts={districts} />
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
