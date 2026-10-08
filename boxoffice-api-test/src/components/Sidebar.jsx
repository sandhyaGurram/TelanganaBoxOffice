import {
  LayoutDashboard,
  Film,
  Map,
  Building2,
  BarChart3,
  Settings,
} from "lucide-react";

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <h1 className="sidebar-title">Telangana Box Office</h1>

        <p className="sidebar-subtitle">Analytics Dashboard</p>
      </div>

      <nav className="sidebar-nav">
        <a href="/" className="sidebar-link active">
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </a>

        <a href="#movies" className="sidebar-link">
          <Film size={18} />
          <span>Movies</span>
        </a>

        <a href="#districts" className="sidebar-link">
          <Map size={18} />
          <span>Cites</span>
        </a>

        <a href="#theatres" className="sidebar-link">
          <Building2 size={18} />
          <span>Theatres</span>
        </a>

        <a href="#analytics" className="sidebar-link">
          <BarChart3 size={18} />
          <span>Analytics</span>
        </a>

        <a href="#settings" className="sidebar-link">
          <Settings size={18} />
          <span>Settings</span>
        </a>
      </nav>
    </aside>
  );
};

export default Sidebar;
