import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  RefreshCw,
  RotateCcw,
  CalendarDays,
  MapPin,
} from "lucide-react";

import api from "../services/api";

const Topbar = ({ onApplyFilters, onRefresh }) => {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [district, setDistrict] = useState("");
  const [city, setCity] = useState("");
  const [date, setDate] = useState("");

  const [districts, setDistricts] = useState([]);
  const [cities, setCities] = useState([]);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const loadLocations = async () => {
      try {
        const response = await api.get("/box-office/districts/locations");

        setDistricts(response.data.districts || []);
        setCities(response.data.cities || []);
      } catch (error) {
        console.error("Unable to load locations:", error);
      }
    };

    loadLocations();
  }, []);

  const filteredCities = cities.filter((item) => {
    return !district || item.district === district;
  });

  const searchResults = filteredCities
    .filter((item) =>
      item.city?.toLowerCase().includes(search.trim().toLowerCase()),
    )
    .filter((item) => search.trim().length > 0)
    .slice(0, 8);

  const openCity = (item) => {
    setShowResults(false);
    setSearch("");
    setCity(item.city);
    setDistrict(item.district);

    navigate(`/cities/${encodeURIComponent(item.city)}`);
  };

  const applyFilters = () => {
    setShowResults(false);

    // 1. City select cheste City Details page open avvali
    if (city.trim()) {
      navigate(`/cities/${encodeURIComponent(city.trim())}`);
      return;
    }

    // 2. District select cheste District Details page open avvali
    if (district.trim()) {
      navigate(`/districts/${encodeURIComponent(district.trim())}`);
      return;
    }

    // 3. City, district rendu select cheyyakapothe
    // normal dashboard filters apply cheyyali
    onApplyFilters?.({
      search: search.trim(),
      district: "",
      city: "",
      date,
      language: "Telugu",
      state: "Telangana",
    });
  };

  const resetFilters = () => {
    setSearch("");
    setDistrict("");
    setCity("");
    setDate("");
    setShowResults(false);

    onApplyFilters?.({
      search: "",
      district: "",
      city: "",
      date: "",
      language: "Telugu",
      state: "Telangana",
    });
  };

  return (
    <header className="topbar topbar-global">
      <div className="topbar-heading">
        <h2 className="topbar-title">Box Office Overview</h2>
        <p className="topbar-location">Telangana · Telugu Movies</p>
      </div>

      <div className="global-filter-panel">
        <div className="global-filter-search search-with-results">
          <Search size={16} />

          <input
            type="search"
            placeholder="Search a city, e.g. Hyderabad"
            value={search}
            onFocus={() => setShowResults(true)}
            onChange={(event) => {
              setSearch(event.target.value);
              setShowResults(true);
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                if (searchResults.length > 0) {
                  openCity(searchResults[0]);
                } else {
                  applyFilters();
                }
              }

              if (event.key === "Escape") {
                setShowResults(false);
              }
            }}
            aria-label="Search cities"
          />

          {showResults && search.trim() && (
            <div className="city-search-results">
              {searchResults.length > 0 ? (
                searchResults.map((item) => (
                  <button
                    type="button"
                    className="city-search-result"
                    key={`${item.district}-${item.city}`}
                    onClick={() => openCity(item)}
                  >
                    <MapPin size={17} />

                    <span className="city-result-text">
                      <strong>{item.city}</strong>
                      <small>{item.district} District</small>
                    </span>
                  </button>
                ))
              ) : (
                <div className="city-search-empty">
                  No matching cities found.
                </div>
              )}
            </div>
          )}
        </div>

        <select
          value={district}
          onChange={(event) => {
            setDistrict(event.target.value);
            setCity("");
          }}
          aria-label="Filter by district"
        >
          <option value="">All districts</option>
          {districts.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <select
          value={city}
          onChange={(event) => setCity(event.target.value)}
          aria-label="Filter by city"
        >
          <option value="">All cities</option>
          {filteredCities.map((item) => (
            <option key={`${item.district}-${item.city}`} value={item.city}>
              {item.city}
            </option>
          ))}
        </select>

        <div className="global-filter-date">
          <CalendarDays size={15} />
          <input
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            aria-label="Filter by show date"
          />
        </div>

        <button
          type="button"
          className="global-filter-apply"
          onClick={applyFilters}
        >
          Apply
        </button>

        <button
          type="button"
          className="icon-button"
          onClick={resetFilters}
          title="Reset filters"
          aria-label="Reset filters"
        >
          <RotateCcw size={16} />
        </button>

        <button
          type="button"
          className="icon-button"
          onClick={onRefresh}
          title="Refresh dashboard"
          aria-label="Refresh dashboard"
        >
          <RefreshCw size={17} />
        </button>
      </div>
    </header>
  );
};

