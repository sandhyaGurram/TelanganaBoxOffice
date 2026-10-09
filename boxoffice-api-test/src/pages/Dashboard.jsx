import { useCallback, useEffect, useState } from "react";
import { Ticket, Armchair, Users, IndianRupee } from "lucide-react";

import api from "../services/api";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import StatCard from "../components/StatCard";
import CityTable from "../components/CityTable";

import "../../styles/dashboard.css";

const EMPTY_FILTERS = {
  search: "",
  district: "",
  city: "",
  date: "",
  language: "Telugu",
  state: "Telangana",
};

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [districts, setDistricts] = useState([]);
  const [filters, setFilters] = useState(EMPTY_FILTERS);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = useCallback(async (activeFilters = EMPTY_FILTERS) => {
    try {
      setLoading(true);
      setError("");

      const params = {
        language: activeFilters.language,
      };

      if (activeFilters.search) params.search = activeFilters.search;
      if (activeFilters.district) params.district = activeFilters.district;
      if (activeFilters.city) params.city = activeFilters.city;
      if (activeFilters.date) params.date = activeFilters.date;

      const [dashboardResponse, districtsResponse] = await Promise.all([
        api.get("/box-office/dashboard", { params }),
        api.get("/box-office/districts", { params }),
      ]);

      setStats(dashboardResponse.data.data);
      setDistricts(districtsResponse.data.districts || []);
    } catch (error) {
      console.error("Dashboard API error:", error);
      setError("Unable to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard(EMPTY_FILTERS);
  }, [fetchDashboard]);

  const handleApplyFilters = (nextFilters) => {
    const updatedFilters = {
      ...EMPTY_FILTERS,
      ...nextFilters,
      language: "Telugu",
      state: "Telangana",
    };

    setFilters(updatedFilters);
    fetchDashboard(updatedFilters);
  };

  const handleRefresh = () => {
    fetchDashboard(filters);
  };

  const formatNumber = (number) =>
    new Intl.NumberFormat("en-IN").format(number || 0);

  const formatCurrency = (number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(number || 0);

  return (
    <div className="app">
      <div className="main-layout">
        <Sidebar />

        <div className="main-content">
          <Topbar
            onApplyFilters={handleApplyFilters}
            onRefresh={handleRefresh}
          />

          <main className="page">
            <div className="page-header">
              <h1 className="page-title">Telangana Box Office</h1>
              <p className="page-description">
                Telugu movie performance across Telangana theatres and shows.
              </p>
            </div>

            {error && (
              <div className="error-message">
                {error}
                <button type="button" onClick={handleRefresh}>
                  Retry
                </button>
              </div>
            )}

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
                    subtitle={`${Number(stats.occupancy || 0).toFixed(2)}% occupancy`}
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
                        {Number(stats.occupancy || 0).toFixed(2)}%
                      </span>
                    </div>

                    <div className="progress-container">
                      <div
                        className="progress-bar"
                        style={{
                          width: `${Math.min(
                            Math.max(Number(stats.occupancy) || 0, 0),
                            100,
                          )}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="panel">
                    <p className="source-label">Data Source</p>
                    <h3 className="source-name">District Showtimes Tracker</h3>

                    <p className="source-description">
                      Telugu show-level box-office tracking in Telangana.
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

// import { useEffect, useState } from "react";

// import { Ticket, Armchair, Users, IndianRupee } from "lucide-react";

// import api from "../services/api";

// import Sidebar from "../components/Sidebar";
// import Topbar from "../components/Topbar";
// import StatCard from "../components/StatCard";
// import CityTable from "../components/CityTable";

// import "../../styles/dashboard.css";

// const Dashboard = () => {
//   const [stats, setStats] = useState(null);

//   const [loading, setLoading] = useState(true);

//   const [error, setError] = useState("");

//   const [cities, setCities] = useState([]);

//   const [districts, setDistricts] = useState([]);

//   const fetchDashboard = async () => {
//     try {
//       setLoading(true);

//       setError("");

//       const response = await api.get("/box-office/dashboard");

//       setStats(response.data.data);
//     } catch (error) {
//       console.error("Dashboard API error:", error);

//       setError("Unable to load dashboard data.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchDashboard();
//     fetchCities();
//     fetchDistricts();
//   }, []);

//   const formatNumber = (number) => {
//     return new Intl.NumberFormat("en-IN").format(number || 0);
//   };

//   const formatCurrency = (number) => {
//     return new Intl.NumberFormat("en-IN", {
//       style: "currency",
//       currency: "INR",
//       maximumFractionDigits: 0,
//     }).format(number || 0);
//   };

//   const fetchCities = async () => {
//     try {
//       const response = await api.get("/box-office/cities");

//       setCities(response.data.data || []);
//     } catch (error) {
//       console.error("City API error:", error);
//     }
//   };

//   const fetchDistricts = async () => {
//     try {
//       const response = await api.get("/box-office/districts");

//       setDistricts(response.data.districts || []);
//     } catch (error) {
//       console.error("District API error:", error);
//     }
//   };

//   return (
//     <div className="app">
//       <div className="main-layout">
//         <Sidebar />

//         <div className="main-content">
//           <Topbar />

//           <main className="page">
//             <div className="page-header">
//               <h1 className="page-title">Telangana Box Office</h1>

//               <p className="page-description">
//                 Track movie performance across Telangana theatres and shows.
//               </p>
//             </div>

//             {error && <div className="error-message">{error}</div>}

//             {loading && <div className="loading">Loading dashboard...</div>}

//             {!loading && stats && (
//               <>
//                 <div className="stats-grid">
//                   <StatCard
//                     title="Total Shows"
//                     value={formatNumber(stats.totalShows)}
//                     subtitle="Tracked shows"
//                     icon={Ticket}
//                   />

//                   <StatCard
//                     title="Tickets Sold"
//                     value={formatNumber(stats.totalSold)}
//                     subtitle={`of ${formatNumber(stats.totalSeats)} seats`}
//                     icon={Users}
//                   />

//                   <StatCard
//                     title="Available Seats"
//                     value={formatNumber(stats.totalAvailable)}
//                     subtitle="Currently available"
//                     icon={Armchair}
//                   />

//                   <StatCard
//                     title="Tracked Gross"
//                     value={formatCurrency(stats.totalGross)}
//                     subtitle={`${stats.occupancy}% occupancy`}
//                     icon={IndianRupee}
//                   />
//                 </div>

//                 <div className="content-grid">
//                   <div className="panel">
//                     <div className="panel-header">
//                       <div>
//                         <h2 className="panel-title">Occupancy</h2>

//                         <p className="panel-description">
//                           Overall seat occupancy
//                         </p>
//                       </div>

//                       <span className="occupancy-value">
//                         {stats.occupancy}%
//                       </span>
//                     </div>

//                     <div className="progress-container">
//                       <div
//                         className="progress-bar"
//                         style={{
//                           width: `${Math.min(stats.occupancy, 100)}%`,
//                         }}
//                       />
//                     </div>
//                   </div>

//                   <div className="panel">
//                     <p className="source-label">Data Source</p>

//                     <h3 className="source-name">Apify Tracker</h3>

//                     <p className="source-description">
//                       Telangana show-level box-office tracking.
//                     </p>

//                     <div className="connection-status">
//                       <span className="connection-dot" />
//                       Data connected
//                     </div>
//                   </div>
//                 </div>
//                 <CityTable districts={districts} />
//               </>
//             )}
//           </main>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;
