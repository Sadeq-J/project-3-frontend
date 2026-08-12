import { Link } from "react-router";
import { useAuth } from "../context/AuthContext";
import maidanLogo from "../assets/maidan-logo.svg";

function Navbar() {
  const { logout, user } = useAuth();

  let parsedStoredUser = null;
  try {
    const storedUser = localStorage.getItem("user");
    parsedStoredUser = storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    localStorage.removeItem("user");
  }

  const isAdmin = Boolean(user?.isAdmin ?? parsedStoredUser?.isAdmin);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <img src={maidanLogo} alt="MAIDAN logo" className="h-11 w-auto rounded-lg bg-white/80 p-1 shadow-sm ring-1 ring-slate-200" />
          <div className="leading-none">
            <p className="text-lg font-black tracking-[0.14em] text-slate-900">MAIDAN</p>
            <p className="mt-1 text-[9px] uppercase tracking-[0.28em] text-slate-500">Sports booking</p>
          </div>
        </Link>

        <div className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
          <Link to="/" className="transition-colors hover:text-slate-900">Home</Link>
          <Link to="/venues" className="transition-colors hover:text-slate-900">Venues</Link>
          {user && <Link to="/my-profile" className="transition-colors hover:text-slate-900">Profile</Link>}
          {isAdmin && <Link to="/admin" className="transition-colors hover:text-slate-900">Admin</Link>}
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link to="/my-profile" className="hidden items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 transition-all hover:border-slate-300 sm:inline-flex">
                {user.username || "Profile"}
              </Link>
              <button type="button" onClick={logout} className="secondary-button">
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link to="/sign-in" className="secondary-button">Sign in</Link>
              <Link to="/sign-up" className="primary-button">Create account</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
