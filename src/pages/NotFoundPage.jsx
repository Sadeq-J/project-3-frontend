import { Link, useNavigate } from "react-router";

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[75vh] flex-col items-center justify-center text-center px-4 py-12">
      <div className="panel-surface relative overflow-hidden max-w-2xl w-full p-8 sm:p-12 border border-slate-200/80 shadow-xl bg-white/90 backdrop-blur-md rounded-3xl">
        {/* Background ambient decorative glow */}
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Error Badge */}
        <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-emerald-700 ring-1 ring-emerald-600/20">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Error 404
        </span>

        {/* 404 Visual Graphic */}
        <div className="my-6 flex justify-center">
          <div className="relative flex items-center justify-center">
            <h1 className="text-8xl sm:text-9xl font-black text-slate-900 tracking-tighter opacity-90 select-none">
              4<span className="text-emerald-500">0</span>4
            </h1>
          </div>
        </div>

        {/* Title & Description */}
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Out of Bounds!
        </h2>
        <p className="mt-3 text-slate-600 max-w-md mx-auto text-sm sm:text-base leading-relaxed">
          The page or pitch you are searching for doesn't exist, has been moved, or is temporarily out of play.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="secondary-button w-full sm:w-auto px-6 py-3 cursor-pointer"
          >
            ← Go Back
          </button>
          <Link
            to="/"
            className="primary-button w-full sm:w-auto px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white"
          >
            Back to Home
          </Link>
          <Link
            to="/venues"
            className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-emerald-700 shadow-sm w-full sm:w-auto"
          >
            Browse Venues
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;
