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
    <aside className="fixed left-0 top-0 h-screen w-64 border-r border-slate-800 bg-slate-950">
      <div className="border-b border-slate-800 px-6 py-5">
        <h1 className="text-xl font-bold text-white">Telangana Box Office</h1>

        <p className="mt-1 text-xs text-slate-500">Analytics Dashboard</p>
      </div>

      <nav className="space-y-1 p-4">
        <a
          href="/"
          className="flex items-center gap-3 rounded-lg bg-slate-800 px-4 py-3 text-sm text-white"
        >
          <LayoutDashboard size={18} />
          Dashboard
        </a>

        <a
          href="#movies"
          className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-slate-400 hover:bg-slate-900 hover:text-white"
        >
          <Film size={18} />
          Movies
        </a>

        <a
          href="#districts"
          className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-slate-400 hover:bg-slate-900 hover:text-white"
        >
          <Map size={18} />
          Districts
        </a>

        <a
          href="#theatres"
          className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-slate-400 hover:bg-slate-900 hover:text-white"
        >
          <Building2 size={18} />
          Theatres
        </a>

        <a
          href="#analytics"
          className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-slate-400 hover:bg-slate-900 hover:text-white"
        >
          <BarChart3 size={18} />
          Analytics
        </a>

        <a
          href="#settings"
          className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-slate-400 hover:bg-slate-900 hover:text-white"
        >
          <Settings size={18} />
          Settings
        </a>
      </nav>
    </aside>
  );
};

export default Sidebar;
