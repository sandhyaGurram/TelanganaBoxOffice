import { Search, RefreshCw } from "lucide-react";

const Topbar = () => {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-slate-800 bg-slate-950/95 px-6 backdrop-blur">
      <div>
        <h2 className="text-lg font-semibold text-white">
          Box Office Overview
        </h2>

        <p className="text-xs text-slate-500">Telangana</p>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900 px-3 py-2">
          <Search size={16} className="text-slate-500" />

          <input
            type="text"
            placeholder="Search movies..."
            className="w-48 bg-transparent text-sm text-white outline-none placeholder:text-slate-600"
          />
        </div>

        <button className="rounded-lg border border-slate-800 bg-slate-900 p-2 text-slate-400 hover:text-white">
          <RefreshCw size={18} />
        </button>
      </div>
    </header>
  );
};

export default Topbar;
