import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { signOut } from "firebase/auth";

import { auth } from "../config/firebase";
import { useAuth } from "../context/useAuth";

function Navbar() {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleLogout() {
    await signOut(auth);
  }

  const userName = user?.displayName || user?.email?.split("@")[0] || "Player";
  const isActive = (path) => location.pathname === path;

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <nav className="sticky top-0 z-30 w-full border-b border-gray-100 bg-white/95 shadow-sm backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 md:px-8">
        <Link to="/" onClick={closeMenu} className="flex items-center gap-2 text-xl font-black tracking-tight text-gray-950">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-500 text-lg shadow-sm">🏀</span>
          <span>Court<span className="text-orange-500">Mate</span></span>
        </Link>

        <div className="hidden items-center gap-2 md:flex">
          {[
            ["/", "Home"],
            ["/games", "Find Games"],
            ["/my-games", "My Games"],
          ].map(([path, label]) => (
            <Link key={path} to={path} className={`rounded-full px-4 py-2 text-sm font-semibold transition ${isActive(path) ? "bg-orange-50 text-orange-600" : "text-gray-600 hover:bg-gray-50 hover:text-orange-600"}`}>
              {label}
            </Link>
          ))}
          <Link to="/host" className="ml-2 rounded-full bg-gray-950 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-orange-500">Host a Game</Link>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {loading ? (
            <span className="text-sm text-gray-500">Checking account...</span>
          ) : user ? (
            <>
              <Link to="/profile" className="flex items-center gap-2 rounded-full border border-gray-200 px-3 py-1.5 text-sm font-semibold text-gray-700 transition hover:border-orange-300 hover:text-orange-600">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-100 text-xs">🏀</span>
                Hi, {userName}
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-red-200 hover:text-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-orange-300 hover:text-orange-600"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="rounded-full bg-orange-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-orange-600"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        <button type="button" onClick={() => setMenuOpen((open) => !open)} className="rounded-xl border border-gray-200 px-3 py-2 text-lg text-gray-700 md:hidden" aria-label="Toggle navigation menu" aria-expanded={menuOpen}>
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-gray-100 bg-white px-5 pb-5 pt-3 md:hidden">
          <div className="flex flex-col gap-1">
            {[["/", "Home"], ["/games", "Find Games"], ["/my-games", "My Games"], ["/host", "Host a Game"]].map(([path, label]) => (
              <Link key={path} to={path} onClick={closeMenu} className={`rounded-xl px-4 py-3 text-sm font-semibold ${isActive(path) ? "bg-orange-50 text-orange-600" : "text-gray-700 hover:bg-gray-50"}`}>{label}</Link>
            ))}
          </div>
          <div className="mt-3 border-t border-gray-100 pt-3">
            {loading ? <span className="px-4 text-sm text-gray-500">Checking account...</span> : user ? (
              <div className="flex items-center justify-between gap-3 px-4">
                <Link to="/profile" onClick={closeMenu} className="text-sm font-semibold text-gray-700">Hi, {userName}</Link>
                <button type="button" onClick={handleLogout} className="text-sm font-semibold text-red-600">Logout</button>
              </div>
            ) : <div className="flex gap-2 px-4"><Link to="/login" onClick={closeMenu} className="flex-1 rounded-xl border border-gray-200 px-4 py-2 text-center text-sm font-semibold">Login</Link><Link to="/register" onClick={closeMenu} className="flex-1 rounded-xl bg-orange-500 px-4 py-2 text-center text-sm font-bold text-white">Sign Up</Link></div>}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
