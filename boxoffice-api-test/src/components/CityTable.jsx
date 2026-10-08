import { MapPin, Building2, Ticket } from "lucide-react";
import { Link } from "react-router-dom";

const CityTable = ({ districts }) => {
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
    <div className="district-section">
      <div className="district-header">
        <div>
          <h2 className="district-title">District Performance</h2>

          <p className="district-description">
            Telangana district-wise box office performance
          </p>
        </div>

        <span className="district-count">
          {districts.length} districts tracked
        </span>
      </div>

      <div className="table-wrapper">
        <table className="district-table">
          <thead>
            <tr>
              <th>District</th>
              <th>Shows</th>
              <th>Tickets Sold</th>
              <th>Theatres</th>
              <th>Occupancy</th>
              <th>Tracked Gross</th>
            </tr>
          </thead>

          <tbody>
            {districts.map((district) => (
              <tr key={district.district} className="district-row">
                <td>
                  <div className="district-name">
                    <div className="district-icon">
                      <MapPin size={15} />
                    </div>

                    <Link
                      to={`/districts/${encodeURIComponent(district.district)}`}
                      className="city-link"
                    >
                      {district.district}
                    </Link>
                  </div>
                </td>

                <td>
                  <div className="table-number">
                    <Ticket size={14} />

                    {formatNumber(district.totalShows)}
                  </div>
                </td>

                <td>{formatNumber(district.totalSold)}</td>

                <td>
                  <div className="table-number">
                    <Building2 size={14} />

                    {formatNumber(district.theatreCount)}
                  </div>
                </td>

                <td>
                  <div className="occupancy-cell">
                    <span>{Number(district.occupancy || 0).toFixed(2)}%</span>

                    <div className="mini-progress">
                      <div
                        style={{
                          width: `${Math.min(
                            Number(district.occupancy || 0),
                            100,
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                </td>

                <td className="gross-value">
                  {formatCurrency(district.totalGross)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CityTable;
