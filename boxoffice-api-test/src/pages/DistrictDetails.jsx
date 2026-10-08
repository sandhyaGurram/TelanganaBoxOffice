import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  MapPin,
  Ticket,
  Users,
  IndianRupee,
} from "lucide-react";

import api from "../services/api";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

import "../../styles/dashboard.css";

const DistrictDetails = () => {
  const { district } = useParams();

  const decodedDistrict = decodeURIComponent(district);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDistrict = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          `/box-office/districts/${encodeURIComponent(decodedDistrict)}`,
        );

        setData(response.data);
      } catch (error) {
        console.error("District details error:", error);
        setError("Unable to load district data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDistrict();
  }, [decodedDistrict]);

  const formatNumber = (value) =>
    new Intl.NumberFormat("en-IN").format(value || 0);

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value || 0);

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

            {/* Header */}
            <div className="page-header">
              <h1 className="page-title">
                {decodedDistrict.replaceAll("_", " ")}
              </h1>

              <p className="page-description">
                Telugu movie box-office performance across cities
              </p>
            </div>

            {/* Loading */}
            {loading && <div className="loading">Loading district data...</div>}

            {/* Error */}
            {error && <div className="error-message">{error}</div>}

            {/* Data */}
            {!loading && data && (
              <>
                {/* City statistics */}
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-card-icon">
                      <MapPin size={20} />
                    </div>

                    <div>
                      <div className="stat-card-title">Cities</div>

                      <div className="stat-card-value">
                        {data.cities?.length || 0}
                      </div>

                      <div className="stat-card-subtitle">Cities tracked</div>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-card-icon">
                      <Ticket size={20} />
                    </div>

                    <div>
                      <div className="stat-card-title">Total Shows</div>

                      <div className="stat-card-value">
                        {formatNumber(
                          data.cities?.reduce(
                            (sum, city) => sum + Number(city.totalShows || 0),
                            0,
                          ),
                        )}
                      </div>

                      <div className="stat-card-subtitle">Shows tracked</div>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-card-icon">
                      <Users size={20} />
                    </div>

                    <div>
                      <div className="stat-card-title">Tickets Sold</div>

                      <div className="stat-card-value">
                        {formatNumber(
                          data.cities?.reduce(
                            (sum, city) => sum + Number(city.totalSold || 0),
                            0,
                          ),
                        )}
                      </div>

                      <div className="stat-card-subtitle">Tickets tracked</div>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-card-icon">
                      <IndianRupee size={20} />
                    </div>

                    <div>
                      <div className="stat-card-title">Estimated Gross</div>

                      <div className="stat-card-value">
                        {formatCurrency(
                          data.cities?.reduce(
                            (sum, city) => sum + Number(city.totalGross || 0),
                            0,
                          ),
                        )}
                      </div>

                      <div className="stat-card-subtitle">Tracked gross</div>
                    </div>
                  </div>
                </div>

                {/* Cities */}
                <div className="panel district-city-panel">
                  <div className="panel-header">
                    <div>
                      <h2 className="panel-title">
                        Cities in {decodedDistrict.replaceAll("_", " ")}
                      </h2>

                      <p className="panel-description">
                        Select a city to view its theatres and shows
                      </p>
                    </div>

                    <div className="theatre-count">
                      {data.cities?.length || 0} Cities
                    </div>
                  </div>

                  {/* City grid */}
                  {data.cities?.length > 0 ? (
                    <div className="district-city-grid">
                      {data.cities.map((city) => (
                        <Link
                          key={city.city}
                          to={`/cities/${encodeURIComponent(city.city)}`}
                          className="district-city-card"
                        >
                          <div className="district-city-card-top">
                            <div className="district-city-icon">
                              <MapPin size={20} />
                            </div>

                            <span className="district-city-arrow">→</span>
                          </div>

                          <h3>{city.city}</h3>

                          <div className="district-city-stats">
                            <span>
                              <Ticket size={14} />
                              {formatNumber(city.totalShows)} Shows
                            </span>

                            <span>
                              <Building2 size={14} />
                              {formatNumber(city.theatreCount)} Theatres
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="theatre-empty-state">
                      <MapPin size={28} />

                      <h3>No cities found</h3>

                      <p>
                        No box-office data is currently available for this
                        district.
                      </p>
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

export default DistrictDetails;
