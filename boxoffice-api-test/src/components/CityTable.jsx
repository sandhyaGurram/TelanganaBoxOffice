import { MapPin, Building2, Ticket } from "lucide-react";
import { Link } from "react-router-dom";

const CityTable = ({ cities }) => {
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
          <h2 className="district-title">City Performance</h2>

          <p className="district-description">
            Telangana city-wise box office performance
          </p>
        </div>

        <span className="district-count">{cities.length} cities tracked</span>
      </div>

      <div className="table-wrapper">
        <table className="district-table">
          <thead>
            <tr>
              <th>City</th>
              <th>Shows</th>
              <th>Tickets Sold</th>
              <th>Theatres</th>
              <th>Occupancy</th>
              <th>Tracked Gross</th>
            </tr>
          </thead>

          <tbody>
            {cities.map((city) => (
              <tr key={city.city} className="district-row">
                <td>
                  <div className="district-name">
                    <div className="district-icon">
                      <MapPin size={15} />
                    </div>

                    <Link
                      to={`/cities/${encodeURIComponent(city.city)}`}
                      className="city-link"
                    >
                      {city.city}
                    </Link>
                  </div>
                </td>

                <td>
                  <div className="table-number">
                    <Ticket size={14} />

                    {formatNumber(city.totalShows)}
                  </div>
                </td>

                <td>{formatNumber(city.totalSold)}</td>

                <td>
                  <div className="table-number">
                    <Building2 size={14} />

                    {formatNumber(city.totalTheatres)}
                  </div>
                </td>

                <td>
                  <div className="occupancy-cell">
                    <span>{city.occupancy}%</span>

                    <div className="mini-progress">
                      <div
                        style={{
                          width: `${Math.min(city.occupancy, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                </td>

                <td className="gross-value">
                  {formatCurrency(city.totalGross)}
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
