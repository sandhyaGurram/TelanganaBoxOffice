import { useEffect, useState } from "react";

import { Ticket, Armchair, Users, IndianRupee } from "lucide-react";

import api from "../services/api";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import StatCard from "../components/StatCard";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/box-office/dashboard");

      setStats(response.data.data);
    } catch (error) {
      console.error(error);

      setError("Unable to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
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

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Sidebar />

      <div className="ml-64">
        <Topbar />

        <main className="p-6">
          {/* PAGE HEADER */}

          <div className="mb-6">
            <h1 className="text-2xl font-bold">Telangana Box Office</h1>

            <p className="mt-1 text-sm text-slate-400">
              Track movie performance across Telangana theatres and shows.
            </p>
          </div>

          {/* ERROR */}

          {error && (
            <div className="mb-6 rounded-lg border border-red-900 bg-red-950/40 p-4 text-sm text-red-300">
              {error}
            </div>
          )}

          {/* LOADING */}

          {loading && (
            <div className="py-20 text-center text-slate-500">
              Loading dashboard...
            </div>
          )}

          {/* DASHBOARD */}

          {!loading && stats && (
            <>
              {/* STAT CARDS */}

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
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

              {/* OCCUPANCY */}

              <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 lg:col-span-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-semibold">Occupancy</h2>

                      <p className="mt-1 text-sm text-slate-500">
                        Overall seat occupancy
                      </p>
                    </div>

                    <span className="text-3xl font-bold">
                      {stats.occupancy}%
                    </span>
                  </div>

                  <div className="mt-6 h-3 overflow-hidden rounded-full bg-slate-800">
                    <div
                      className="h-full rounded-full bg-white transition-all"
                      style={{
                        width: `${Math.min(stats.occupancy, 100)}%`,
                      }}
                    />
                  </div>
                </div>

                {/* DATA SOURCE */}

                <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
                  <p className="text-sm text-slate-500">Data Source</p>

                  <h3 className="mt-2 text-lg font-semibold">Apify Tracker</h3>

                  <p className="mt-2 text-sm text-slate-500">
                    Telangana show-level box-office tracking.
                  </p>

                  <div className="mt-5 flex items-center gap-2 text-sm text-emerald-400">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    Data connected
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