export default Topbar;

// import { useEffect, useState } from "react";
// import { Search, RefreshCw, RotateCcw, CalendarDays } from "lucide-react";

// const Topbar = ({ onApplyFilters, onRefresh }) => {
//   const [search, setSearch] = useState("");
//   const [district, setDistrict] = useState("");
//   const [city, setCity] = useState("");
//   const [date, setDate] = useState("");

//   // Districts are the keys from your telanganaDistricts.js file.
//   const [districts, setDistricts] = useState([]);
//   const [cities, setCities] = useState([]);

//   useEffect(() => {
//     const loadLocations = async () => {
//       try {
//         // Uses your existing backend API base URL.
//         const { default: api } = await import("../services/api");

//         const response = await api.get("/box-office/districts/locations");

//         setDistricts(response.data.districts || []);
//         setCities(response.data.cities || []);
//       } catch (error) {
//         console.error("Unable to load filter locations:", error);
//       }
//     };

//     loadLocations();
//   }, []);

//   const filteredCities = cities.filter((item) => {
//     const matchesDistrict = !district || item.district === district;
//     return matchesDistrict;
//   });

//   const applyFilters = () => {
//     onApplyFilters?.({
//       search: search.trim(),
//       district,
//       city,
//       date,
//       language: "Telugu",
//       state: "Telangana",
//     });
//   };

//   const resetFilters = () => {
//     setSearch("");
//     setDistrict("");
//     setCity("");
//     setDate("");

//     onApplyFilters?.({
//       search: "",
//       district: "",
//       city: "",
//       date: "",
//       language: "Telugu",
//       state: "Telangana",
//     });
//   };

//   return (
//     <header className="topbar topbar-global">
//       <div className="topbar-heading">
//         <h2 className="topbar-title">Box Office Overview</h2>
//         <p className="topbar-location">Telangana · Telugu Movies</p>
//       </div>

//       <div className="global-filter-panel">
//         <div className="global-filter-search">
//           <Search size={16} />
//           <input
//             type="search"
//             placeholder="Search movies, cities, theatres..."
//             value={search}
//             onChange={(event) => setSearch(event.target.value)}
//             onKeyDown={(event) => {
//               if (event.key === "Enter") applyFilters();
//             }}
//             aria-label="Search movies, cities, and theatres"
//           />
//         </div>

//         <select
//           value={district}
//           onChange={(event) => {
//             setDistrict(event.target.value);
//             setCity("");
//           }}
//           aria-label="Filter by district"
//         >
//           <option value="">All districts</option>
//           {districts.map((item) => (
//             <option key={item} value={item}>
//               {item}
//             </option>
//           ))}
//         </select>

//         <select
//           value={city}
//           onChange={(event) => setCity(event.target.value)}
//           aria-label="Filter by city"
//         >
//           <option value="">All cities</option>
//           {filteredCities.map((item) => (
//             <option key={`${item.district}-${item.city}`} value={item.city}>
//               {item.city}
//             </option>
//           ))}
//         </select>

//         <div className="global-filter-date">
//           <CalendarDays size={15} />
//           <input
//             type="date"
//             value={date}
//             onChange={(event) => setDate(event.target.value)}
//             aria-label="Filter by show date"
//           />
//         </div>

//         <button
//           type="button"
//           className="global-filter-apply"
//           onClick={applyFilters}
//         >
//           Apply
//         </button>

//         <button
//           type="button"
//           className="icon-button"
//           onClick={resetFilters}
//           title="Reset filters"
//           aria-label="Reset filters"
//         >
//           <RotateCcw size={16} />
//         </button>

//         <button
//           type="button"
//           className="icon-button"
//           onClick={onRefresh}
//           title="Refresh dashboard"
//           aria-label="Refresh dashboard"
//         >
//           <RefreshCw size={17} />
//         </button>
//       </div>
//     </header>
//   );
// };

// export default Topbar;
