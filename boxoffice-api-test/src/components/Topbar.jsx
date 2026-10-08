import { Search, RefreshCw } from "lucide-react";

const Topbar = () => {
  return (
    <header className="topbar">
      <div>
        <h2 className="topbar-title">Box Office Overview</h2>

        <p className="topbar-location">Telangana</p>
      </div>

      <div className="topbar-actions">
        <div className="search-box">
          <Search size={16} />

          <input type="text" placeholder="Search movies..." />
        </div>

        <button className="icon-button">
          <RefreshCw size={17} />
        </button>
      </div>
    </header>
  );
};

export default Topbar;
